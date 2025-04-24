import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ForgotPasswordButton } from './ForgotPasswordButton';
import { MagicLinkButton } from './MagicLinkButton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

export const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowTip(false);
    
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

      // If sign in fails and this is an admin email, try to create the account
      if (signInError && isAdminEmail) {
        console.log("Creating new admin account...");
        
        try {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (signUpError) {
            if (signUpError.message.includes("Database error saving new user")) {
              setShowTip(true);
              throw new Error("Database schema issue detected. Please check that the user_role enum exists in the database.");
            } else {
              throw signUpError;
            }
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
        } catch (error: any) {
          throw error;
        }
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
    <form onSubmit={handleSignIn} className="space-y-6">
      {showTip && (
        <Alert className="mb-4 bg-amber-50 border-amber-500 text-amber-800">
          <AlertTitle>Database Setup Required</AlertTitle>
          <AlertDescription>
            There appears to be an issue with the database schema. Make sure the SQL migrations have been executed to create the necessary tables and enums.
          </AlertDescription>
        </Alert>
      )}

      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <ForgotPasswordButton email={email} loading={loading} />
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700" 
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      
      <div className="text-center">
        <MagicLinkButton onMagicLink={handleMagicLink} loading={loading} />
      </div>
    </form>
  );
};
