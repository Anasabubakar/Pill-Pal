import Link from 'next/link';
import { PlusCircle, Sparkles } from 'lucide-react';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MedicationSchedule } from '@/components/medication-schedule';
import { medications } from '@/lib/data';

export default function DashboardPage() {
  const today = new Date();
  const todaysMedications = medications.filter(med => med.status === 'active' && med.startDate <= today && (!med.endDate || med.endDate >= today));

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Hello Alex, here is your medication schedule for today, ${today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.`}
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Medication
        </Button>
      </PageHeader>
      <div className="flex-1 overflow-auto p-6 bg-background/50">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold font-headline mb-4">Today's Schedule</h2>
            <MedicationSchedule medications={todaysMedications} />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-headline mb-4">AI Insights</h2>
            <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 text-primary">
                    <Sparkles className="h-6 w-6" />
                    <CardTitle className="font-headline">AI Adherence Tool</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Get personalized insights on your medication habits. Ask questions, get summaries, and receive motivational nudges.
                </CardDescription>
                <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/dashboard/ask-ai">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Ask AI
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
