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
    // Check if token exists in localStorage on initial load
    const verifySession = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          // If we have a token, fetch the user's latest profile to ensure token is valid
          const response = await apiRequest<{ id: string; email: string; role: string; plan: string; isVerified: boolean; avatarUrl?: string | null }>('/users/profile');
          setUser(response);
        } catch (error) {
          console.error("Session invalid or expired", error);
          // Token is invalid or expired, clean up
          localStorage.removeItem("accessToken");
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("accessToken", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    // Optionally trigger a redirect to /login here
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
