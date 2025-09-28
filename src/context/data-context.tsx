'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Medication, Log, Guardian } from '@/lib/types';
import { 
    medications as initialMedications,
    logs as initialLogs,
    guardians as initialGuardians 
} from '@/lib/data';

interface DataContextType {
  medications: Medication[];
  logs: Log[];
  guardians: Guardian[];
  todaysMedications: Medication[];
  addMedication: (med: Omit<Medication, 'id' | 'status' | 'startDate'>) => void;
  updateMedication: (med: Medication) => void;
  deleteMedication: (id: string) => void;
  addLog: (log: Omit<Log, 'id'>) => void;
  addGuardian: (guardian: Omit<Guardian, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [logs, setLogs] = useState<Log[]>(initialLogs);
  const [guardians, setGuardians] = useState<Guardian[]>(initialGuardians);
  
  const today = new Date();
  const todaysMedications = medications.filter(med => med.status === 'active' && med.startDate <= today && (!med.endDate || med.endDate >= today));

  const addMedication = (med: Omit<Medication, 'id' | 'status' | 'startDate'>) => {
    const newMed: Medication = {
      ...med,
      id: `med${Date.now()}`,
      status: 'active',
      startDate: new Date(),
    };
    setMedications(prev => [...prev, newMed]);
  };

  const updateMedication = (updatedMed: Medication) => {
    setMedications(prev => prev.map(med => med.id === updatedMed.id ? updatedMed : med));
  };

  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  };

  const addLog = (log: Omit<Log, 'id'>) => {
    const newLog: Log = {
      ...log,
      id: `log${Date.now()}`,
    };
    setLogs(prev => [...prev, newLog]);
  };

  const addGuardian = (guardian: Omit<Guardian, 'id'>) => {
    const newGuardian: Guardian = {
      ...guardian,
      id: `guard${Date.now()}`,
    }
    setGuardians(prev => [...prev, newGuardian]);
  };


  return (
    <DataContext.Provider value={{ 
        medications, 
        logs, 
        guardians,
        todaysMedications,
        addMedication, 
        updateMedication, 
        deleteMedication,
        addLog,
        addGuardian
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
}
