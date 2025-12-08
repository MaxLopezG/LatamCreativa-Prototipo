
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
          let isAdminFromStore = false;

          if (userDocSnap.exists()) {
            // User exists, get role and location from Firestore
            const userData = userDocSnap.data();
            userRole = userData.role || 'Creative Member';
            userLocation = userData.location || 'Latam';
            isAdminFromStore = userData.isAdmin || false;
            // User found
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
            // New user created
          }

          // Map to App user with data from Firestore (or defaults)
          const isAdmin = firebaseUser.email === 'admin@latamcreativa.com';

          const appUser = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Usuario',
            avatar: firebaseUser.photoURL || 'https://ui-avatars.com/api/?name=' + (firebaseUser.displayName || 'U'),
            role: isAdmin ? 'Administrator' : userRole,
            location: userLocation,
            email: firebaseUser.email || '',
            isAdmin: isAdminFromStore || isAdmin,
            createdAt: userDocSnap.exists() ? userDocSnap.data().createdAt : (firebaseUser.metadata.creationTime || new Date().toISOString())
          };

          // User state updated
          actions.setUser(appUser);

        } catch (error) {
          console.error("Error fetching/creating user profile:", error);
          // Fallback if Firestore fails: use basic auth data
          const isAdmin = firebaseUser.email === 'admin@latamcreativa.com';
          const appUser = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Usuario',
            avatar: firebaseUser.photoURL || 'https://ui-avatars.com/api/?name=' + (firebaseUser.displayName || 'U'),
            role: isAdmin ? 'Administrator' : 'Creative Member',
            location: 'Latam',
            email: firebaseUser.email || '',
            isAdmin: isAdmin,
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
          };
          actions.setUser(appUser);
        }
      } else {
        actions.setUser(null);
        // Ensure loading is set to false even if no user
        actions.setLoadingAuth(false);
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
