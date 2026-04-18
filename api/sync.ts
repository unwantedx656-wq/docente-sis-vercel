import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route: /api/sync
 * Acknowledges receipt of offline data batch.
 * In production, this would persist data to a central cloud database.
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { batch } = req.body;

  if (!batch || !Array.isArray(batch)) {
    return res.status(400).json({ error: 'Batch must be an array' });
  }

  // LOG de sincronización (Simulado)
  console.log(`Recibidos ${batch.length} registros para sincronizar.`);

  // Retornamos éxito para que el cliente marque como sincronizado
  return res.status(200).json({ 
    success: true, 
    synced_count: batch.length,
    timestamp: Date.now() 
  });
}
