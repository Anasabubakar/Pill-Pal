'use client';
import { useState, type ReactNode } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
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

const imageSchema = z.instanceof(FileList).optional();

const medicationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  times: z.string().min(1, 'At least one time is required'),
  repeat: z.enum(['daily', 'weekly', 'custom']),
  image: imageSchema,
});

type MedicationFormData = z.infer<typeof medicationSchema>;

interface MedicationDialogProps {
  children: ReactNode;
  medication?: Medication;
}

function MedicationFormDialog({ children, medication }: MedicationDialogProps) {
    const [open, setOpen] = useState(false);
    const { addMedication, updateMedication } = useDataContext();
    const { register, handleSubmit, control, formState: { errors } } = useForm<MedicationFormData>({
        resolver: zodResolver(medicationSchema),
        defaultValues: {
            name: medication?.name || '',
            dosage: medication?.dosage || '',
            times: medication?.times.join(', ') || '',
            repeat: medication?.repeat || 'daily',
        },
    });

    const onSubmit: SubmitHandler<MedicationFormData> = (data) => {
        const { image, ...medicationData } = data;
        
        const medicationPayload = {
            ...medicationData,
            times: data.times.split(',').map(t => t.trim()).filter(Boolean),
        };

        if (medication) {
            updateMedication({ ...medication, ...medicationPayload }, image);
        } else {
            addMedication({ ...medicationPayload, image });
        }
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(onSubmit)}>
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
                            {errors.name && <p className="col-span-4 text-red-500 text-xs text-right">{errors.name.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dosage" className="text-right">Dosage</Label>
                            <Input id="dosage" {...register('dosage')} className="col-span-3" />
                            {errors.dosage && <p className="col-span-4 text-red-500 text-xs text-right">{errors.dosage.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="times" className="text-right">Times</Label>
                            <Input id="times" {...register('times')} placeholder="e.g. 08:00, 20:00" className="col-span-3" />
                            {errors.times && <p className="col-span-4 text-red-500 text-xs text-right">{errors.times.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="repeat" className="text-right">Repeat</Label>
                             <Select onValueChange={(value) => control._updateFormState({ ...control._formValues, repeat: value })} defaultValue={medication?.repeat || 'daily'}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="image" className="text-right">Image</Label>
                            <Input id="image" type="file" {...register('image')} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
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
