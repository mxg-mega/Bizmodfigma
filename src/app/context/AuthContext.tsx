import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';
import { appCache } from '../utils/localCache';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  onboardingCompleted: boolean;
  setOnboardingCompleted: (completed: boolean) => void;
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompletedState] = useState(false);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        // First check for demo session in localStorage
        const demoSession = localStorage.getItem('supabase.auth.token');
        if (demoSession) {
          try {
            const parsed = JSON.parse(demoSession);
            if (parsed.currentSession) {
              console.log('Restored demo session from localStorage');
              setSession(parsed.currentSession);
              setUser(parsed.currentSession.user);
              
              // Check onboarding status
              const onboardingStatus = localStorage.getItem(`onboarding-completed-${parsed.currentSession.user.id}`);
              setOnboardingCompletedState(onboardingStatus === 'true');
              
              setLoading(false);
              return;
            }
          } catch (e) {
            console.log('Failed to parse demo session, trying Supabase...');
          }
        }
        
        // Try Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check onboarding status if user exists
        if (session?.user) {
          const onboardingStatus = localStorage.getItem(`onboarding-completed-${session.user.id}`);
          setOnboardingCompletedState(onboardingStatus === 'true');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check onboarding status when auth state changes
      if (session?.user) {
        const onboardingStatus = localStorage.getItem(`onboarding-completed-${session.user.id}`);
        setOnboardingCompletedState(onboardingStatus === 'true');
      } else {
        setOnboardingCompletedState(false);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Wrapper to save onboarding status to localStorage
  const setOnboardingCompleted = (completed: boolean) => {
    setOnboardingCompletedState(completed);
    if (user) {
      localStorage.setItem(`onboarding-completed-${user.id}`, completed.toString());
      console.log('Onboarding status saved:', completed);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Trim and normalize
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();
      const trimmedName = name.trim();
      
      console.log('Attempting signup with:', { email: trimmedEmail, name: trimmedName });
      
      // For demo purposes, accept any signup and create a mock user
      // This allows testing without requiring real Supabase email configuration
      const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const mockUser = {
        id: userId,
        email: trimmedEmail,
        user_metadata: {
          name: trimmedName,
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User;

      const mockSession = {
        access_token: `token-${userId}`,
        refresh_token: `refresh-${userId}`,
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser,
      } as Session;

      // Store user credentials for future login
      const users = JSON.parse(localStorage.getItem('demo-users') || '{}');
      users[trimmedEmail] = {
        password: trimmedPassword,
        name: trimmedName,
        userId: userId,
      };
      localStorage.setItem('demo-users', JSON.stringify(users));

      setUser(mockUser);
      setSession(mockSession);
      
      // Store session in localStorage
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: mockSession,
      }));
      
      console.log('Demo signup successful!');
      return { error: null };
    } catch (error) {
      console.error('Signup exception:', error);
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Trim whitespace from credentials
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();
      
      console.log('Attempting login with:', { email: trimmedEmail });
      
      // Check for default demo credentials first
      if ((trimmedEmail === "demo@bizmod.ng" || trimmedEmail === "test@business.com") && trimmedPassword === "BizMod2024!") {
        console.log('Default demo credentials detected, creating mock session...');
        
        const mockUser = {
          id: 'demo-user-id',
          email: trimmedEmail,
          user_metadata: {
            name: 'Demo User',
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User;

        const mockSession = {
          access_token: 'demo-token',
          refresh_token: 'demo-refresh',
          expires_in: 3600,
          token_type: 'bearer',
          user: mockUser,
        } as Session;

        setUser(mockUser);
        setSession(mockSession);
        
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          currentSession: mockSession,
        }));
        
        console.log('Demo login successful!');
        return { error: null };
      }

      // Check for previously registered demo users
      const users = JSON.parse(localStorage.getItem('demo-users') || '{}');
      if (users[trimmedEmail]) {
        console.log('Registered demo user found, checking password...');
        
        if (users[trimmedEmail].password === trimmedPassword) {
          console.log('Password matches, creating session...');
          
          const mockUser = {
            id: users[trimmedEmail].userId,
            email: trimmedEmail,
            user_metadata: {
              name: users[trimmedEmail].name,
            },
            app_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as User;

          const mockSession = {
            access_token: `token-${users[trimmedEmail].userId}`,
            refresh_token: `refresh-${users[trimmedEmail].userId}`,
            expires_in: 3600,
            token_type: 'bearer',
            user: mockUser,
          } as Session;

          setUser(mockUser);
          setSession(mockSession);
          
          localStorage.setItem('supabase.auth.token', JSON.stringify({
            currentSession: mockSession,
          }));
          
          console.log('Demo user login successful!');
          return { error: null };
        } else {
          console.log('Password mismatch for demo user');
          return { error: { message: 'Invalid login credentials' } as AuthError };
        }
      }

      console.log('No demo user found, trying real Supabase auth...');
      
      // Try real Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (error) {
        console.error('Sign in error:', error);
        // If Supabase auth fails, suggest using sign up or demo credentials
        return { error: { message: 'Invalid credentials. Please sign up first or use demo@bizmod.ng with password BizMod2024!' } as AuthError };
      }

      console.log('Sign in successful!', data);
      return { error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error: error as AuthError };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    // Clear user-specific onboarding status if user exists
    if (user) {
      localStorage.removeItem(`onboarding-completed-${user.id}`);
    }
    
    // Clear all local storage data
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('demo-users');
    
    // Clear all cached data using the cache utility
    appCache.clear();
    
    // Reset state
    setUser(null);
    setSession(null);
    setOnboardingCompletedState(false);
    
    // Sign out from Supabase (if real session exists)
    await supabase.auth.signOut();
    
    console.log('Signed out successfully, all local data cleared');
  };

  const value = {
    user,
    session,
    loading,
    onboardingCompleted,
    setOnboardingCompleted,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}