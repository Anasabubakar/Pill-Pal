'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, sendEmailVerification, signOut } from 'firebase/auth';
import { MailCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { app } from '@/lib/firebase';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const auth = getAuth(app);
  const { toast } = useToast();

  const handleResend = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        toast({ title: 'Success', description: 'Verification email sent!' });
      } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: 'Failed to send verification email.', variant: 'destructive' });
      }
    } else {
        toast({ title: 'Error', description: 'You are not logged in. Please log in to resend the verification email.', variant: 'destructive' });
        router.push('/login');
    }
  };

  const handleGoToLogin = async () => {
    if (auth.currentUser) {
        await signOut(auth);
    }
    router.push('/login');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="items-center">
            <MailCheck className="h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            A verification link has been sent to <span className="font-bold">{email}</span>. Please check your inbox and follow the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive an email?
          </p>
          <Button onClick={handleResend}>
            Resend Verification Link
          </Button>
          <Button variant="outline" onClick={handleGoToLogin}>
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    )
}
