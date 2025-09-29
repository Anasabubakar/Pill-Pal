'use client';
import { MoreHorizontal, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditMedicationDialog, DeleteMedicationDialog } from '@/components/medication-dialogs';
import type { Medication } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface MedicationsTableProps {
  medications: Medication[];
  onUpdate: (med: Medication) => void;
  onDelete: (id: string) => void;
}

export function MedicationsTable({ medications, onUpdate, onDelete }: MedicationsTableProps) {
  const handleDeactivate = (med: Medication) => {
    onUpdate({ ...med, status: 'inactive' });
  };
  
  return (
    <div className="rounded-lg border shadow-sm bg-card animate-in fade-in duration-500">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medications.map((med) => (
            <TableRow key={med.id}>
              <TableCell>
                <Avatar className="h-12 w-12 rounded-md">
                    <AvatarImage src={med.imageUrl} alt={med.name} />
                    <AvatarFallback className="rounded-md bg-muted">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{med.name}</TableCell>
              <TableCell>{med.dosage}</TableCell>
              <TableCell>{med.times.join(', ')} - {med.repeat}</TableCell>
              <TableCell>
                <Badge variant={med.status === 'active' ? 'default' : 'secondary'} className={`capitalize ${med.status === 'active' ? 'bg-green-500/20 text-green-700' : ''}`}>
                  {med.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <EditMedicationDialog medication={med}>
                       <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
                         Edit
                       </button>
                    </EditMedicationDialog>
                    <DropdownMenuItem onClick={() => handleDeactivate(med)}>Deactivate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DeleteMedicationDialog medicationId={med.id}>
                      <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive">
                        Delete
                      </button>
                    </DeleteMedicationDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
