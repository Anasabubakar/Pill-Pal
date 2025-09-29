
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp,
  onSnapshot 
} from 'firebase/firestore';
import type { Medication, Log, Guardian } from '@/lib/types';
import { app } from '@/lib/firebase';
import { useAuth } from './auth-context';

interface DataContextType {
  medications: Medication[];
  logs: Log[];
  guardians: Guardian[];
  todaysMedications: Medication[];
  loadingData: boolean;
  addMedication: (med: Omit<Medication, 'id' | 'status' | 'startDate' | 'userId'>) => Promise<void>;
  updateMedication: (med: Medication) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  addLog: (log: Omit<Log, 'id' | 'userId'>) => Promise<void>;
  addGuardian: (guardian: Omit<Guardian, 'id' | 'userId'>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const db = getFirestore(app);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) {
      setMedications([]);
      setLogs([]);
      setGuardians([]);
      setLoadingData(false);
      return;
    }

    setLoadingData(true);
    
    const collections = ['medications', 'logs', 'guardians'];
    const setters:any = {
      medications: setMedications,
      logs: setLogs,
      guardians: setGuardians,
    };

    const unsubscribes = collections.map(colName => {
      const q = query(collection(db, `users/${user.uid}/${colName}`));
      
      return onSnapshot(q, (querySnapshot) => {
        const items: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Convert Firestore Timestamps to JS Dates
          const item = { id: doc.id, ...data };
          for (const key in item) {
            if (item[key] instanceof Timestamp) {
              item[key] = item[key].toDate();
            }
          }
          items.push(item);
        });
        setters[colName](items);
      });
    });

    setLoadingData(false);

    // Cleanup listeners on unmount
    return () => unsubscribes.forEach(unsub => unsub());

  }, [user]);

  const today = new Date();
  const todaysMedications = medications.filter(med => med.status === 'active' && med.startDate <= today && (!med.endDate || med.endDate >= today));

  const addMedication = async (med: Omit<Medication, 'id' | 'status' | 'startDate' | 'userId'>) => {
    if (!user) return;
    const newMed = {
      ...med,
      userId: user.uid,
      status: 'active',
      startDate: new Date(),
    };
    await addDoc(collection(db, `users/${user.uid}/medications`), newMed);
  };

  const updateMedication = async (updatedMed: Medication) => {
    if (!user) return;
    const { id, ...medData } = updatedMed;
    await updateDoc(doc(db, `users/${user.uid}/medications`, id), medData);
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

  const addGuardian = async (guardian: Omit<Guardian, 'id' | 'userId'>) => {
    if (!user) return;
    const newGuardian = {
      ...guardian,
      userId: user.uid,
    };
    await addDoc(collection(db, `users/${user.uid}/guardians`), newGuardian);
  };

  return (
    <DataContext.Provider value={{ 
        medications, 
        logs, 
        guardians,
        todaysMedications,
        loadingData,
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
