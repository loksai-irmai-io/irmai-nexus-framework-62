
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { toast } from 'sonner';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract the access_token from URL if present
  useEffect(() => {
    const handlePasswordReset = async () => {
      // Check for hash params from Supabase auth redirect
      const hashParams = window.location.hash.substring(1).split('&').reduce((params, param) => {
        const [key, value] = param.split('=');
        if (key && value) params[key] = decodeURIComponent(value);
        return params;
      }, {} as Record<string, string>);

      if (hashParams.access_token) {
        try {
          // Set the session with the access token from the URL
          const { error } = await supabase.auth.setSession({
            access_token: hashParams.access_token,
            refresh_token: hashParams.refresh_token || '',
          });

          if (error) throw error;

          // Clear the URL hash to remove tokens for security
          history.replaceState(null, '', window.location.pathname);
          
          toast.success("Authentication Successful", {
            description: "You can now reset your password."
          });
        } catch (error: any) {
          console.error("Error setting session:", error);
          toast.error("Authentication Error", {
            description: "Failed to authenticate. Please try again."
          });
          navigate('/auth');
        }
      }
    };

    handlePasswordReset();
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Error", {
        description: "Passwords do not match"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Error", {
        description: "Password must be at least 6 characters long"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      // Get current user email
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email;
      
      // Send a notification email
      if (email) {
        try {
          await supabase.functions.invoke('send-auth-email', {
            body: { 
              email, 
              type: 'reset'
            }
          });
        } catch (emailError) {
          console.error("Error sending reset notification:", emailError);
          // This is just a notification, so we can proceed even if it fails
        }
      }

      toast.success("Success", {
        description: "Your password has been updated successfully"
      });
      
      // Slight delay before redirect
      setTimeout(() => {
        navigate('/auth');
      }, 1500);
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error("Error", {
        description: error.message || "Failed to update password. Make sure your reset link is valid."
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
            <AuthLogo />
          </div>
          <CardTitle className="text-2xl text-center">Reset Your Password</CardTitle>
        </CardHeader>

        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                  required
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
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : "Update Password"}
            </Button>
          </CardFooter>
        </form>

        <div className="text-center text-xs text-muted-foreground pb-4">
          PROTECTED BY IRMAI SECURITY
        </div>
      </Card>
    </div>
  );
}
