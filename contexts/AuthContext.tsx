import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../lib/supabase/client';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';

// Define our user types
type UserType = 'merchant' | 'customer' | null;

// Define KYC levels for merchants
export type KycLevel = 1 | 2 | 3 | null;

interface AuthUser {
    id: string;
    email?: string | null;
    phone?: string | null;
    userType: UserType;
    kycLevel?: KycLevel;
    storeId?: string | null;
}

interface AuthContextType {
    user: AuthUser | null;
    session: Session | null;
    isLoading: boolean;
    signIn: (phone: string) => Promise<{ error: Error | null }>;
    verifyOTP: (phone: string, otp: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
    updateUserData: (data: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, newSession: Session | null) => {
            setSession(newSession);

            if (newSession) {
                try {
                    // Fetch user profile data
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', newSession.user.id)
                        .single();

                    if (error) throw error;

                    setUser({
                        id: newSession.user.id,
                        email: newSession.user.email,
                        phone: newSession.user.phone,
                        userType: data?.user_type || null,
                        kycLevel: data?.kyc_level || null,
                        storeId: data?.store_id || null,
                    });
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            } else {
                setUser(null);
            }

            setIsLoading(false);
        });

        // Initial session check
        getInitialSession();

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // Get the initial session
    const getInitialSession = async () => {
        try {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);

            if (data.session) {
                // Fetch user profile data
                const { data: profileData, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.session.user.id)
                    .single();

                if (error) throw error;

                setUser({
                    id: data.session.user.id,
                    email: data.session.user.email,
                    phone: data.session.user.phone,
                    userType: profileData?.user_type || null,
                    kycLevel: profileData?.kyc_level || null,
                    storeId: profileData?.store_id || null,
                });
            }
        } catch (error) {
            console.error('Error getting initial session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Sign in with phone number (requesting OTP)
    const signIn = async (phone: string) => {
        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone,
            });
            return { error };
        } catch (error) {
            return { error: error as Error };
        }
    };

    // Verify OTP after requesting sign in
    const verifyOTP = async (phone: string, otp: string) => {
        try {
            const { error } = await supabase.auth.verifyOtp({
                phone,
                token: otp,
                type: 'sms',
            });
            return { error };
        } catch (error) {
            return { error: error as Error };
        }
    };

    // Sign out
    const signOut = async () => {
        setIsLoading(true);
        await supabase.auth.signOut();
        setIsLoading(false);
    };

    // Refresh session
    const refreshSession = async () => {
        try {
            const { data } = await supabase.auth.refreshSession();
            setSession(data.session);
        } catch (error) {
            console.error('Error refreshing session:', error);
        }
    };

    // Update user data
    const updateUserData = (data: Partial<AuthUser>) => {
        if (user) {
            setUser({ ...user, ...data });
        }
    };

    const value = {
        user,
        session,
        isLoading,
        signIn,
        verifyOTP,
        signOut,
        refreshSession,
        updateUserData,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
} 