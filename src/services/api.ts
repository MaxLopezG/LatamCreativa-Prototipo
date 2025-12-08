import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  addDoc,
  doc,
  getDoc,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { PortfolioItem, ArtistProfile } from '../types';

// Helper for pagination
export interface PaginatedResult<T> {
  data: T[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export const api = {
  // --- Projects (Feed) ---
  getProjects: async (lastDoc: QueryDocumentSnapshot<DocumentData> | null = null, pageSize = 10): Promise<PaginatedResult<PortfolioItem>> => {
    try {
      let q = query(
        collection(db, 'projects'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(
          collection(db, 'projects'),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(pageSize)
        );
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));

      return {
        data,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
        hasMore: snapshot.docs.length === pageSize
      };
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  },

  createProject: async (projectData: Omit<PortfolioItem, 'id'>, imageFile?: File): Promise<string> => {
    try {
      let imageUrl = projectData.image;

      // 1. Upload Image if provided
      if (imageFile) {
        const storageRef = ref(storage, `projects/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      // 2. Save Document
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        image: imageUrl,
        createdAt: new Date().toISOString(),
        likes: 0,
        views: 0
      });

      return docRef.id;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  // --- User Profile & Admin ---
  getUserProfile: async (userId: string): Promise<any> => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        // If not in firestore, return basic info (fallback)
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  getAllUsers: async (): Promise<any[]> => {
    try {
      const q = query(collection(db, 'users'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }
};