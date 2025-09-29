'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getAuth, createUserWithEmailAndPassword, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { app } from '@/lib/firebase';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Must contain at least one number.')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character.'),
});

type SignupFormInputs = z.infer<typeof signupSchema>;

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <title>Google Logo</title>
      <clipPath id="g">
        <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22h-1.5z" />
      </clipPath>
      <g clipPath="url(#g)">
        <path fill="#FBBC05" d="M0 37V11l17 13z" />
        <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
        <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
        <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
      </g>
    </svg>
  );
}


export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
  });
  const auth = getAuth(app);

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      // AuthProvider will handle the redirect
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register('email')}
              />
               {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} />
               <p className="text-sm text-muted-foreground">
                Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.
              </p>
              {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Create an account'}
            </Button>
          </form>
           <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                Or continue with
                </span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            <GoogleIcon className="mr-2 h-4 w-4" />
            Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
