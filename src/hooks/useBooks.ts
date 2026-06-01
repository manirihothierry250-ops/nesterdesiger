import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  pdfUrl: string; // Base64 or external url
  coverUrl?: string; // Optional cover image base64
  downloads?: number;
  createdAt: any;
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'books'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Book[];
      setBooks(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching books:", error instanceof Error ? error.message : String(error));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { books, loading };
}
