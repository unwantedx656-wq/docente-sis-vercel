import { db } from '../db/database';
import { arrayBufferToBase64, deriveKey } from './encryption';

/**
 * Manages the Master PIN logic
 */
export const setupMasterPin = async (pin: string) => {
  if (pin.length !== 6) throw new Error('El PIN debe tener 6 dígitos');
  
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 100000;
  
  // Guardar metadata en DB
  await db.metadata.put({ key: 'pinSalt', value: arrayBufferToBase64(salt.buffer) });
  await db.metadata.put({ key: 'pinIterations', value: iterations });
  
  // Opcional: Guardar un hash para validación rápida (sin poder derivar la clave)
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(pin + arrayBufferToBase64(salt.buffer)));
  await db.metadata.put({ key: 'pinHash', value: arrayBufferToBase64(hashBuffer) });

  return true;
};

export const validatePin = async (pin: string): Promise<boolean> => {
  const saltMeta = await db.metadata.get('pinSalt');
  const hashMeta = await db.metadata.get('pinHash');
  
  if (!saltMeta || !hashMeta) return false;
  
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(pin + saltMeta.value));
  const currentHash = arrayBufferToBase64(hashBuffer);
  
  return currentHash === hashMeta.value;
};

export const getEncryptionKey = async (pin: string): Promise<CryptoKey> => {
  const saltMeta = await db.metadata.get('pinSalt');
  const iterMeta = await db.metadata.get('pinIterations');
  
  if (!saltMeta) throw new Error('No se ha configurado un PIN Maestro');
  
  const salt = new Uint8Array(atob(saltMeta.value).split('').map(c => c.charCodeAt(0)));
  const iterations = iterMeta ? Number(iterMeta.value) : 100000;
  
  return deriveKey(pin, salt, iterations);
};
