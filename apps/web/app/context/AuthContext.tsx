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
    const verifySession = async () => {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Auth timeout")), 5000)
      );

      try {
        const response = await Promise.race([
          apiRequest<{ id: string; email: string; role: string; plan: string; isVerified: boolean; avatarUrl?: string | null }>('/users/profile'),
          timeoutPromise
        ]) as User;

        setUser(response);
      } catch (error) {
        console.warn("Session verification failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = (token: string, userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error("Logout failed", e);
    }
    // Clear residual localStorage tokens just in case
    localStorage.removeItem("accessToken");
    setUser(null);
    window.location.href = "/";
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
