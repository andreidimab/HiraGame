import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Direct import from the React Native bundle — getReactNativePersistence is not
// exported by firebase/auth but lives in @firebase/auth's RN-specific dist.
// Metro resolves @firebase/auth to this bundle via the "react-native" condition
// we set in metro.config.js.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getReactNativePersistence } = require('@firebase/auth/dist/rn/index.js');

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);

// Pass AsyncStorage as the persistence layer so Firebase Auth doesn't hit
// java.lang.String cannot be cast to java.lang.Boolean (caused by raw AsyncStorage
// reads returning strings that the default browser persistence mishandles in RN).
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e: any) {
  if (e?.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw e;
  }
}

export { auth };
export const isFirebaseConfigured = () => true;
