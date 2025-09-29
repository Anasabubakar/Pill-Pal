"use client"

import { Clock, CheckCircle2, Pill } from 'lucide-react';
import { useDataContext } from '@/context/data-context';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export function MedicationSchedule() {
  const { todaysMedications, logs, addLog } = useDataContext();

  const isTaken = (medId: string, time: string) => {
    const today = new Date();
    return logs.some(log => 
      log.medicationId === medId &&
      log.takenAt.getHours() === parseInt(time.split(':')[0]) &&
      log.takenAt.getMinutes() === parseInt(time.split(':')[1]) &&
      log.takenAt.toDateString() === today.toDateString() &&
      log.status === 'taken'
    );
  };

  const handleTakeMedication = (medId: string, medName: string, time: string, taken: boolean) => {
    if (taken) {
      const takenAt = new Date();
      const [hours, minutes] = time.split(':');
      takenAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      addLog({
        medicationId: medId,
        medicationName: medName,
        takenAt: takenAt,
        status: 'taken',
      });
    }
    // In a real app, you might want to handle un-checking (e.g., deleting the log)
  };

  return (
    <div className="space-y-4">
      {todaysMedications.map((med) => (
        <Card key={med.id} className="bg-card shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
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
                     <Checkbox 
                        id={`${med.id}-${time}`} 
                        checked={isTaken(med.id, time)}
                        onCheckedChange={(checked) => handleTakeMedication(med.id, med.name, time, !!checked)}
                     />
                     <Label htmlFor={`${med.id}-${time}`} className="text-base">Taken</Label>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
       {todaysMedications.length === 0 && (
         <Card className="flex flex-col items-center justify-center p-10 border-dashed animate-in fade-in duration-500">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-bold font-headline">All Clear!</h3>
            <p className="text-muted-foreground">You have no medications scheduled for today.</p>
         </Card>
      )}
    </div>
  );
}
