'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import Cookies from 'js-cookie';
import type { User, AuthState, AuthAction } from '@/types/auth';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = Cookies.get('refresh_token');
      if (!refreshToken) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      const response = await apiClient.post('/auth/refresh', {
        refresh_token: refreshToken,
      });

      const { access_token, user } = response.data;
      
      Cookies.set('access_token', access_token, { expires: 1 });
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: access_token } });
    } catch (error) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        phone: '+1234567890',
        preferences: {
          dietary: [],
          notifications: true,
        },
        loyaltyPoints: 150,
        createdAt: new Date().toISOString(),
      };

      const mockToken = 'mock_jwt_token';
      
      Cookies.set('access_token', mockToken, { expires: 1 });
      Cookies.set('refresh_token', 'mock_refresh_token', { expires: 7 });
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: mockUser, token: mockToken } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Invalid credentials' });
      throw error;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simulate API call - replace with actual registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        phone: '',
        preferences: {
          dietary: [],
          notifications: true,
        },
        loyaltyPoints: 0,
        createdAt: new Date().toISOString(),
      };

      const mockToken = 'mock_jwt_token';
      
      Cookies.set('access_token', mockToken, { expires: 1 });
      Cookies.set('refresh_token', 'mock_refresh_token', { expires: 7 });
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: mockUser, token: mockToken } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Registration failed' });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      // Simulate API call - replace with actual profile update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (state.user) {
        const updatedUser = { ...state.user, ...data };
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update profile' });
      throw error;
    }
  }, [state.user]);

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      refreshToken();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [refreshToken]);

  const value = {
    state,
    login,
    register,
    logout,
    updateProfile,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}