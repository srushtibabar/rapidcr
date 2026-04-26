// RapidCR — AI proxy endpoint
// Keeps the Groq API key server-side. Never exposed to the browser.

export const config = { runtime: 'edge' };

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

export default async function handler(req) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) {
    return json({ error: 'Server misconfiguration: API key not set.' }, 500);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const { prompt, mode } = body;

  if (!prompt || typeof prompt !== 'string' || prompt.length > 4000) {
    return json({ error: 'Invalid prompt.' }, 400);
  }

  if (!['triage', 'report'].includes(mode)) {
    return json({ error: 'Invalid mode. Must be triage or report.' }, 400);
  }

  // Rate-limit hint via headers (Vercel edge caches nothing here)
  const systemPrompt = mode === 'triage'
    ? 'You are RapidCR, an AI crisis triage assistant for community safety. Be concise, structured, and professional. Always format with clear section headers.'
    : 'You are RapidCR, an AI that generates professional post-incident compliance reports. Be thorough, structured, and use formal language suitable for management review and insurance.';

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.json();
      return json({ error: err.error?.message || 'Groq API error.' }, 502);
    }

    const data = await groqRes.json();
    const result = data.choices?.[0]?.message?.content || 'No response received.';

    return json({ result }, 200);
  } catch (err) {
    return json({ error: 'Failed to reach AI service. Try again.' }, 503);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    },
  });
}
