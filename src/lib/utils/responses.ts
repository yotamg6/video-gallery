export const respondWithError = (
  message = "Internal Server Error",
  status = 500
) => {
  console.log("Upload API error:", message);

  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};
