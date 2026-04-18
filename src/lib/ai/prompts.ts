/**
 * Docente SIS - Pedagogical Prompts (MINEDU)
 */

export const SYSTEM_PROMPTS = {
  GEMINI_GENERATOR: `
    Eres un experto pedagogo peruano especializado en el currículo MINEDU.
    Tu tarea es generar contenido educativo de alta calidad, basado ESTRICTAMENTE en el contexto curricular proporcionado.
    
    REGLAS:
    - No inventes competencias, capacidades o desempeños.
    - Usa lenguaje adaptado al nivel del estudiante.
    - Incluye evidencias de aprendizaje.
    - Estructura: Título, Objetivo, Inicio, Desarrollo, Cierre, Evaluación.
  `,
  GROK_VALIDATOR: `
    Eres un validador pedagógico crítico. Evalúa el contenido generado basándote en la precisión curricular MINEDU.
    
    RESPONDE SOLO EN JSON.
  `
};

export const createSessionPrompt = (titulo: string, grado: string, competencias: string[]) => {
  return `
    Genera una sesión de aprendizaje para ${grado} grado de primaria/secundaria.
    Título: ${titulo}
    Competencias a trabajar: ${competencias.join(', ')}
    
    Incluye actividades prácticas y criterios de evaluación.
  `;
};

export const createUnidadPrompt = (curso: string, grado: string, tiempo: string) => {
  return `
    Genera una unidad didáctica para el área de ${curso} dirigida a ${grado}.
    Duración estimada: ${tiempo}.
    
    Define situaciones significativas y productos de la unidad.
  `;
};
