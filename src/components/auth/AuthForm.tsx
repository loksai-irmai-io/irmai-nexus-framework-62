
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
  const { signIn, signInWithMagicLink } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const adminUsers = [
        { email: 'jennings@irmai.io', password: 'irmai_Jennings11' },
        { email: 'aniket@irmai.io', password: 'irmai_Aniket22' },
        { email: 'sofiya@irmai.io', password: 'irmai_Sofiya45' }
      ];

      const isAdminUser = adminUsers.some(
        user => user.email === email && user.password === password
      );

      // First try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // If sign in succeeds, navigate to home
      if (signInData?.user) {
        // Send welcome email
        try {
          await supabase.functions.invoke('send-auth-email', {
            body: { email, type: 'login' }
          });
        } catch (emailError) {
          console.error("Error sending auth email:", emailError);
        }
        
        navigate('/');
        return;
      }

      // If sign in fails and this is an admin user, create the account
      if (signInError && isAdminUser) {
        console.log("Creating new admin user account...");
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });

        if (signUpError) {
          console.error("Error creating admin user:", signUpError);
          throw signUpError;
        }

        console.log("Admin user created successfully:", signUpData);
        
        // Wait for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Try signing in again
        const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (retryError) {
          console.error("Error signing in after creating admin user:", retryError);
          throw retryError;
        }

        if (retryData?.user) {
          // Send welcome email
          try {
            await supabase.functions.invoke('send-auth-email', {
              body: { email, type: 'login' }
            });
          } catch (emailError) {
            console.error("Error sending auth email:", emailError);
          }
          
          navigate('/');
          return;
        }
      } else if (signInError) {
        // If it's not an admin user and sign in failed, try regular sign in
        await signIn(email, password);
        
        // Send welcome email
        try {
          await supabase.functions.invoke('send-auth-email', {
            body: { email, type: 'login' }
          });
        } catch (emailError) {
          console.error("Error sending auth email:", emailError);
        }
        
        navigate('/');
      }
    } catch (error: any) {
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
      await signInWithMagicLink(email);
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
