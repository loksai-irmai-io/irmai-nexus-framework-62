
import { Card, CardContent } from '@/components/ui/card';
import { AuthForm } from '@/components/auth/AuthForm';
import { AuthLogo } from '@/components/auth/AuthLogo';

export default function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-6 pb-6">
          <AuthLogo />
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to IRMAI</h1>
            <p className="text-muted-foreground text-sm">Please sign in to continue to your account</p>
          </div>
          <AuthForm />
        </CardContent>
        <div className="text-center text-xs text-muted-foreground pb-4">
          PROTECTED BY IRMAI SECURITY
        </div>
      </Card>
    </div>
  );
}
