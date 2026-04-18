/**
 * Docente SIS - Global TypeScript Types
 */

export interface UserProfile {
  nombre: string;
  institucion: string;
  email: string;
}

export interface Alumno {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  alergias?: string;
  condiciones?: string;
}

export interface Incidencia {
  id: number;
  alumnoId: number;
  alumnoNombre?: string;
  descripcion: string;
  fecha: string;
}

export interface AIValidationResult {
  score: number;
  curriculumAlignment: 'cumple' | 'parcial' | 'no_cumple';
  ageAppropriate: boolean;
  errors: string[];
  suggestions: string[];
  recommendation: 'aprobar' | 'revisar' | 'rechazar';
}
