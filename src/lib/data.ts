import type { User, Medication, Log, Guardian } from './types';

export const user: User = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
};

export const medications: Medication[] = [
  {
    id: 'med1',
    name: 'Lisinopril',
    dosage: '10mg, 1 pill',
    times: ['08:00', '20:00'],
    repeat: 'daily',
    startDate: new Date(),
    status: 'active',
  },
  {
    id: 'med2',
    name: 'Metformin',
    dosage: '500mg, 1 pill',
    times: ['09:00'],
    repeat: 'daily',
    startDate: new Date(),
    status: 'active',
  },
  {
    id: 'med3',
    name: 'Vitamin D3',
    dosage: '1000 IU, 1 capsule',
    times: ['09:00'],
    repeat: 'daily',
    startDate: new Date(),
    status: 'active',
  },
    {
    id: 'med4',
    name: 'Amoxicillin',
    dosage: '250mg, 1 pill',
    times: ['08:00', '14:00', '22:00'],
    repeat: 'daily',
    startDate: new Date('2023-10-20'),
    endDate: new Date('2023-10-27'),
    status: 'inactive',
  },
];

export const logs: Log[] = [
  {
    id: 'log1',
    medicationName: 'Lisinopril',
    takenAt: new Date(new Date().setHours(8, 2, 0, 0)),
    status: 'taken',
  },
  {
    id: 'log2',
    medicationName: 'Metformin',
    takenAt: new Date(new Date().setHours(9, 5, 0, 0)),
    status: 'taken',
  },
    {
    id: 'log3',
    medicationName: 'Vitamin D3',
    takenAt: new Date(new Date().setHours(9, 5, 0, 0)),
    status: 'taken',
  },
  {
    id: 'log4',
    medicationName: 'Lisinopril',
    takenAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    status: 'missed',
    note: "Forgot before leaving for work."
  },
];

export const guardians: Guardian[] = [
    {
        id: 'guard1',
        email: 'jane.doe@example.com',
        permissions: ['viewLogs', 'receiveAlerts'],
        status: 'active',
    },
    {
        id: 'guard2',
        email: 'john.smith@example.com',
        permissions: ['viewLogs'],
        status: 'pending',
    }
]
