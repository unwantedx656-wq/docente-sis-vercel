import { fetchCurriculumFile } from './parser';

/**
 * Docente SIS - Curriculum Context Builder
 * Constructs the necessary context for AI based on grade/level
 */

export const getCurriculumContext = async (grade: string, level: 'primaria' | 'secundaria' | string): Promise<string> => {
  const baseContext = await fetchCurriculumFile('minedu-base.txt');
  let specificContext = '';

  if (level.toLowerCase().includes('primaria')) {
    specificContext = await fetchCurriculumFile('minedu-primaria.txt');
  } else if (level.toLowerCase().includes('secundaria')) {
    specificContext = await fetchCurriculumFile('minedu-secundaria.txt');
  }

  const competencias = await fetchCurriculumFile('minedu-competencias.txt');

  return `
    --- BASE CURRICULAR ---
    ${baseContext}
    
    --- CONTEXTO ESPECIFICO ---
    ${specificContext}
    
    --- COMPETENCIAS RELACIONADAS ---
    ${competencias}
    
    ESTUDIANTE: Grado ${grade}
  `;
};
