
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
        { email: 'aniket@irmai.io', password: 'irmai_Aniket22' }
      ];

      const isAdminUser = adminUsers.some(
        user => user.email === email && user.password === password
      );

      if (isAdminUser) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password
          });
          
          if (signUpError) throw signUpError;
        }
      }

      await signIn(email, password);
      
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
