export const handler = async () => {
  const res = await fetch(`${process.env.STAGING_URL}/api/compile`, {
    headers: {
      "x-api-key": process.env.INTERNAL_API_KEY!,
    },
  });

  if (!res.ok) {
    throw new Error(`Compile failed: ${res.status}`);
  }

  console.log("Compile triggered");
};