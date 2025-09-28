import { PlusCircle } from 'lucide-react';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { medications } from '@/lib/data';
import { MedicationsTable } from '@/components/medications-table';

export default function MedicationsPage() {
  return (
    <>
      <PageHeader
        title="Medications"
        description="Manage your medication schedules and details."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Medication
        </Button>
      </PageHeader>
      <div className="flex-1 overflow-auto p-6 bg-background/50">
        <MedicationsTable medications={medications} />
      </div>
    </>
  );
}
