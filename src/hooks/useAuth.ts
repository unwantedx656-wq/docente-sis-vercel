import { useState, useEffect } from 'react';
import { db } from '../lib/db/database';
import { validatePin, getEncryptionKey } from '../lib/crypto/pinManager';

/**
 * Docente SIS - Authentication Hook
 * Handles master PIN state and session key
 */

let sessionKey: CryptoKey | null = null;
let masterPin: string | null = null;

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionKey);
  const [hasPinSet, setHasPinSet] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPinPresence();
  }, []);

  const checkPinPresence = async () => {
    try {
      const pinSalt = await db.metadata.get('pinSalt');
      setHasPinSet(!!pinSalt);
    } catch (error) {
      console.error('Error checking PIN:', error);
      setHasPinSet(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginOrSetup = async (pin: string) => {
    try {
      if (!hasPinSet) return false;
      
      const isValid = await validatePin(pin);
      if (isValid) {
        masterPin = pin;
        sessionKey = await getEncryptionKey(pin);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const logout = () => {
    sessionKey = null;
    masterPin = null;
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    hasPinSet,
    isLoading,
    loginOrSetup,
    logout,
    getSessionKey: () => sessionKey,
    getMasterPin: () => masterPin,
    refreshPinStatus: checkPinPresence
  };
};
