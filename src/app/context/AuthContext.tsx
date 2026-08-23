import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';
import { appCache } from '../utils/localCache';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  onboardingCompleted: boolean;
  setOnboardingCompleted: (completed: boolean) => Promise<void>;
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

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-6451509a`;

  const getAuthHeader = () => {
    const session = JSON.parse(localStorage.getItem("supabase.auth.token") || "{}");
    const accessToken = session?.currentSession?.access_token || publicAnonKey;
    return { Authorization: `Bearer ${accessToken}` };
  };

  // Helper to detect if we're in demo mode (using mock tokens)
  const isDemoMode = () => {
    try {
      const sessionStr = localStorage.getItem('supabase.auth.token');
      if (!sessionStr) return false;
      const session = JSON.parse(sessionStr);
      const token = session?.currentSession?.access_token;
      // Demo tokens start with 'token-' or are 'demo-token'
      return token && (token.startsWith('token-') || token === 'demo-token');
    } catch {
      return false;
    }
  };

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

  // Wrapper to save onboarding status to localStorage and server
  const setOnboardingCompleted = async (completed: boolean) => {
    setOnboardingCompletedState(completed);
    if (!user) return;
    
    // Save to localStorage first for immediate availability
    localStorage.setItem(`onboarding-completed-${user.id}`, completed.toString());
    console.log('✅ Onboarding status saved to localStorage:', completed);
    
    // Skip server call if in demo mode
    if (isDemoMode()) {
      console.log('📝 Demo mode - skipping server sync for onboarding status');
      return;
    }
    
    // Try to save to server for real Supabase users
    try {
      const response = await fetch(`${apiUrl}/user/preferences`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ onboardingCompleted: completed }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Onboarding status saved to server:', result);
      } else {
        const errorText = await response.text();
        console.warn('⚠️ Failed to save onboarding status to server (localStorage is active):', response.status, errorText);
      }
    } catch (error) {
      console.warn('⚠️ Error saving onboarding status to server (localStorage is active):', error);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Trim and normalize
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();
      const trimmedName = name.trim();
      
      console.log('Attempting signup with:', { email: trimmedEmail, name: trimmedName });
      
      // First, try to create user in Supabase via the server
      try {
        console.log('Trying to create user in Supabase...');
        const response = await fetch(`${apiUrl}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: trimmedEmail,
            password: trimmedPassword,
            name: trimmedName,
          }),
        });

        console.log('Signup response status:', response.status);
        const responseText = await response.text();
        console.log('Signup response text:', responseText);

        let result;
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse signup response:', parseError);
          throw new Error(`Invalid response from server: ${responseText.substring(0, 100)}`);
        }
        
        if (response.ok && result.user) {
          console.log('✅ User created in Supabase successfully!', result.user.id);
          
          // Now sign them in to get a session
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: trimmedEmail,
              password: trimmedPassword,
            });

            if (error) {
              console.error('Signup successful but signin failed:', error);
              return { 
                error: { 
                  message: 'Account created successfully! Please sign in with your credentials.' 
                } as AuthError 
              };
            }

            console.log('✅ User signed in successfully after signup!');
            // Session is automatically set via onAuthStateChange listener
            return { error: null };
          } catch (signInNetworkError) {
            console.error('Network error during sign in after signup:', signInNetworkError);
            return { 
              error: { 
                message: 'Account created successfully! Please sign in with your credentials.' 
              } as AuthError 
            };
          }
        } else {
          console.error('Supabase signup failed:', result.error);
          throw new Error(result.error || 'Supabase signup failed');
        }
      } catch (serverError) {
        console.error('❌ Server signup failed, falling back to demo mode:', serverError);
        console.log('📝 NOTE: This is expected if the Supabase Edge Function is not deployed.');
        console.log('📝 User will be created locally and can complete onboarding normally.');
        console.log('📝 All data will be stored in localStorage until server is available.');
        
        // Fallback to demo mode if server is unavailable
        console.log('Creating demo user locally...');
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
        
        console.log('✅ Demo signup successful (offline mode)!');
        return { error: null };
      }
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
      try {
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
      } catch (networkError) {
        console.error('Network error during Supabase sign in:', networkError);
        // Network error - likely server unavailable or no internet
        return { 
          error: { 
            message: 'Unable to connect to authentication server. Please check your internet connection or try again later.' 
          } as AuthError 
        };
      }
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