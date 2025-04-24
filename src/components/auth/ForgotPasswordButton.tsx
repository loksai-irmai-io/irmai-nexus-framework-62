
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ForgotPasswordButtonProps {
  email: string;
  loading: boolean;
}

export const ForgotPasswordButton = ({ email, loading: externalLoading }: ForgotPasswordButtonProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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
      const resetUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl,
      });
      
      if (error) throw error;
      
      try {
        await supabase.functions.invoke('send-auth-email', {
          body: { 
            email, 
            type: 'reset',
            resetToken: resetUrl
          }
        });
      } catch (emailError) {
        console.error("Error sending reset email:", emailError);
        // Continue with the success message even if the custom email fails
      }
      
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
    <button
      type="button"
      onClick={handleForgotPassword}
      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
      disabled={loading || externalLoading}
    >
      {loading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
      Forgot Password?
    </button>
  );
};
