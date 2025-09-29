
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
  imageUrl?: string;
  imagePath?: string;
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

export type User = {
  name: string;
  email: string;
  avatar: string;
};
