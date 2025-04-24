
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff } from 'lucide-react';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak'|'medium'|'strong'|''>('');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check password strength and security
  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength('');
      return;
    }
    
    // Check for common weak passwords
    const commonPasswords = [
      /^123456/, /^password/, /^qwerty/, /admin/, /^welcome/,
      /^letmein/, /^abc123/, /^monkey/, /^1234567890/
    ];
    
    for (const pattern of commonPasswords) {
      if (pattern.test(password.toLowerCase())) {
        setPasswordStrength('weak');
        return;
      }
    }
    
    let score = 0;
    
    // Length check
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    
    // Character diversity
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    // Set strength based on score
    if (score >= 4) setPasswordStrength('strong');
    else if (score >= 2) setPasswordStrength('medium');
    else setPasswordStrength('weak');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 8 characters long",
      });
      return;
    }
    
    if (passwordStrength === 'weak') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please use a stronger password for security",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your password has been updated successfully",
      });
      navigate('/auth');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update password",
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
              src="/lovable-uploads/12b81df1-17a5-4185-9aea-80ded0aee7ad.png" 
              alt="Integrated Risk Management using AI" 
              className="h-16 object-contain"
            />
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
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
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
              
              {passwordStrength && (
                <div className="mt-1">
                  <div className="flex items-center">
                    <div className="h-1 flex-1 rounded-full bg-gray-200 overflow-hidden">
                      <div 
                        className={`h-full ${
                          passwordStrength === 'strong' ? 'bg-green-500 w-full' : 
                          passwordStrength === 'medium' ? 'bg-yellow-500 w-2/3' : 
                          'bg-red-500 w-1/3'
                        }`}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs">
                      {passwordStrength === 'strong' ? 'Strong' : 
                       passwordStrength === 'medium' ? 'Medium' : 
                       'Weak'}
                    </span>
                  </div>
                </div>
              )}
              
              {passwordStrength === 'weak' && (
                <Alert variant="destructive" className="mt-2 py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    This password is too weak. Use at least 8 characters with a mix of uppercase, lowercase, numbers, and symbols.
                  </AlertDescription>
                </Alert>
              )}
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
              disabled={loading || passwordStrength === 'weak'}
            >
              {loading ? "Updating..." : "Update Password"}
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
