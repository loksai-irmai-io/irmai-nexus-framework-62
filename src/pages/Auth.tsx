
import { Card, CardContent } from '@/components/ui/card';
import { AuthForm } from '@/components/auth/AuthForm';
import { AuthLogo } from '@/components/auth/AuthLogo';

export default function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <AuthLogo />
          <h1 className="text-4xl font-bold text-center mb-3">WELCOME TO IRMAI</h1>
          <p className="text-xl text-center text-muted-foreground mb-8">
            Please sign in to continue to your account
          </p>
          <AuthForm />
        </CardContent>

        <div className="text-center text-sm text-muted-foreground pb-4">
          PROTECTED BY IRMAI SECURITY
        </div>
      </Card>
    </div>
  );
}
