'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
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
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
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

      const response = await api.auth.refresh(refreshToken);
      const { accessToken, user } = response.data;
      
      Cookies.set('access_token', accessToken, { expires: 1 });
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: accessToken } });
    } catch (error) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.auth.login({ email, password });
      const { user, accessToken, refreshToken } = response.data;
      
      Cookies.set('access_token', accessToken, { expires: 1 });
      Cookies.set('refresh_token', refreshToken, { expires: 7 });
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: accessToken } });
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string, phone?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await api.auth.register({ email, password, name, phone });
      const { user, accessToken, refreshToken } = response.data;
      
      Cookies.set('access_token', accessToken, { expires: 1 });
      Cookies.set('refresh_token', refreshToken, { expires: 7 });
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: accessToken } });
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
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
      if (state.user) {
        const updatedUser = { ...state.user, ...data };
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update profile';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
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