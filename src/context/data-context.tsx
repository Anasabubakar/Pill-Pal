
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
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import type { Medication, Log } from '@/lib/types';
import { app } from '@/lib/firebase';
import { useAuth } from './auth-context';

type MedicationInput = Omit<Medication, 'id' | 'status' | 'startDate' | 'userId' | 'imageUrl' | 'imagePath'> & { image?: FileList };

interface DataContextType {
  medications: Medication[];
  logs: Log[];
  todaysMedications: Medication[];
  loadingData: boolean;
  addMedication: (med: MedicationInput) => Promise<void>;
  updateMedication: (med: Medication, newImage?: FileList) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  addLog: (log: Omit<Log, 'id' | 'userId'>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const db = getFirestore(app);
const storage = getStorage(app);

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
    
    const collections = ['medications', 'logs'];
    const setters:any = {
      medications: setMedications,
      logs: setLogs,
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

  const uploadImage = async (userId: string, imageFile: File): Promise<{ imageUrl: string, imagePath: string }> => {
    const imagePath = `users/${userId}/medications/${Date.now()}_${imageFile.name}`;
    const storageRef = ref(storage, imagePath);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref);
    return { imageUrl, imagePath };
  };

  const addMedication = async (med: MedicationInput) => {
    if (!user) throw new Error("User not authenticated");

    const { image, ...medData } = med;
    
    let imageInfo = { imageUrl: '', imagePath: '' };
    if (image && image.length > 0) {
      // Upload image first if it exists
      imageInfo = await uploadImage(user.uid, image[0]);
    }

    const newMedData = {
      ...medData,
      userId: user.uid,
      status: 'active',
      startDate: new Date(),
      ...imageInfo,
    };

    await addDoc(collection(db, `users/${user.uid}/medications`), newMedData);
  };


  const updateMedication = async (updatedMed: Medication, newImage?: FileList) => {
     if (!user) throw new Error("User not authenticated");

    const { id, ...medData } = updatedMed;
    const docRef = doc(db, `users/${user.uid}/medications`, id);
    
    let updatedData: any = { ...medData };

    if (newImage && newImage.length > 0) {
      // Delete the old image if it exists
      if (medData.imagePath) {
        const oldImageRef = ref(storage, medData.imagePath);
        await deleteObject(oldImageRef).catch(e => console.error("Error deleting old image:", e));
      }
      
      // Upload the new image
      const imageInfo = await uploadImage(user.uid, newImage[0]);
      updatedData = { ...updatedData, ...imageInfo };
    }

    await updateDoc(docRef, updatedData);
  };


  const deleteMedication = async (id: string) => {
    if (!user) return;

    const medToDelete = medications.find(m => m.id === id);
    if (medToDelete && medToDelete.imagePath) {
        const imageRef = ref(storage, medToDelete.imagePath);
        await deleteObject(imageRef).catch(e => console.error("Error deleting image:", e));
    }

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
