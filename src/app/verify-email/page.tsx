'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, sendEmailVerification, signOut, applyActionCode, checkActionCode, signInWithEmailAndPassword } from 'firebase/auth';
import { MailCheck, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { app } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const auth = getAuth(app);
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          clearInterval(interval);
          toast({
            title: 'Email Verified!',
            description: 'Redirecting you to the dashboard...',
          });
          router.push('/dashboard');
        }
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [auth, router, toast]);


  const handleResend = async () => {
      if (!email) {
          toast({ title: 'Error', description: 'No email address found. Please go back to login.', variant: 'destructive'});
          return;
      }
    setIsResending(true);
    // User might not be logged in here if they refreshed the page.
    // We can't send a verification email without a signed-in user.
    // So, if no user, we can't proceed. Best to guide them back to login.
    if (auth.currentUser && auth.currentUser.email === email) {
      try {
        await sendEmailVerification(auth.currentUser);
        toast({ title: 'Success', description: 'Verification email sent!' });
      } catch (error: any) {
        console.error(error);
        let description = 'Failed to send verification email.';
        if (error.code === 'auth/too-many-requests') {
            description = 'You have requested to resend the email too many times. Please wait a few minutes before trying again.';
        }
        toast({ title: 'Error', description, variant: 'destructive' });
      } finally {
        setIsResending(false);
      }
    } else {
        // If there's no user, or the user is not the one we're trying to verify,
        // we can't resend. Guide them to log in again.
        toast({ title: 'Please Login', description: 'To resend the verification email, please log in first.', variant: 'destructive' });
        router.push(`/login?email=${email}`);
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
           <div className="flex items-center text-sm text-muted-foreground pt-2">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Waiting for verification...</span>
            </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive an email?
          </p>
          <Button onClick={handleResend} disabled={isResending}>
            {isResending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Resend Verification Link'}
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
