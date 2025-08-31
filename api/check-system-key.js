export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if we have the system API key configured
  const hasSystemKey = !!process.env.GROQ_API_KEY;
  
  res.json({ hasSystemKey });
}