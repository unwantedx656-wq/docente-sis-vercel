/**
 * Docente SIS - Data Validators
 */

export const validateDNI = (dni: string): boolean => {
  return /^\d{8}$/.test(dni);
};

export const validatePIN = (pin: string): boolean => {
  return /^\d{6}$/.test(pin);
};

export const isEmpty = (val: string | any[] | null | undefined): boolean => {
  if (val === null || val === undefined) return true;
  if (typeof val === 'string') return val.trim().length === 0;
  if (Array.isArray(val)) return val.length === 0;
  return false;
};
