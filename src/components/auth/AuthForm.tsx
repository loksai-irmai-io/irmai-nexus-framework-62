import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ForgotPasswordButton } from './ForgotPasswordButton';
import { MagicLinkButton } from './MagicLinkButton';

export const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const adminEmails = ['jennings@irmai.io', 'aniket@irmai.io', 'sofiya@irmai.io'];
      const isAdminEmail = adminEmails.includes(email);

      // First try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // If sign in succeeds, send notification and navigate
      if (signInData?.user) {
        try {
          await supabase.functions.invoke('send-auth-email', {
            body: { email, type: 'login' }
          });
        } catch (emailError) {
          console.error("Error sending login notification:", emailError);
        }
        
        navigate('/');
        return;
      }

      // If sign in fails and this is an admin email, create the account
      if (signInError && isAdminEmail) {
        console.log("Creating new admin account...");
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          throw signUpError;
        }

        // Wait for the trigger to create the profile and role
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Try signing in again
        const { error: retryError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (retryError) throw retryError;

        navigate('/');
        return;
      } 
      
      // For non-admin users
      if (signInError) {
        await signIn(email, password);
        navigate('/');
      }

    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "Failed to sign in. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error", 
        description: "Please enter your email address",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      
      toast({
        title: "Magic Link Sent",
        description: "Check your email for the login link",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-6">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        
        <div className="flex justify-between w-full text-sm">
          <ForgotPasswordButton email={email} loading={loading} />
          <MagicLinkButton onMagicLink={handleMagicLink} loading={loading} />
        </div>
      </div>
    </form>
  );
};
