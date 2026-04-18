/**
 * Docente SIS - Grok Validation wrapper
 */

export const validateContent = async (contenido: string, grade: string, course: string) => {
  try {
    const response = await fetch('/api/ai/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenido, grade, course })
    });

    if (!response.ok) throw new Error('Error al validar contenido con Grok');
    return await response.json();
  } catch (error) {
    console.error('Grok Validation Error:', error);
    throw error;
  }
};
