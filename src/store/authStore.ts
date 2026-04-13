import { create } from 'zustand';
import { User } from 'firebase/auth';
import { subscribeToAuthState, signOut } from '../firebase/authProviders';
import { syncUserToFirestore } from '../firebase/userProfile';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setError: (msg: string | null) => void;
  logout: () => Promise<void>;
  subscribeToAuth: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user, loading: false }),
  setError: (error) => set({ error }),

  logout: async () => {
    await signOut();
    set({ user: null });
  },

  subscribeToAuth: () => {
    const unsubscribe = subscribeToAuthState(async (user) => {
      set({ user, loading: false });
      if (user) {
        // Sync profile to Firestore on every login
        await syncUserToFirestore(user);
      }
    });
    return unsubscribe;
  },
}));
