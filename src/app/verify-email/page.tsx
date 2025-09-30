'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, sendEmailVerification, signOut } from 'firebase/auth';
import { MailCheck, Loader2 } from 'lucide-react';

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
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      // Ensure we have a current user before trying to reload
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
    if (!auth.currentUser) {
      toast({ title: 'Error', description: 'Please log in again to resend the verification email.', variant: 'destructive'});
      // Re-directing to login will automatically send a new link.
      router.push(`/login?email=${email}`);
      return;
    }
    setIsResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast({ title: 'Success', description: 'Verification email sent! Please check your spam folder.' });
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
            A verification link has been sent to <span className="font-bold">{email}</span>. Please check your inbox to activate your account.
            <br />
            <span className="text-xs text-muted-foreground">If you don't see it, be sure to check your spam folder.</span>
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
           <p className="text-center text-sm text-muted-foreground">
            If you need to, return to the website to log in again.
          </p>
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
