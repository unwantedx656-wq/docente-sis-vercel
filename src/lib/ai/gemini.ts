/**
 * Docente SIS - AI Integration (Client Wrappers)
 */

export const generateContent = async (prompt: string, curriculumContext: string) => {
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, curriculumContext })
    });

    if (!response.ok) throw new Error('Error al generar contenido con Gemini');
    return await response.json();
  } catch (error) {
    console.error('Gemini Generate Error:', error);
    throw error;
  }
};
