"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '@/lib/services/auth';

type AuthContextType = {
    user: authService.AuthUser | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (payload: authService.RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<authService.AuthUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const result = await authService.getProfile();
                if (result?.user) {
                    setUser(result.user);
                }
            } catch (e) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            const result = await authService.login({ email, password });
            setUser(result.user);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    const register = async (payload: authService.RegisterPayload) => {
        try {
            setError(null);
            const result = await authService.register(payload);
            setUser(result.user);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Registration failed');
            throw err;
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
