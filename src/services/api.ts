import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  QueryDocumentSnapshot,
  DocumentData,
  where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { PortfolioItem, ArtistProfile, ArticleItem } from '../types';

// Helper for pagination
export interface PaginatedResult<T> {
  data: T[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

// Helper for timeouts
const withTimeout = <T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(errorMessage)), ms))
  ]);
};

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

  // --- Articles (Blog) ---
  getArticles: async (lastDoc: QueryDocumentSnapshot<DocumentData> | null = null, pageSize = 10): Promise<PaginatedResult<ArticleItem>> => {
    try {
      let q = query(
        collection(db, 'articles'),
        orderBy('date', 'desc'),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(
          collection(db, 'articles'),
          orderBy('date', 'desc'),
          startAfter(lastDoc),
          limit(pageSize)
        );
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArticleItem));

      return {
        data,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
        hasMore: snapshot.docs.length === pageSize
      };
    } catch (error) {
      console.error("Error fetching articles:", error);
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



  // ...

  createArticle: async (articleData: Omit<ArticleItem, 'id'>, imageFile?: File): Promise<string> => {
    console.log("api.createArticle started");
    try {
      let imageUrl = articleData.image;

      // 1. Upload Image if provided
      if (imageFile) {
        console.log("Uploading image...", imageFile.name);
        try {
          const storageRef = ref(storage, `articles/${Date.now()}_${imageFile.name}`);

          // Add 7s timeout for upload (reduced for testing)
          const uploadResult = await withTimeout(
            uploadBytes(storageRef, imageFile),
            7000,
            "Image upload timed out (7s). Please check your connection."
          );

          console.log("Image uploaded. Fetching download URL...");
          imageUrl = await getDownloadURL(uploadResult.ref);
          console.log("Image URL fetched:", imageUrl);
        } catch (uploadError: any) {
          console.error("Error uploading image (proceeding without it):", uploadError);
          // Non-fatal error: proceed with the default/mock image URL if upload fails
          // We don't throw here anymore
        }
      }

      // 2. Save Document
      console.log("Saving article to Firestore...");

      // Sanitize data to remove undefined values
      const sanitizeData = (data: any) => {
        return JSON.parse(JSON.stringify(data));
      };

      const finalData = sanitizeData({
        ...articleData,
        image: imageUrl,
        date: new Date().toISOString(),
        likes: 0,
        comments: 0
      });

      // Add 7s timeout for Firestore
      const docRef = await withTimeout(
        addDoc(collection(db, 'articles'), finalData),
        7000,
        "Saving article timed out (7s). Please check your connection."
      );

      console.log("Article saved with ID:", docRef.id);

      return docRef.id;
    } catch (error) {
      console.error("Error creating article (main catch):", error);
      throw error;
    }
  },

  updateArticle: async (articleId: string, articleData: Partial<ArticleItem>, imageFile?: File): Promise<void> => {
    console.log("api.updateArticle started for ID:", articleId);
    try {
      let imageUrl = articleData.image;

      // 1. Upload New Image if provided
      if (imageFile) {
        console.log("Uploading new image...", imageFile.name);
        const storageRef = ref(storage, `articles/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      // 2. Update Document
      const docRef = doc(db, 'articles', articleId);

      // Sanitize
      const sanitizeData = (data: any) => JSON.parse(JSON.stringify(data));

      const finalData = sanitizeData({
        ...articleData,
        image: imageUrl
      });

      await updateDoc(docRef, finalData);
      console.log("Article updated successfully");

    } catch (error) {
      console.error("Error updating article:", error);
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
  },

  // --- User Articles ---
  getUserArticles: async (authorName: string): Promise<ArticleItem[]> => {
    try {
      const q = query(
        collection(db, 'articles'),
        where('author', '==', authorName),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArticleItem));
    } catch (error) {
      console.error("Error fetching user articles:", error);
      throw error;
    }
  },

  // --- Single Article ---
  getArticle: async (articleId: string): Promise<ArticleItem | null> => {
    try {
      const docRef = doc(db, 'articles', articleId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ArticleItem;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      throw error;
    }
  },

  deleteArticle: async (articleId: string): Promise<void> => {
    console.log("api.deleteArticle called with ID:", articleId);
    try {
      const docRef = doc(db, 'articles', articleId);
      console.log("Deleting doc ref:", docRef.path);
      await deleteDoc(docRef);
      console.log("Delete successful");
    } catch (error) {
      console.error("Error deleting article in api:", error);
      throw error;
    }
  },
};