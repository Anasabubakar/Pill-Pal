
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  getFirestore,
  collection,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  onSnapshot,
  where,
} from 'firebase/firestore';
import type { Medication, Log } from '@/lib/types';
import { app } from '@/lib/firebase';
import { useAuth } from './auth-context';

type MedicationInput = Omit<Medication, 'id' | 'status' | 'startDate' | 'userId'>;

interface DataContextType {
  medications: Medication[];
  logs: Log[];
  todaysMedications: Medication[];
  loadingData: boolean;
  addMedication: (med: MedicationInput) => Promise<void>;
  updateMedication: (med: Medication) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  addLog: (log: Omit<Log, 'id' | 'userId'>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const db = getFirestore(app);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Strict check: If auth is loading or there's no user, do not proceed.
  // This is the core of the fix. The DataProvider will not render its children
  // until authentication is fully resolved and a user is present.
  if (authLoading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  useEffect(() => {
    // Because of the check above, this effect will ONLY run when we have a confirmed user.
    const medsQuery = query(collection(db, 'users', user.uid, 'medications'));
    const logsQuery = query(collection(db, 'users', user.uid, 'logs'));

    const unsubMeds = onSnapshot(medsQuery, (querySnapshot) => {
      const items: Medication[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const item = { id: doc.id, ...data };
        for (const key in item) {
          if (item[key] instanceof Timestamp) {
            item[key] = item[key].toDate();
          }
        }
        items.push(item as Medication);
      });
      setMedications(items);
      setLoadingData(false);
    }, (error) => {
      console.error("Error fetching medications:", error);
      setLoadingData(false);
    });

    const unsubLogs = onSnapshot(logsQuery, (querySnapshot) => {
      const items: Log[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const item = { id: doc.id, ...data };
        for (const key in item) {
          if (item[key] instanceof Timestamp) {
            item[key] = item[key].toDate();
          }
        }
        items.push(item as Log);
      });
      setLogs(items);
    }, (error) => {
      console.error("Error fetching logs:", error);
    });

    return () => {
      unsubMeds();
      unsubLogs();
    };
  }, [user]);

  const today = new Date();
  const todaysMedications = medications.filter(med => med.status === 'active' && med.startDate <= today && (!med.endDate || med.endDate >= today));

   const addMedication = async (med: MedicationInput) => {
    if (!user) throw new Error("User not authenticated");

    const newMedData = {
      ...med,
      userId: user.uid,
      status: 'active',
      startDate: new Date(),
    };
    
    await addDoc(collection(db, 'users', user.uid, 'medications'), newMedData);
  };

  const updateMedication = async (updatedMed: Medication) => {
     if (!user) throw new Error("User not authenticated");

    const { id, ...medData } = updatedMed;
    const docRef = doc(db, 'users', user.uid, 'medications', id);
    await updateDoc(docRef, medData as { [x: string]: any });
  };


  const deleteMedication = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'medications', id));
  };

  const addLog = async (log: Omit<Log, 'id' | 'userId'>) => {
    if (!user) return;
    const newLog = {
      ...log,
      userId: user.uid,
    };
    await addDoc(collection(db, 'users', user.uid, 'logs'), newLog);
  };

  return (
    <DataContext.Provider value={{
        medications,
        logs,
        todaysMedications,
        loadingData,
        addMedication,
        updateMedication,
        deleteMedication,
        addLog,
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
