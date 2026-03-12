import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as lambdaSqs from "aws-cdk-lib/aws-lambda-event-sources";

console.time("time:")

export class UptimeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, "RegionQueue");

    const worker = new lambda.Function(this, "WorkerFn", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "worker.handler",
      code: lambda.Code.fromAsset("lambdas"),
      timeout: cdk.Duration.seconds(30),
      environment: {
        // BACKEND_URL:process.env.BACKEND_URL!,
        STAGING_URL: process.env.STAGING_URL!,
        INTERNAL_API_KEY: process.env.INTERNAL_API_KEY!,
      }
    });

    worker.addEventSource(new lambdaSqs.SqsEventSource(queue));
    queue.grantConsumeMessages(worker);

    const scheduler = new lambda.Function(this, "SchedulerFn", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "scheduler.handler",
      code: lambda.Code.fromAsset("lambdas"),
      timeout: cdk.Duration.seconds(30),
      environment: { 
        QUEUE_URL: queue.queueUrl,
        // BACKEND_URL:process.env.BACKEND_URL!,
        STAGING_URL: process.env.STAGING_URL!,
        INTERNAL_API_KEY: process.env.INTERNAL_API_KEY!,
      },
    });

    queue.grantSendMessages(scheduler);
    new events.Rule(this, "Every3Min", {
      schedule: events.Schedule.cron({ minute: "0/3" }),
      targets: [new targets.LambdaFunction(scheduler)],
    });

    
    if (cdk.Stack.of(this).region === "ap-south-1") {
      // cron for ticks compilation and cleanup

      const compiler = new lambda.Function(this, "CompilerFn", {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: "compiler.handler",
        code: lambda.Code.fromAsset("lambdas"),
        timeout: cdk.Duration.seconds(30),
        environment: {
          STAGING_URL: process.env.STAGING_URL!,
          INTERNAL_API_KEY: process.env.INTERNAL_API_KEY!,
        }
      });

      const cleaner = new lambda.Function(this, "CleanupFn", {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: "cleanup.handler",
        code: lambda.Code.fromAsset("lambdas"),
        timeout: cdk.Duration.seconds(30),
      });

      new events.Rule(this, "CompileEveryHour", {
        schedule: events.Schedule.cron({ minute: "0" }),
        targets: [new targets.LambdaFunction(compiler)],
      });

      new events.Rule(this, "CleanupDaily", {
        schedule: events.Schedule.cron({ hour: "0", minute: "0" }),
        targets: [new targets.LambdaFunction(cleaner)],
      });
    }
  }
}

console.timeEnd("time:")