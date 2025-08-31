// Cloudflare Pages Function to check if system API key is available
export async function onRequest(context) {
  const { env } = context;
  
  // Check if GROQ_API_KEY is available in environment
  const hasSystemKey = !!env.GROQ_API_KEY;
  
  return new Response(JSON.stringify({ 
    hasSystemKey,
    message: hasSystemKey ? 'System key available' : 'No system key configured'
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}