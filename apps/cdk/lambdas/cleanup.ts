export const handler = async () => {
  const res = await fetch(`${process.env.STAGING_URL}/api/cleanup`, {
    headers: {
      "x-api-key": process.env.INTERNAL_API_KEY!,
    },
  });

  if (!res.ok) {
    throw new Error(`Cleanup failed: ${res.status}`);
  }

  console.log("Cleanup triggered");
};