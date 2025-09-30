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

  useEffect(() => {
    // Wait until auth is no longer loading and we have a user.
    if (authLoading || !user) {
      // If there's no user or auth is loading, we are not ready to fetch data.
      // If we previously had data, clear it out.
      if (medications.length > 0) setMedications([]);
      if (logs.length > 0) setLogs([]);
      // If there's no user, we can consider data "loaded" (as in, there's nothing to load).
      // If auth is loading, keep data loading true.
      setLoadingData(authLoading);
      return;
    }

    // At this point, we have a confirmed user. Set up Firestore listeners.
    setLoadingData(true);
    const medsQuery = query(collection(db, 'users', user.uid, 'medications'));
    const logsQuery = query(collection(db, 'users', user.uid, 'logs'));

    const unsubMeds = onSnapshot(medsQuery, (querySnapshot) => {
      const items: Medication[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const item = { id: doc.id, ...data };
        // Convert Firestore Timestamps to JS Dates
        for (const key in item) {
          if (item[key] instanceof Timestamp) {
            item[key] = item[key].toDate();
          }
        }
        items.push(item as Medication);
      });
      setMedications(items);
      // We only set loading to false once the initial medication data has loaded.
      setLoadingData(false);
    }, (error) => {
      console.error("Error fetching medications:", error);
      setLoadingData(false); // Also stop loading on error
    });

    const unsubLogs = onSnapshot(logsQuery, (querySnapshot) => {
      const items: Log[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const item = { id: doc.id, ...data };
         // Convert Firestore Timestamps to JS Dates
        for (const key in item) {
          if (item[key] instanceof Timestamp) {
            item[key] = item[key].toDate();
          }
        }
        items.push(item as Log);
      });
      setLogs(items.sort((a, b) => b.takenAt.getTime() - a.takenAt.getTime()));
    }, (error) => {
      console.error("Error fetching logs:", error);
    });

    // Cleanup function to unsubscribe from listeners when the component unmounts or user changes.
    return () => {
      unsubMeds();
      unsubLogs();
    };
  }, [user, authLoading]); // Effect depends on user and authLoading status.

  // The DataProvider's own gatekeeper.
  // Do not render children until both auth is resolved AND initial data has been fetched.
  if (authLoading || loadingData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const today = new Date();
  const todaysMedications = medications.filter(med => 
    med.status === 'active' && 
    med.startDate <= today && 
    (!med.endDate || med.endDate >= today)
  );

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
    if (!user) throw new Error("User not authenticated");
    await deleteDoc(doc(db, 'users', user.uid, 'medications', id));
  };

  const addLog = async (log: Omit<Log, 'id' | 'userId'>) => {
    if (!user) throw new Error("User not authenticated");
    const newLog = { ...log, userId: user.uid };
    await addDoc(collection(db, 'users', user.uid, 'logs'), newLog);
  };

  return (
    <DataContext.Provider value={{
        medications,
        logs,
        todaysMedications,
        loadingData: loadingData, // Pass down the loading state
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
