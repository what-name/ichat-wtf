// Cloudflare Pages Function to handle Groq API calls with system key
export async function onRequestPOST(context) {
  const { env, request } = context;
  
  try {
    // Only proceed if system key is available
    if (!env.GROQ_API_KEY) {
      return new Response(JSON.stringify({ 
        error: 'System API key not configured' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Get the request body (messages from frontend)
    const requestData = await request.json();
    const { messages } = requestData;

    // Call Groq API using system key
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'moonshotai/kimi-k2-instruct',
        messages: messages,
        temperature: 1.2,
        max_tokens: 150,
        top_p: 0.95
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${groqResponse.status}: ${groqResponse.statusText}`);
    }

    const data = await groqResponse.json();
    
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Handle CORS preflight
export async function onRequestOPTIONS(context) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}