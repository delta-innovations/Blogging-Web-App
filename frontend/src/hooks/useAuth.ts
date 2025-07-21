"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/types"; // Import User type

// Simple event emitter for auth state changes
const authEventEmitter = {
  listeners: [] as (() => void)[],
  emit: function () {
    this.listeners.forEach((listener) => listener());
  },
  subscribe: function (listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  },
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null); // Use User type
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      authEventEmitter.emit(); // Notify subscribers (e.g., Navbar)
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/register", { username, email, password });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      authEventEmitter.emit(); // Notify subscribers
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await axios.post("http://localhost:5000/api/auth/logout", {}, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
      }
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      authEventEmitter.emit(); // Notify subscribers
      queryClient.clear();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  return { user, login, register, logout, isLoading, authEventEmitter };
}