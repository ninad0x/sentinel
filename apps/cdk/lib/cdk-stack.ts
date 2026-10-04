import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as logs from "aws-cdk-lib/aws-logs";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as lambdaSqs from "aws-cdk-lib/aws-lambda-event-sources";

export class UptimeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Env vars shared by every Lambda.
    const commonEnv = {
      STAGING_URL: process.env.STAGING_URL!,
      INTERNAL_API_KEY: process.env.INTERNAL_API_KEY!,
    };

    // Small helper so every function gets the same runtime, code, timeout and 1-week logs.
    const lambdaMakeFn = (
      name: string,
      handler: string,
      extra: { memorySize?: number; environment?: Record<string, string> } = {}
    ) =>
      new lambda.Function(this, name, {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler,
        code: lambda.Code.fromAsset("lambdas"),
        timeout: cdk.Duration.seconds(30),
        memorySize: extra.memorySize,
        environment: { ...commonEnv, ...extra.environment },
        logGroup: new logs.LogGroup(this, `${name}Logs`, {
          retention: logs.RetentionDays.ONE_WEEK,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        }),
      });

    // Messages that failed 3 times land here, for inspection only.
    const dlq = new sqs.Queue(this, "RegionDLQ", {
      retentionPeriod: cdk.Duration.days(1),
    });

    const queue = new sqs.Queue(this, "RegionQueue", {
      visibilityTimeout: cdk.Duration.minutes(1),
      retentionPeriod: cdk.Duration.minutes(10),
      deadLetterQueue: { queue: dlq, maxReceiveCount: 3 },
    });

    const worker = lambdaMakeFn("WorkerFn", "worker.handler", { memorySize: 256 });
    worker.addEventSource(new lambdaSqs.SqsEventSource(queue, { batchSize: 1 }));

    const scheduler = lambdaMakeFn("SchedulerFn", "scheduler.handler", {
      environment: { QUEUE_URL: queue.queueUrl },
    });
    queue.grantSendMessages(scheduler);


    new events.Rule(this, "Every2Min", {
      schedule: events.Schedule.cron({ minute: "0/2" }),
      targets: [new targets.LambdaFunction(scheduler)],
    });

    // Compiler and cleanup run only once, from ap-south-1.
    if (cdk.Stack.of(this).region === "ap-south-1") {
      const compiler = lambdaMakeFn("CompilerFn", "compiler.handler");
      const cleaner = lambdaMakeFn("CleanupFn", "cleanup.handler");

      new events.Rule(this, "CompileEveryHour", {
        schedule: events.Schedule.cron({ minute: "5" }),
        targets: [new targets.LambdaFunction(compiler)],
      });

      new events.Rule(this, "CleanupDaily", {
        schedule: events.Schedule.cron({ hour: "0", minute: "0" }),
        targets: [new targets.LambdaFunction(cleaner)],
      });
    }
  }
}