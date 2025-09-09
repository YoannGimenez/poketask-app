import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import authService from "@/api/authService";
import {User} from "@/models/User";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: { message: string; code: string } }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: { message: string; code: string } }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  needsStarter: boolean;
  setNeedsStarter: (v: boolean) => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsStarter, setNeedsStarter] = useState(false);

  const checkAuth = async () => {
    try {
      const data = await authService.checkAuth();
      setUser(data.user);
      setIsAuthenticated(true);
      setNeedsStarter(!!data.needsStarter);
    } catch {
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      setNeedsStarter(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await authService.login(email, password);

      if (result.success) {
        await AsyncStorage.setItem('authToken', result.data.token);
        setUser(result.data.user);
        setIsAuthenticated(true);
        setNeedsStarter(result.data.user.pokemonsCount === 0);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: {
          message: 'Erreur de connexion',
          code: 'UNKNOWN_ERROR'
        }
      };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const result = await authService.register(username, email, password);

      if (result.success) {
        await AsyncStorage.setItem('authToken', result.data.token);
        setUser(result.data.user);
        setIsAuthenticated(true);
        setNeedsStarter(true);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: {
          message: 'Erreur lors de l\'inscription',
          code: 'UNKNOWN_ERROR'
        }
      };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      router.replace(isAuthenticated ? '/(app)/home' : '/(auth)/welcome');
    }
  }, [isAuthenticated, isLoading]);

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    needsStarter,
    setNeedsStarter,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
