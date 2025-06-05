import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from './AuthServices';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { isAuthenticated, user: userData } = await AuthService.checkAuth();
      if (isAuthenticated && userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Erreur de vérification d\'authentification:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const { success, user: userData, error: loginError } = await AuthService.login({ email, password });
      
      if (success && userData) {
        setUser(userData);
        return true;
      } else {
        setError(loginError);
        return false;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const { success, error: registerError } = await AuthService.register(userData);
      
      if (success) {
        return true;
      } else {
        setError(registerError);
        return false;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur d\'inscription');
      return false;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const { success, user: updatedUser, error: updateError } = await AuthService.updateProfile(userData);
      
      if (success && updatedUser) {
        setUser(updatedUser);
        return true;
      } else {
        setError(updateError);
        return false;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de mise à jour du profil');
      return false;
    }
  };

  const validateAccount = async (email, code) => {
    try {
      setError(null);
      const { success, error: validationError } = await AuthService.validateAccount(email, code);
      
      if (success) {
        return true;
      } else {
        setError(validationError);
        return false;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de validation du compte');
      return false;
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      const { success, error: resetError } = await AuthService.resetPassword(email);
      
      if (success) {
        return true;
      } else {
        setError(resetError);
        return false;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de réinitialisation du mot de passe');
      return false;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    validateAccount,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isResponsable: user?.role === 'responsable'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
