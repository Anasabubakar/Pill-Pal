import { Download } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { logs } from '@/lib/data';
import { LogsTable } from '@/components/logs-table';

export default function LogsPage() {
  return (
    <>
      <PageHeader
        title="Medication Logs"
        description="View your adherence history and export your data."
      >
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export as CSV
        </Button>
      </PageHeader>
      <div className="flex-1 overflow-auto p-6 bg-background/50">
        <LogsTable logs={logs} />
      </div>
    </>
  );
}
