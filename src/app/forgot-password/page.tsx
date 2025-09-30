'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FormInputs = {
  email: string;
};

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormInputs>();
  const auth = getAuth(app);
  const { toast } = useToast();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setError(null);
    setSuccess(false);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setSuccess(true);
      toast({
        title: 'Check your email',
        description: 'A password reset link has been sent. Be sure to check your spam folder!',
      });
    } catch (err: any) {
        if (err.code === 'auth/user-not-found') {
            setError('No user found with this email address.');
        } else {
             setError('An unexpected error occurred. Please try again.');
        }
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full animate-in fade-in zoom-in-95 duration-500">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email and we will send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
             <div className="text-center text-green-600 space-y-2">
                <p>A password reset link has been sent to your email. Please check your inbox.</p>
                <p className="text-sm text-muted-foreground">Be sure to check your spam folder if you don't see it.</p>
             </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register('email', { required: true })}
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
          <div className="mt-4 text-center text-sm">
            Remember your password?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
