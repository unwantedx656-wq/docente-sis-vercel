import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../lib/db/database';
import { validatePin, getEncryptionKey } from '../lib/crypto/pinManager';

interface AuthContextType {
  isAuthenticated: boolean;
  hasPinSet: boolean | null;
  isLoading: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  refreshPinStatus: () => Promise<void>;
  getSessionKey: () => CryptoKey | null;
  getMasterPin: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let sessionKey: CryptoKey | null = null;
let masterPin: string | null = null;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionKey);
  const [hasPinSet, setHasPinSet] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    checkPinPresence();
  }, []);

  const login = async (pin: string) => {
    try {
      const isValid = await validatePin(pin);
      if (isValid) {
        masterPin = pin;
        sessionKey = await getEncryptionKey(pin);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login error:', e);
      return false;
    }
  };

  const logout = () => {
    sessionKey = null;
    masterPin = null;
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    hasPinSet,
    isLoading,
    login,
    logout,
    refreshPinStatus: checkPinPresence,
    getSessionKey: () => sessionKey,
    getMasterPin: () => masterPin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
