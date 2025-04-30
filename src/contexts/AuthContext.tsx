
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        // Avoid infinite loops by not making Supabase calls directly in the callback
        console.log("Auth state change:", event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Use setTimeout to defer the database call to prevent deadlocks
          setTimeout(async () => {
            try {
              const { data } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', newSession.user.id)
                .maybeSingle();
              setIsAdmin(data?.is_admin || false);
              
              // If user just logged in, redirect to dashboard
              if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                // Check if we're not already on the dashboard to prevent unnecessary redirects
                if (location.pathname === '/auth') {
                  navigate('/dashboard');
                }
              }
            } catch (error) {
              console.error("Error fetching user profile:", error);
              setIsAdmin(false);
            }
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Get user role
          try {
            const { data } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', session.user.id)
              .maybeSingle();
            setIsAdmin(data?.is_admin || false);
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error("Session fetch error:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error("Login failed: " + error.message);
        throw error;
      }
      
      if (data?.user) {
        // Send a login notification email
        try {
          await supabase.functions.invoke('send-auth-email', {
            body: { 
              email: data.user.email, 
              type: 'login'
            }
          });
        } catch (emailError) {
          console.error("Error sending login notification:", emailError);
        }
        
        toast.success("Welcome back!");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const origin = window.location.origin;
      const redirectUrl = `${origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: name || null,
          },
          emailRedirectTo: redirectUrl,
        }
      });
      
      if (error) {
        toast.error("Registration failed: " + error.message);
        throw error;
      }
      
      if (data?.user) {
        toast.success("Registration successful. Check your email to confirm your account");
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithMagicLink = async (email: string) => {
    setLoading(true);
    try {
      const origin = window.location.origin;
      const redirectUrl = `${origin}/dashboard`;
      
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: redirectUrl,
        }
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success("Magic Link Sent! Check your email for the login link");
    } catch (error) {
      console.error("Magic link error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const origin = window.location.origin;
      const redirectUrl = `${origin}/dashboard`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account', // Force Google to show the account selector
          }
        }
      });
      
      if (error) {
        toast.error("Google login failed: " + error.message);
        throw error;
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("There was a problem signing you out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isAdmin, 
      signIn, 
      signInWithMagicLink, 
      signOut, 
      signUp, 
      signInWithGoogle, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
