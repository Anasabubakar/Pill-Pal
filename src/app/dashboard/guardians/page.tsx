'use client';
import { Send, UserPlus } from 'lucide-react';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useDataContext } from '@/context/data-context';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { Guardian } from '@/lib/types';

type Inputs = {
  email: string;
  viewLogs: boolean;
  receiveAlerts: boolean;
};

export default function GuardiansPage() {
  const { guardians, addGuardian } = useDataContext();
  const { register, handleSubmit, reset } = useForm<Inputs>();
  
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const permissions: ('viewLogs' | 'receiveAlerts')[] = [];
    if (data.viewLogs) permissions.push('viewLogs');
    if (data.receiveAlerts) permissions.push('receiveAlerts');

    const newGuardian: Omit<Guardian, 'id'> = {
      email: data.email,
      permissions,
      status: 'pending',
    };
    addGuardian(newGuardian);
    reset();
  };

  return (
    <>
      <PageHeader
        title="Guardians"
        description="Invite family or friends to help you manage your medications."
      />
      <div className="flex-1 overflow-auto p-6 bg-background/50 grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <UserPlus className="h-6 w-6 text-primary" />
              Invite a New Guardian
            </CardTitle>
            <CardDescription>
              Enter the email of the person you want to invite. They will receive an email to accept your invitation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Guardian's Email</Label>
                <Input id="email" type="email" placeholder="guardian@example.com" {...register('email', { required: true })}/>
              </div>
              <div className="space-y-2">
                 <Label>Permissions</Label>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="viewLogs" {...register('viewLogs')} defaultChecked/>
                        <Label htmlFor="viewLogs">View Logs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="receiveAlerts" {...register('receiveAlerts')} />
                        <Label htmlFor="receiveAlerts">Receive Alerts</Label>
                    </div>
                 </div>
              </div>
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Your Guardians</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {guardians.map(g => (
                             <TableRow key={g.id}>
                                <TableCell className="font-medium">{g.email}</TableCell>
                                <TableCell>
                                    <Badge variant={g.status === 'active' ? 'default' : 'secondary'} className={`capitalize ${g.status === 'active' ? 'bg-green-500/20 text-green-700' : ''}`}>
                                        {g.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
