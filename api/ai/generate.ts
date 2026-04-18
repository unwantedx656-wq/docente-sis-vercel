import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route: /api/ai/generate
 * Calls Gemini API to generate pedagogical content
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, curriculumContext } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured in Vercel' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `
              Eres un experto pedagogo peruano especializado en el currículo MINEDU.
              CONTEXTO CURRICULAR:
              ${curriculumContext}
              
              TAREA:
              ${prompt}
              
              REGLAS:
              - Solo usa competencias y capacidades del MINEDU.
              - Lenguaje adaptado al grado.
              - Estructura clara (Objetivo, Actividades, Evaluación).
            `
          }]
        }]
      })
    });

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No content returned from Gemini');
    }

    return res.status(200).json({ content });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
