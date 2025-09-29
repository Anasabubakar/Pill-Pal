
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
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) {
      setMedications([]);
      setLogs([]);
      setLoadingData(false);
      return;
    }

    setLoadingData(true);

    const collections = {
      medications: setMedications,
      logs: setLogs,
    };

    const unsubscribes = Object.entries(collections).map(([colName, setter]) => {
      const q = query(collection(db, 'users', user.uid, colName));
      return onSnapshot(q, (querySnapshot) => {
        const items: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const item = { id: doc.id, ...data };
          for (const key in item) {
            if (item[key] instanceof Timestamp) {
              item[key] = item[key].toDate();
            }
          }
          items.push(item);
        });
        setter(items);
      });
    });

    setLoadingData(false);

    // Cleanup listeners on unmount
    return () => unsubscribes.forEach((unsub) => unsub());
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
    
    await addDoc(collection(db, `users/${user.uid}/medications`), newMedData);
  };

  const updateMedication = async (updatedMed: Medication) => {
     if (!user) throw new Error("User not authenticated");

    const { id, ...medData } = updatedMed;
    const docRef = doc(db, `users/${user.uid}/medications`, id);
    await updateDoc(docRef, medData as { [x: string]: any });
  };


  const deleteMedication = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `users/${user.uid}/medications`, id));
  };

  const addLog = async (log: Omit<Log, 'id' | 'userId'>) => {
    if (!user) return;
    const newLog = {
      ...log,
      userId: user.uid,
    };
    await addDoc(collection(db, `users/${user.uid}/logs`), newLog);
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
