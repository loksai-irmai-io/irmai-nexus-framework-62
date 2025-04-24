
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ForgotPasswordButtonProps {
  email: string;
  loading: boolean;
}

export const ForgotPasswordButton = ({ email, loading }: ForgotPasswordButtonProps) => {
  const { toast } = useToast();

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

    try {
      const resetUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl,
      });
      
      if (error) throw error;
      
      await supabase.functions.invoke('send-auth-email', {
        body: { 
          email, 
          type: 'reset',
          resetToken: resetUrl
        }
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
    }
  };

  return (
    <button
      type="button"
      onClick={handleForgotPassword}
      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
      disabled={loading}
    >
      Forgot Password?
    </button>
  );
};
