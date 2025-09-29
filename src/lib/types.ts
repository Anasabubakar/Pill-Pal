
export type Medication = {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  times: string[];
  repeat: 'daily' | 'weekly' | 'custom';
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'inactive';
};

export type Log = {
  id: string;
  userId: string;
  medicationId: string;
  medicationName: string;
  takenAt: Date;
  status: 'taken' | 'missed';
  note?: string;
};

export type Guardian = {
  id: string;
  userId: string;
  email: string;
  permissions: ('viewLogs' | 'receiveAlerts')[];
  status: 'pending' | 'active';
}

export type User = {
  name: string;
  email: string;
  avatar: string;
};
