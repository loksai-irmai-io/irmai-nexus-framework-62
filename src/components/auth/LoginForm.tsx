
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Google } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithMagicLink, signInWithGoogle } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      return; // Email validation is handled at the form level
    }
    
    try {
      await signInWithMagicLink(email);
    } catch (error) {
      console.error("Magic link error:", error);
    }
  };

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signInWithGoogle();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
            required
          />
        </div>
        
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 pr-10"
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

        <Button 
          type="submit" 
          className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : "Sign in"}
        </Button>
      </form>

      <button
        onClick={handleMagicLink}
        className="w-full text-center text-blue-600 hover:text-blue-700 py-2"
      >
        Sign in with Magic Link
      </button>
      
      <div className="flex items-center justify-center">
        <button 
          onClick={() => {}}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Forgot password?
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 border-2 flex items-center justify-center gap-2"
        onClick={handleGoogleSignIn}
      >
        <Google size={20} />
        Sign in with Google
      </Button>
    </div>
  );
};
