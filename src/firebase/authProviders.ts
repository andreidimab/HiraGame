/**
 * Firebase Auth helpers for all four providers.
 *
 * SETUP REQUIRED — before any provider works, you must:
 *
 * 1. Firebase Console → Authentication → Sign-in methods → enable each provider
 *
 * 2. Google
 *    - Firebase Console → Authentication → Google → enable
 *    - Add your Expo redirect URI to the OAuth consent screen in Google Cloud Console:
 *      https://auth.expo.io/@your-expo-username/KanaQuest
 *    - Set GOOGLE_CLIENT_ID below (Web client ID from Google Cloud → Credentials)
 *
 * 3. Facebook
 *    - Create an app at https://developers.facebook.com
 *    - Enable Facebook Login product, add OAuth redirect URI:
 *      https://auth.expo.io/@your-expo-username/KanaQuest
 *    - Set FACEBOOK_APP_ID below
 *
 * 4. Twitter / X
 *    - Create an app at https://developer.twitter.com
 *    - Enable OAuth 2.0, set callback URL:
 *      https://auth.expo.io/@your-expo-username/KanaQuest
 *    - Set TWITTER_CLIENT_ID below (OAuth 2.0 Client ID)
 *
 * 5. Email/Password — just enable in Firebase Console, no extra config needed.
 */

import {
  signInWithCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { auth } from './config';

// ── Social provider client IDs ────────────────────────────────────────────────
export const AUTH_CONFIG = {
  GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com',
  FACEBOOK_APP_ID: 'YOUR_FACEBOOK_APP_ID',
  TWITTER_CLIENT_ID: 'YOUR_TWITTER_OAUTH2_CLIENT_ID',
};

export const REDIRECT_URI = AuthSession.makeRedirectUri();

export { auth };

WebBrowser.maybeCompleteAuthSession();

// ── Google ────────────────────────────────────────────────────────────────────
export function useGoogleAuthRequest() {
  const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AUTH_CONFIG.GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: REDIRECT_URI,
    },
    discovery
  );
  return { request, response, promptAsync };
}

export async function signInWithGoogleToken(idToken: string): Promise<User> {
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  return result.user;
}

// ── Facebook ──────────────────────────────────────────────────────────────────
export function useFacebookAuthRequest() {
  const discovery: AuthSession.DiscoveryDocument = {
    authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token',
  };
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AUTH_CONFIG.FACEBOOK_APP_ID,
      scopes: ['public_profile', 'email'],
      redirectUri: REDIRECT_URI,
    },
    discovery
  );
  return { request, response, promptAsync };
}

export async function signInWithFacebookToken(accessToken: string): Promise<User> {
  const credential = FacebookAuthProvider.credential(accessToken);
  const result = await signInWithCredential(auth, credential);
  return result.user;
}

// ── Twitter / X ───────────────────────────────────────────────────────────────
export function useTwitterAuthRequest() {
  const discovery: AuthSession.DiscoveryDocument = {
    authorizationEndpoint: 'https://twitter.com/i/oauth2/authorize',
    tokenEndpoint: 'https://api.twitter.com/2/oauth2/token',
  };
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AUTH_CONFIG.TWITTER_CLIENT_ID,
      scopes: ['tweet.read', 'users.read', 'offline.access'],
      redirectUri: REDIRECT_URI,
      usePKCE: true,
    },
    discovery
  );
  return { request, response, promptAsync };
}

export async function signInWithTwitterToken(accessToken: string): Promise<User> {
  const provider = new OAuthProvider('twitter.com');
  const credential = provider.credential({ accessToken });
  const result = await signInWithCredential(auth, credential);
  return result.user;
}

// ── Email / Password ──────────────────────────────────────────────────────────
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  return result.user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// ── Sign out ──────────────────────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// ── Auth state listener ───────────────────────────────────────────────────────
export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
