export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) {
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

  const systemPrompt = mode === 'triage'
    ? 'You are RapidCR, an AI crisis triage assistant for community safety. Be concise, structured, and professional. Always format with clear section headers.'
    : 'You are RapidCR, an AI that generates professional post-incident compliance reports. Be thorough, structured, and use formal language suitable for management review and insurance.';

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

  try {
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.json();
      return json({ error: err.error?.message || 'Gemini API error.' }, 502);
    }

    const data = await geminiRes.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';

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
      'Access-Control-Allow-Origin': '*',
    },
  });
}
