import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient({});

// const BACKEND_URL = process.env.BACKEND_URL!;
const BACKEND_URL = process.env.STAGING_URL!;

export const handler = async () => {
  try {
    console.log("URL:", BACKEND_URL);
    console.log("KEY:", process.env.INTERNAL_API_KEY);
    
    const response = await fetch(`${BACKEND_URL}/api/websites`, {
      headers: {
        "x-api-key": process.env.INTERNAL_API_KEY!
      }, 
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`Backend fetch failed: ${response.status}`);
    }

    const data = await response.json();
    
    const list = (data as any).websites || []; 

    const payload = list.map((w: any) => ({ 
      id: w.id, 
      url: w.url 
    }));

    if (payload.length === 0) {
      console.log("No websites to check.");
      return "Skipped";
    }

    await sqs.send(new SendMessageCommand({
      QueueUrl: process.env.QUEUE_URL,
      MessageBody: JSON.stringify(payload),
    }));

    console.log(`Successfully queued ${payload.length} sites.`);
    return "OK";

  } catch (error) {
    console.error("Producer Error:", error);
    throw error;
  }
};