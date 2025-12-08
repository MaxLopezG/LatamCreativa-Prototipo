
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { useAppStore } from './hooks/useAppStore';

// Initialize Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  const { actions } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      if (firebaseUser) {
        try {
          // Check if user exists in Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          let userRole = 'Creative Member';
          let userLocation = 'Latam';

          if (userDocSnap.exists()) {
            // User exists, get role and location from Firestore
            const userData = userDocSnap.data();
            userRole = userData.role || 'Creative Member';
            userLocation = userData.location || 'Latam';
            console.log("User found in Firestore:", userData);
          } else {
            // User doesn't exist, create new document
            const newUser = {
              name: firebaseUser.displayName || 'Usuario',
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || 'https://ui-avatars.com/api/?name=' + (firebaseUser.displayName || 'U'),
              role: 'Creative Member',
              location: 'Latam',
              createdAt: new Date().toISOString()
            };

            await setDoc(userDocRef, newUser);
            console.log("Created new user in Firestore:", newUser);
          }

          // Map to App user with data from Firestore (or defaults)
          const appUser = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Usuario',
            avatar: firebaseUser.photoURL || 'https://ui-avatars.com/api/?name=' + (firebaseUser.displayName || 'U'),
            role: userRole,
            location: userLocation,
            email: firebaseUser.email || ''
          };

          console.log("Setting App User:", appUser);
          actions.setUser(appUser);

        } catch (error) {
          console.error("Error fetching/creating user profile:", error);
          // Fallback if Firestore fails: use basic auth data
          const appUser = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Usuario',
            avatar: firebaseUser.photoURL || 'https://ui-avatars.com/api/?name=' + (firebaseUser.displayName || 'U'),
            role: 'Creative Member',
            location: 'Latam',
            email: firebaseUser.email || ''
          };
          actions.setUser(appUser);
        }
      } else {
        actions.setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
