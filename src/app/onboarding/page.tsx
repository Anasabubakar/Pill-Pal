'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pill, Calendar, Sparkles, BellRing, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
    },
  }),
};

const FeatureCard = ({ icon, title, description, i }: { icon: React.ReactNode, title: string, description: string, i: number }) => (
    <motion.div variants={featureVariants} initial="hidden" animate="visible" custom={i}>
        <Card className="bg-card/80 border-transparent shadow-lg hover:shadow-primary/20 hover:border-primary/20 transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center gap-4">
                {icon}
                <CardTitle className="font-headline text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    </motion.div>
);

export default function OnboardingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    try {
      localStorage.setItem('hasVisitedPillPal', 'true');
    } catch (error) {
      console.error('Could not set localStorage:', error);
    }
    router.push('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 text-foreground flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-4xl w-full mx-auto"
      >
        <Card className="bg-card/90 backdrop-blur-sm shadow-2xl shadow-primary/10">
            <CardContent className="p-8 md:p-12">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-col items-center text-center mb-10"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Logo className="h-12 w-12 text-primary" />
                        <h1 className="text-5xl font-bold font-headline text-primary">Pill Pal</h1>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Your smart, simple, and friendly medication reminder app. Never miss a dose again.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                   <FeatureCard 
                        i={1}
                        icon={<BellRing className="h-8 w-8 text-primary" />} 
                        title="Smart Reminders" 
                        description="Easily schedule all your medications and get timely reminders so you always stay on track."
                    />
                    <FeatureCard
                        i={2}
                        icon={<Calendar className="h-8 w-8 text-primary" />}
                        title="Adherence Tracking"
                        description="Log every dose with a single click and visualize your progress over time in your personal dashboard."
                    />
                    <FeatureCard
                        i={3}
                        icon={<Sparkles className="h-8 w-8 text-primary" />}
                        title="AI-Powered Insights"
                        description="Ask questions in plain language and get smart, personalized feedback on your medication habits."
                    />
                    <FeatureCard
                        i={4}
                        icon={<Pill className="h-8 w-8 text-primary" />}
                        title="Medication Management"
                        description="Keep a detailed list of your medications, including dosages and frequencies, all in one place."
                    />
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="flex justify-center"
                >
                    <Button onClick={handleGetStarted} size="lg" className="text-lg font-bold group">
                        Get Started
                        <ChevronRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                </motion.div>
            </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
