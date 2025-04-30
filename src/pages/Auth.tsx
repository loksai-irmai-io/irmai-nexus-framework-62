
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type AuthTab = 'login' | 'register';

export default function Auth() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(false);
  
  // Only show loading state if it takes more than 300ms to determine auth state
  // This prevents the brief flash of the loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setShowLoading(true);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  // Redirect authenticated users away from the login page
  useEffect(() => {
    if (user && !loading) {
      // If there's a "from" state, redirect there, otherwise to dashboard
      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);
  
  // Don't render anything during initial loading to prevent flashing
  if (loading && !showLoading) {
    return null;
  }

  // Show loading spinner only if it's taking a while
  if (loading && showLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If already authenticated, don't render the auth page at all
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-6 pb-6">
          <AuthLogo />
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold mb-1">Welcome to IRMAI</h1>
            <p className="text-muted-foreground text-sm">Secure access to your dashboard</p>
          </div>
          
          {/* Tab navigation */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button 
              className={cn(
                "py-2 px-4 text-center rounded-md transition-colors",
                activeTab === 'login' 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "hover:bg-gray-100"
              )}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button 
              className={cn(
                "py-2 px-4 text-center rounded-md transition-colors",
                activeTab === 'register' 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "hover:bg-gray-100"
              )}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </CardContent>
        <div className="flex justify-center items-center text-xs text-muted-foreground pb-4 gap-1">
          <Shield size={14} className="inline-block" />
          <span>PROTECTED BY IRMAI SECURITY</span>
        </div>
      </Card>
    </div>
  );
}
