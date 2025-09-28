'use client';
import { PlusCircle } from 'lucide-react';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { useDataContext } from '@/context/data-context';
import { MedicationsTable } from '@/components/medications-table';
import { AddMedicationDialog } from '@/components/medication-dialogs';

export default function MedicationsPage() {
  const { medications, addMedication, updateMedication, deleteMedication } = useDataContext();

  return (
    <>
      <PageHeader
        title="Medications"
        description="Manage your medication schedules and details."
      >
        <AddMedicationDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Medication
          </Button>
        </AddMedicationDialog>
      </PageHeader>
      <div className="flex-1 overflow-auto p-6 bg-background/50">
        <MedicationsTable 
          medications={medications} 
          onUpdate={updateMedication} 
          onDelete={deleteMedication}
        />
      </div>
    </>
  );
}
