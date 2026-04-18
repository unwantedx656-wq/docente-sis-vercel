import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route: /api/ai/validate
 * Calls Grok API to validate pedagogical content alignment with MINEDU
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { contenido, grade, course } = req.body;
  const API_KEY = process.env.GROK_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'GROK_API_KEY not configured in Vercel' });
  }

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-1', // O el modelo disponible
        messages: [
          {
            role: 'system',
            content: `
              Eres un validador pedagógico crítico del currículo MINEDU (Perú).
              Tu tarea es evaluar el contenido generado para ${grade} en el área de ${course}.
              
              RESPONDE SOLO EN JSON:
              {
                "score": 0-100,
                "curriculumAlignment": "cumple|parcial|no_cumple",
                "ageAppropriate": true/false,
                "errors": ["error1", "error2"],
                "suggestions": ["mejora1", "mejora2"],
                "recommendation": "aprobar|revisar|rechazar"
              }
            `
          },
          {
            role: 'user',
            content: contenido
          }
        ],
        temperature: 0
      })
    });

    const data = await response.json();
    const result = JSON.parse(data.choices?.[0]?.message?.content || '{}');

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
