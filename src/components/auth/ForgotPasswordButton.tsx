
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ForgotPasswordButtonProps {
  email: string;
  loading?: boolean;
}

export const ForgotPasswordButton = ({ email, loading: parentLoading }: ForgotPasswordButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Missing email", {
        description: "Please enter your email address first"
      });
      return;
    }

    setLoading(true);

    try {
      // Get the current origin for redirect
      const origin = window.location.origin;
      const resetRedirectUrl = `${origin}/reset-password`;
      
      // Request password reset with redirect URL
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetRedirectUrl,
      });

      if (error) {
        throw error;
      }

      toast.success("Password reset email sent", {
        description: "Check your email for a link to reset your password"
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error("Password reset failed", {
        description: error.message || "Failed to send reset email"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="link"
      className="p-0 h-auto font-normal text-muted-foreground"
      onClick={handleForgotPassword}
      disabled={loading || parentLoading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          Sending...
        </>
      ) : (
        "Forgot password?"
      )}
    </Button>
  );
};
