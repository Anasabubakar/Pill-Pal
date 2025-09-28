'use client';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { useDataContext } from '@/context/data-context';
import { LogsTable } from '@/components/logs-table';

export default function LogsPage() {
  const { logs } = useDataContext();

  const handleExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Medication,Status,Time,Date,Note\r\n";
    logs.forEach(log => {
        const row = [
            log.medicationName,
            log.status,
            log.takenAt.toLocaleTimeString(),
            log.takenAt.toLocaleDateString(),
            log.note || ''
        ].join(",");
        csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "medication_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <>
      <PageHeader
        title="Medication Logs"
        description="View your adherence history and export your data."
      >
        <Button variant="outline" onClick={handleExport}>
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
