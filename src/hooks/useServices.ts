import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  active: boolean;
  createdAt: any;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'services'),
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      setServices(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching services:", error instanceof Error ? error.message : String(error));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { services, loading };
}
