import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient({});

const BACKEND_URL = process.env.STAGING_URL!;
const INTERVAL_MS = Number(process.env.INTERVAL_MIN) * 60_000;

export const handler = async (event: { time?: string }) => {
  try {
    if (!INTERVAL_MS) throw new Error("INTERVAL_MIN env var is missing or invalid");

    // Scheduled time from EventBridge (same in every region), rounded down to the interval.
    // Falls back to "now" for manual test invocations that have no event.time.
    const scheduledAt = Date.parse(event?.time ?? new Date().toISOString());
    const roundAt = new Date(Math.floor(scheduledAt / INTERVAL_MS) * INTERVAL_MS).toISOString();

    const response = await fetch(`${BACKEND_URL}/api/websites`, {
      headers: {
        "x-api-key": process.env.INTERNAL_API_KEY!,
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Backend fetch failed: ${response.status}`);
    }

    const data = await response.json();
    const list = (data as any).websites || [];

    const sites = list.map((w: any) => ({
      id: w.id,
      url: w.url,
    }));

    if (sites.length === 0) {
      console.log("No websites to check.");
      return "Skipped";
    }

    await sqs.send(
      new SendMessageCommand({
        QueueUrl: process.env.QUEUE_URL,
        MessageBody: JSON.stringify({ roundAt, sites }),
      })
    );

    console.log(`Round ${roundAt}: queued ${sites.length} sites.`);
    return "OK";
  } catch (error) {
    console.error("Producer Error:", error);
    throw error;
  }
};