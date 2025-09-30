
'use client';
import { useState, type ReactNode } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataContext } from '@/context/data-context';
import type { Medication } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const medicationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  times: z.string().min(1, 'At least one time is required'),
  repeat: z.enum(['daily', 'weekly', 'custom']),
});

type MedicationFormData = z.infer<typeof medicationSchema>;

interface MedicationDialogProps {
  children: ReactNode;
  medication?: Medication;
}

function MedicationFormDialog({ children, medication }: MedicationDialogProps) {
    const [open, setOpen] = useState(false);
    const { addMedication, updateMedication } = useDataContext();
    const { toast } = useToast();
    const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<MedicationFormData>({
        resolver: zodResolver(medicationSchema),
        defaultValues: {
            name: medication?.name || '',
            dosage: medication?.dosage || '',
            times: medication?.times.join(', ') || '',
            repeat: medication?.repeat || 'daily',
        },
    });

    const processSubmit: SubmitHandler<MedicationFormData> = async (data) => {
        const medicationPayload = {
            ...data,
            times: data.times.split(',').map(t => t.trim()).filter(Boolean),
        };

        const saveOperation = medication 
            ? updateMedication({ ...medication, ...medicationPayload })
            : addMedication(medicationPayload);

        try {
            await saveOperation;
            toast({
                title: 'Success!',
                description: 'Your medication has been saved.',
            });
            reset();
            setOpen(false); // Close dialog on success
        } catch (error) {
            // Error toast is handled in context
            console.error("Failed to save medication:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
                reset(); // Reset form when dialog is closed
            }
        }}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(processSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{medication ? 'Edit Medication' : 'Add Medication'}</DialogTitle>
                        <DialogDescription>
                            {medication ? 'Update the details of your medication.' : 'Add a new medication to your schedule.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" {...register('name')} className="col-span-3" />
                            {errors.name && <p className="col-span-4 text-destructive text-xs text-right">{errors.name.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dosage" className="text-right">Dosage</Label>
                            <Input id="dosage" {...register('dosage')} className="col-span-3" />
                            {errors.dosage && <p className="col-span-4 text-destructive text-xs text-right">{errors.dosage.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="times" className="text-right">Times</Label>
                            <Input id="times" {...register('times')} placeholder="e.g. 08:00, 20:00" className="col-span-3" />
                            {errors.times && <p className="col-span-4 text-destructive text-xs text-right">{errors.times.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="repeat" className="text-right">Repeat</Label>
                            <Controller
                                name="repeat"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="custom">Custom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save changes
                      </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function AddMedicationDialog({ children }: { children: ReactNode }) {
    return <MedicationFormDialog>{children}</MedicationFormDialog>;
}

export function EditMedicationDialog({ children, medication }: MedicationDialogProps) {
    return <MedicationFormDialog medication={medication}>{children}</MedicationFormDialog>;
}


interface DeleteDialogProps {
    children: ReactNode;
    medicationId: string;
}

export function DeleteMedicationDialog({ children, medicationId }: DeleteDialogProps) {
  const { deleteMedication } = useDataContext();
  
  const handleDelete = () => {
    deleteMedication(medicationId);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            medication and all its associated data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
