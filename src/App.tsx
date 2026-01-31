/**
 * App.tsx - Modo Local
 * 
 * Usa autenticación local en lugar de Firebase.
 */

import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAppStore } from './hooks/useAppStore';
import { localAuthService } from './services/local/auth';

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
    // Modo Local: Verificar si hay sesión guardada en localStorage
    const checkLocalAuth = () => {
      const currentUser = localAuthService.getCurrentUser();

      if (currentUser) {
        // Usuario encontrado en localStorage
        actions.setUser(currentUser as any);
        actions.setLoadingAuth(false);
      } else {
        // No hay sesión
        actions.setUser(null);
        actions.setLoadingAuth(false);
      }
    };

    // Verificar auth al iniciar
    checkLocalAuth();

    // Escuchar cambios en localStorage (para sincronización entre tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'latamcreativa_auth') {
        checkLocalAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;

// === MODO FIREBASE (Comentado) ===
// Para restaurar Firebase, reemplaza este archivo con la versión de Firebase:
/*
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { useAppStore } from './hooks/useAppStore';
import { usersService } from './services/modules/users';

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
          await usersService.initializeUserProfile(firebaseUser);

          const unsubscribeSnapshot = onSnapshot(userDocRef, (userDocSnap) => {
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              const appUser = {
                ...userData,
                id: firebaseUser.uid,
                name: userData.name || firebaseUser.displayName || 'Usuario',
                email: firebaseUser.email || '',
              };
              actions.setUser(appUser as any);
            } else {
              signOut(auth);
              actions.setUser(null);
            }
          });
          return () => unsubscribeSnapshot();
        } catch (error) {
          console.error("Error:", error);
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
*/
