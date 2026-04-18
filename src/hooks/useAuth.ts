import { useAuthContext } from '../context/AuthContext';

/**
 * Docente SIS - Authentication Hook
 * Redirection wrapper for AuthContext
 */
export const useAuth = () => {
  const context = useAuthContext();
  
  return {
    ...context,
    // Aliasing login to loginOrSetup for compatibility with existing components
    loginOrSetup: context.login
  };
};
