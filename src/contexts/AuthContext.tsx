
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to sanitize and check password to prevent leaks
  const checkPasswordSecurity = (password: string): boolean => {
    if (!password || password.length < 8) return false;
    
    // Check for common patterns that might indicate a leaked password
    const commonPatterns = [
      /^123456/, /^password/, /^qwerty/, /admin/, /^welcome/,
      /^letmein/, /^abc123/, /^monkey/, /^1234567890/
    ];
    
    for (const pattern of commonPatterns) {
      if (pattern.test(password.toLowerCase())) {
        return false;
      }
    }
    
    // Check for character diversity (at least one lowercase, uppercase, number, special char)
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return (hasLowercase && hasUppercase && hasNumber) || (hasLowercase && hasSpecial) || (hasUppercase && hasSpecial);
  };

  useEffect(() => {
    // Important: Set up the auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Avoid calling Supabase inside the callback directly
        // Use setTimeout to defer this operation
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
                
              setIsAdmin(data?.role === 'admin');
              
              // Redirect to dashboard if on auth page
              if (window.location.pathname === '/auth') {
                navigate('/dashboard');
              }
            } catch (error) {
              console.error("Error fetching user profile:", error);
            }
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Then check for an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Redirect authenticated users to dashboard if on auth page
      if (session?.user && window.location.pathname === '/auth') {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    // First validate the password for security
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    navigate('/dashboard');
  };

  const signInWithMagicLink = async (email: string) => {
    if (!email) {
      throw new Error("Email is required");
    }
    
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, signIn, signInWithMagicLink, signOut, loading }}>
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
