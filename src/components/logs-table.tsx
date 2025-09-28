import { CheckCircle2, XCircle, MessageSquare } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Log } from '@/lib/types';

interface LogsTableProps {
  logs: Log[];
}

export function LogsTable({ logs }: LogsTableProps) {
  return (
    <div className="rounded-lg border shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medication</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.medicationName}</TableCell>
              <TableCell>
                <Badge variant={log.status === 'taken' ? 'default' : 'destructive'} className={`capitalize ${log.status === 'taken' ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'}`}>
                  {log.status === 'taken' ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
                  {log.status}
                </Badge>
              </TableCell>
              <TableCell>{log.takenAt.toLocaleTimeString()}</TableCell>
              <TableCell>{log.takenAt.toLocaleDateString()}</TableCell>
              <TableCell>
                {log.note && (
                   <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{log.note}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
