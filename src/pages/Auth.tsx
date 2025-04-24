import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function Auth() {
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
      // Predefined admin users with specific credentials
      const adminUsers = [
        { email: 'jennings@irmai.io', password: 'irmai_Jennings11' },
        { email: 'aniket@irmai.io', password: 'irmai_Aniket22' }
      ];

      const isAdminUser = adminUsers.some(
        user => user.email === email && user.password === password
      );

      if (isAdminUser) {
        // Attempt to sign in first
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        // If sign-in fails, sign up the user
        if (signInError) {
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password
          });
          
          if (signUpError) throw signUpError;
        }
      }

      // Standard sign-in process
      await signIn(email, password);
      
      // Send login notification email
      await supabase.functions.invoke('send-auth-email', {
        body: { email, type: 'login' }
      });
      
      navigate('/');
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

  const handleForgotPassword = async (e: React.FormEvent) => {
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      
      // Send password reset notification email
      await supabase.functions.invoke('send-auth-email', {
        body: { email, type: 'reset' }
      });
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for the password reset link",
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/e0e5366a-be2b-4f02-97cb-831a9e41477f.png" 
              alt="IRMAI Logo" 
              className="h-12 object-contain"
            />
          </div>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>

        <form onSubmit={handleSignIn}>
          <CardContent className="space-y-4">
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
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            
            <div className="flex justify-between w-full text-sm">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-primary hover:underline"
                disabled={loading}
              >
                Forgot Password?
              </button>
              <button
                type="button"
                onClick={handleMagicLink}
                className="text-primary hover:underline"
                disabled={loading}
              >
                Sign in with Magic Link
              </button>
            </div>
          </CardFooter>
        </form>

        <div className="text-center text-sm text-muted-foreground pb-4">
          PROTECTED BY IRMAI SECURITY
        </div>
      </Card>
    </div>
  );
}
