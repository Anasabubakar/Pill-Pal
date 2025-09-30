
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
import { useToast } from '@/hooks/use-toast';

type MedicationInput = Omit<Medication, 'id' | 'status' | 'startDate' | 'userId'>;

interface DataContextType {
  medications: Medication[];
  logs: Log[];
  todaysMedications: Medication[];
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
  const [dataLoading, setDataLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading) {
        // If auth is done and there's still no user, we can stop loading data.
        setDataLoading(false);
      }
      return;
    }

    setDataLoading(true);
    
    const medsQuery = query(collection(db, 'users', user.uid, 'medications'));
    const logsQuery = query(collection(db, 'users', user.uid, 'logs'));

    const unsubMeds = onSnapshot(medsQuery, (querySnapshot) => {
      const items: Medication[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const item: { [key: string]: any } = { id: doc.id, ...data };
        for (const key in item) {
          if (item[key] instanceof Timestamp) {
            item[key] = item[key].toDate();
          }
        }
        items.push(item as Medication);
      });
      setMedications(items);
      setDataLoading(false); // Stop loading once medications are fetched
    }, (error) => {
      console.error("Error fetching medications:", error);
      toast({ title: "Error", description: "Could not fetch medications.", variant: "destructive" });
      setDataLoading(false);
    });

    const unsubLogs = onSnapshot(logsQuery, (querySnapshot) => {
      const items: Log[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const item: { [key: string]: any } = { id: doc.id, ...data };
        for (const key in item) {
          if (item[key] instanceof Timestamp) {
            item[key] = item[key].toDate();
          }
        }
        items.push(item as Log);
      });
      // Sort logs by most recent first
      setLogs(items.sort((a, b) => b.takenAt.getTime() - a.takenAt.getTime()));
    }, (error) => {
      console.error("Error fetching logs:", error);
      toast({ title: "Error", description: "Could not fetch medication logs.", variant: "destructive" });
    });

    return () => {
      unsubMeds();
      unsubLogs();
    };
  }, [user, authLoading, toast]);
  
  // Wait for both auth and initial data load to complete
  if (authLoading || dataLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading Data...</div>;
  }

  const today = new Date();
  const todaysMedications = medications.filter(med => 
    med.status === 'active' && 
    med.startDate <= today && 
    (!med.endDate || med.endDate >= today)
  );

  const addMedication = async (med: MedicationInput) => {
    if (!user) throw new Error("User not authenticated");
    try {
      const newMedData = {
        ...med,
        userId: user.uid,
        status: 'active',
        startDate: new Date(),
      };
      await addDoc(collection(db, 'users', user.uid, 'medications'), newMedData);
    } catch (error) {
      console.error("Failed to add medication:", error);
      toast({ title: "Save Failed", description: "Your medication could not be saved. Please try again.", variant: "destructive" });
      throw error; 
    }
  };

  const updateMedication = async (updatedMed: Medication) => {
    if (!user) throw new Error("User not authenticated");
    try {
      const { id, ...medData } = updatedMed;
      const docRef = doc(db, 'users', user.uid, 'medications', id);
      await updateDoc(docRef, medData as { [x: string]: any });
    } catch (error) {
      console.error("Failed to update medication:", error);
      toast({ title: "Update Failed", description: "Your changes could not be saved. Please try again.", variant: "destructive" });
      throw error;
    }
  };

  const deleteMedication = async (id: string) => {
    if (!user) throw new Error("User not authenticated");
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'medications', id));
      toast({
        title: 'Deleted',
        description: 'The medication has been deleted.',
      });
    } catch (error) {
      console.error("Failed to delete medication:", error);
      toast({ title: "Delete Failed", description: "Could not delete medication.", variant: "destructive" });
    }
  };

  const addLog = async (log: Omit<Log, 'id' | 'userId'>) => {
    if (!user) throw new Error("User not authenticated");
    const newLog = { ...log, userId: user.uid };
    try {
      await addDoc(collection(db, 'users', user.uid, 'logs'), newLog);
    } catch (error) {
        console.error("Failed to add log:", error);
        toast({ title: "Log Failed", description: "Could not log medication status.", variant: "destructive" });
    }
  };

  return (
    <DataContext.Provider value={{
        medications,
        logs,
        todaysMedications,
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
