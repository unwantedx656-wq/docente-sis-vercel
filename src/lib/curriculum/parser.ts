/**
 * Docente SIS - Curriculum Parser
 * Reads and processes .txt files from public/curriculum
 */

export const fetchCurriculumFile = async (fileName: string): Promise<string> => {
  try {
    const response = await fetch(`/curriculum/${fileName}`);
    if (!response.ok) throw new Error(`Could not load ${fileName}`);
    return await response.text();
  } catch (error) {
    console.error(`Error loading curriculum ${fileName}:`, error);
    return '';
  }
};

export const parseCompetencias = (text: string): string[] => {
  // Simple parsing: split by lines and filter those starting with '-'
  return text.split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-'))
    .map(line => line.substring(1).trim());
};
