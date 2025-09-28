"use client"

import { Clock, CheckCircle2, Pill } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { Medication } from '@/lib/types';

interface MedicationScheduleProps {
  medications: Medication[];
}

export function MedicationSchedule({ medications }: MedicationScheduleProps) {
  return (
    <div className="space-y-4">
      {medications.map((med) => (
        <Card key={med.id} className="bg-card shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                 <Pill className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="font-headline">{med.name}</CardTitle>
                <CardDescription>{med.dosage}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4"/>
            <div className="space-y-4">
              {med.times.map((time) => (
                <div key={time} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-medium">{time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                     <Checkbox id={`${med.id}-${time}`} />
                     <Label htmlFor={`${med.id}-${time}`} className="text-base">Taken</Label>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
       {medications.length === 0 && (
         <Card className="flex flex-col items-center justify-center p-10 border-dashed">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-bold font-headline">All Clear!</h3>
            <p className="text-muted-foreground">You have no medications scheduled for today.</p>
         </Card>
      )}
    </div>
  );
}
