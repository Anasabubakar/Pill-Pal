'use client';
import { MoreHorizontal, Pill, Clock, Repeat } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { EditMedicationDialog, DeleteMedicationDialog } from '@/components/medication-dialogs';
import type { Medication } from '@/lib/types';

interface MedicationsTableProps {
  medications: Medication[];
  onUpdate: (med: Medication) => void;
  onDelete: (id: string) => void;
}

function MedicationActions({ med, onUpdate }: { med: Medication, onUpdate: (med: Medication) => void }) {
  const handleDeactivate = () => {
    onUpdate({ ...med, status: 'inactive' });
  };

  return (
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
        <DropdownMenuItem onClick={handleDeactivate}>Deactivate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteMedicationDialog medicationId={med.id}>
          <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive">
            Delete
          </button>
        </DeleteMedicationDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function MedicationsTable({ medications, onUpdate, onDelete }: MedicationsTableProps) {
  
  return (
    <div className="animate-in fade-in duration-500">
      {/* Mobile View */}
      <div className="grid gap-4 md:hidden">
        {medications.map((med) => (
          <Card key={med.id} className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>{med.name}</CardTitle>
                <CardDescription>{med.dosage}</CardDescription>
              </div>
              <MedicationActions med={med} onUpdate={onUpdate} />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{med.times.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Repeat className="h-4 w-4" />
                  <span className="capitalize">{med.repeat}</span>
                </div>
              </div>
              <Badge variant={med.status === 'active' ? 'default' : 'secondary'} className={`capitalize mt-4 ${med.status === 'active' ? 'bg-green-500/20 text-green-700' : ''}`}>
                  {med.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Desktop View */}
      <div className="rounded-lg border shadow-sm bg-card hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableCell className="font-medium">{med.name}</TableCell>
                <TableCell>{med.dosage}</TableCell>
                <TableCell>{med.times.join(', ')} - {med.repeat}</TableCell>
                <TableCell>
                  <Badge variant={med.status === 'active' ? 'default' : 'secondary'} className={`capitalize ${med.status === 'active' ? 'bg-green-500/20 text-green-700' : ''}`}>
                    {med.status}
                  </Badge>
                </TableCell>
                <TableCell>
                   <MedicationActions med={med} onUpdate={onUpdate} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
