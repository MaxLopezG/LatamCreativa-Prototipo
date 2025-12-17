
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { useAppStore } from './hooks/useAppStore';
import { usersService } from './services/modules/users';

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
          const userDocRef = doc(db, 'users', firebaseUser.uid);

          // 1. Initial Check & Creation
          // We use centralized service to avoid race conditions with AuthView
          await usersService.initializeUserProfile(firebaseUser);

          // 2. Real-time Listener for Updates & Session Validation
          const unsubscribeSnapshot = onSnapshot(userDocRef, (userDocSnap) => {
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              const userRole = userData.role || 'Creative Member';
              const userLocation = userData.location || 'Latam';
              const isAdminFromStore = userData.isAdmin || false;
              const isAdmin = firebaseUser.email === 'admin@latamcreativa.com';

              const appUser = {
                id: firebaseUser.uid,
                name: userData.name || firebaseUser.displayName || 'Usuario',
                avatar: userData.avatar || firebaseUser.photoURL || 'https://ui-avatars.com/api/?name=' + (firebaseUser.displayName || 'U'),
                role: isAdmin ? 'Administrator' : userRole,
                location: userLocation,
                email: firebaseUser.email || '',
                isAdmin: isAdminFromStore || isAdmin,
                createdAt: userData.createdAt || (firebaseUser.metadata.creationTime || new Date().toISOString()),
                ...userData
              };

              actions.setUser(appUser);

              // Restore Content Mode Logic
              const devKeywords = ['developer', 'desarrollador', 'engineer', 'ingeniero', 'coder', 'programmer', 'programador', 'software', 'tech', 'web', 'app', 'mobile', 'backend', 'frontend', 'fullstack', 'devops', 'data', 'ai'];
              const userRoleName = (appUser.role || '').toLowerCase();
              const isDevRole = devKeywords.some(k => userRoleName.includes(k));
              const inferredMode = isDevRole ? 'dev' : 'creative';
              // actions.setContentMode(inferredMode); // Let store persistence handle this, or set if needed.

            } else {
              // Document deleted -> Invalidate Session
              console.warn("User document deleted. Logging out.");
              signOut(auth);
              actions.setUser(null);
            }
          });

          return () => unsubscribeSnapshot();

        } catch (error) {
          console.error("Error fetching/creating user profile:", error);
        }
      } else {
        actions.setUser(null);
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
