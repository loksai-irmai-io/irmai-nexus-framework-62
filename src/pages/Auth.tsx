
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthForm } from '@/components/auth/AuthForm';
import { AuthLogo } from '@/components/auth/AuthLogo';

export default function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <AuthLogo />
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>

        <CardContent>
          <AuthForm />
        </CardContent>

        <div className="text-center text-sm text-muted-foreground pb-4">
          PROTECTED BY IRMAI SECURITY
        </div>
      </Card>
    </div>
  );
}
