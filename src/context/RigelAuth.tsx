import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface RigelAuthContext {
    user: User | null;
    session: Session | null;
    loading: boolean;
    profile: any | null;
    subscription: any | null;
    isTrial: boolean;
    hasPremiumAccess: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<RigelAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any | null>(null);
    const [subscriptionData, setSubscriptionData] = useState<any | null>(null);

    const isTrial = subscriptionData?.status === 'trial';
    const hasPremiumAccess = subscriptionData?.status === 'pro_monthly' || subscriptionData?.status === 'pro_yearly';

    const fetchProfile = async (userId: string) => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (data) setProfile(data);
    };

    const fetchSubscription = async (userId: string) => {
        const { data } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (data) setSubscriptionData(data);
    };

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
            setSession(initialSession);
            setUser(initialSession?.user ?? null);
            if (initialSession?.user) {
                fetchProfile(initialSession.user.id);
                fetchSubscription(initialSession.user.id);
            }
            setLoading(false);
        });

        // Auth state listener
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            if (currentSession?.user) {
                fetchProfile(currentSession.user.id);
                fetchSubscription(currentSession.user.id);
            } else {
                setProfile(null);
                setSubscriptionData(null);
            }
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const value = {
        user,
        session,
        loading,
        profile,
        subscription: subscriptionData,
        isTrial,
        hasPremiumAccess,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
