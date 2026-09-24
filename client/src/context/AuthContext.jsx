import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifyUser = async () => {
      const storedToken = authService.getToken();
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (isMounted && res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification issue:', err?.message || err);
          // Only clear session if server explicitly returned 401 Unauthorized
          if (err.response && err.response.status === 401) {
            authService.logout();
            if (isMounted) {
              setUser(null);
              setToken(null);
            }
          }
        }
      } else {
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      }
      if (isMounted) setLoading(false);
    };

    verifyUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
