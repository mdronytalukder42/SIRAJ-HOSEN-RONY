
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, Role } from '../types';
import { apiLogin, apiLogout } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, pass: string, role: Role) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from session storage', error);
      sessionStorage.removeItem('user');
    } finally {
        setLoading(false);
    }
  }, []);

  const login = useCallback(async (username: string, pass: string, role: Role) => {
    try {
        const loggedInUser = await apiLogin(username, pass, role);
        if (loggedInUser) {
            setUser(loggedInUser);
            sessionStorage.setItem('user', JSON.stringify(loggedInUser));
            const path = loggedInUser.role === Role.Admin ? '/admin' : '/staff';
            navigate(path, { replace: true });
        } else {
            throw new Error('Invalid credentials or role');
        }
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
  }, [navigate]);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    sessionStorage.removeItem('user');
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};