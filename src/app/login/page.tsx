'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import PhoneInput from 'react-phone-number-input/react-hook-form-input';
import 'react-phone-number-input/style.css';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { app } from '@/lib/firebase';

type PhoneFormInputs = {
  phoneNumber: string;
};

type OtpFormInputs = {
  otp: string;
};

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  const { control: phoneControl, handleSubmit: handlePhoneSubmit, formState: { isSubmitting: isSendingOtp } } = useForm<PhoneFormInputs>();
  const { register: registerOtp, handleSubmit: handleOtpSubmit, formState: { isSubmitting: isVerifyingOtp } } = useForm<OtpFormInputs>();
  
  const auth = getAuth(app);
  const router = useRouter();

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
    return window.recaptchaVerifier;
  };

  const onPhoneSubmit: SubmitHandler<PhoneFormInputs> = async (data) => {
    setError(null);
    try {
      const appVerifier = setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, data.phoneNumber, appVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };
  
  const onOtpSubmit: SubmitHandler<OtpFormInputs> = async (data) => {
    setError(null);
    if (!confirmationResult) {
        setError("Something went wrong. Please try sending the code again.");
        return;
    }
    try {
        await confirmationResult.confirm(data.otp);
        router.push('/dashboard');
    } catch (err: any) {
        setError("Invalid OTP. Please try again.");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Login with Phone</CardTitle>
          <CardDescription>
            {step === 'phone' 
              ? "Enter your phone number to receive a verification code."
              : "We've sent a code to your phone. Please enter it below."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit(onPhoneSubmit)} className="grid gap-4">
               <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                 <PhoneInput
                    id="phoneNumber"
                    name="phoneNumber"
                    control={phoneControl}
                    rules={{ required: true }}
                    defaultCountry="US"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={isSendingOtp}>
                {isSendingOtp ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
             <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input id="otp" type="text" {...registerOtp('otp', { required: true, minLength: 6, maxLength: 6 })} />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={isVerifyingOtp}>
                    {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <Button variant="link" size="sm" onClick={() => { setStep('phone'); setError(null); }}>
                    Use a different phone number
                </Button>
             </form>
          )}
          <div id="recaptcha-container"></div>
        </CardContent>
      </Card>
    </div>
  );
}

// Extend the Window interface to include the recaptcha verifier
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}
