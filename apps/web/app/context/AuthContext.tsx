"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "../lib/api";

export interface User {
  id: string;
  email: string;
  role: string;
  plan: string;
  isVerified: boolean;
  avatarUrl?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the cookie session is valid on initial load
    const verifySession = async () => {
      try {
        // Axios will automatically send the access_token cookie
        const response = await apiRequest<{ id: string; email: string; role: string; plan: string; isVerified: boolean; avatarUrl?: string | null }>('/users/profile');
        setUser(response);
      } catch (error) {
        console.warn("Session invalid or expired", error);
        setUser(null);
      }
      setIsLoading(false);
    };

    verifySession();
  }, []);

  const login = (token: string, userData: User) => {
    // We no longer need to save the token in localStorage since it's now a secure HTTP-Only Cookie!
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error("Logout failed", e);
    }
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
