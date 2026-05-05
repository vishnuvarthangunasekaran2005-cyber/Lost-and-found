// frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/authApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setCurrentUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await apiLogin({ email, password });
    const user = data.data;
    localStorage.setItem('accessToken', user.accessToken);
    localStorage.setItem('refreshToken', user.refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
    return user;
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await apiRegister(formData);
    const user = data.data;
    localStorage.setItem('accessToken', user.accessToken);
    localStorage.setItem('refreshToken', user.refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setCurrentUser(null);
  }, []);

  const hasRole = useCallback((role) => {
    return currentUser?.roles?.includes(role);
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}
