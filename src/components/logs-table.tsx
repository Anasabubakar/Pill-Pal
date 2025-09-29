import { CheckCircle2, XCircle, MessageSquare, Calendar, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Log } from '@/lib/types';

interface LogsTableProps {
  logs: Log[];
}

export function LogsTable({ logs }: LogsTableProps) {
  return (
    <div>
      {/* Mobile View */}
      <div className="grid gap-4 md:hidden">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{log.medicationName}</CardTitle>
               <Badge variant={log.status === 'taken' ? 'default' : 'destructive'} className={`capitalize ${log.status === 'taken' ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'}`}>
                  {log.status === 'taken' ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
                  {log.status}
                </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{log.takenAt.toLocaleDateString()}</span>
                </div>
                 <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{log.takenAt.toLocaleTimeString()}</span>
                </div>
              </div>
              {log.note && (
                <div className="flex items-start gap-2 mt-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4 mt-1 flex-shrink-0" />
                  <p>{log.note}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop View */}
      <div className="rounded-lg border shadow-sm bg-card hidden md:block">
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
    </div>
  );
}
