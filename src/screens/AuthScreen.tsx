import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../store/authStore';
import {
  useGoogleAuthRequest,
  useFacebookAuthRequest,
  useTwitterAuthRequest,
  signInWithGoogleToken,
  signInWithFacebookToken,
  signInWithTwitterToken,
  signUpWithEmail,
  signInWithEmail,
  resetPassword,
  AUTH_CONFIG,
} from '../firebase/authProviders';
import { Fonts, Spacing, BorderRadius, ColorTheme } from '../theme';
import { useTheme } from '../theme/ThemeContext';

type AuthMode = 'landing' | 'email-login' | 'email-register' | 'forgot-password';

function makeStyles(colors: ColorTheme) {
  return StyleSheet.create({
    flex: { flex: 1 },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.lg,
      gap: Spacing.md,
    },
    titleRow: { flexDirection: 'row', alignItems: 'baseline' },
    titleHira: { color: colors.text, fontSize: Fonts.sizes.xxl, fontWeight: '900', letterSpacing: 1 },
    titleGame: { color: '#3B82F6', fontSize: Fonts.sizes.xxl, fontWeight: '900', letterSpacing: 1 },
    tagline: { color: colors.textSecondary, fontSize: Fonts.sizes.sm, textAlign: 'center' },
    divider: { height: 1, width: '100%', backgroundColor: colors.border, marginVertical: Spacing.sm },
    socialBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      width: '100%',
      borderRadius: BorderRadius.md,
      borderWidth: 1.5,
      padding: Spacing.md,
      backgroundColor: colors.surface,
    },
    socialEmoji: { fontSize: 20 },
    socialLabel: { color: colors.text, fontSize: Fonts.sizes.md, fontWeight: '600', flex: 1 },
    orRow: { flexDirection: 'row', alignItems: 'center', width: '100%', gap: Spacing.sm },
    orLine: { flex: 1, height: 1, backgroundColor: colors.border },
    orText: { color: colors.textMuted, fontSize: Fonts.sizes.sm },
    emailBtn: {
      width: '100%',
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: colors.primary,
      padding: Spacing.md,
      alignItems: 'center',
    },
    emailBtnText: { color: colors.primary, fontWeight: '700', fontSize: Fonts.sizes.md },
    registerLink: { color: colors.textSecondary, fontSize: Fonts.sizes.sm },
    errorText: {
      color: colors.error,
      fontSize: Fonts.sizes.sm,
      textAlign: 'center',
      backgroundColor: colors.error + '22',
      borderRadius: BorderRadius.sm,
      padding: Spacing.sm,
      width: '100%',
    },
    successText: {
      color: colors.success,
      fontSize: Fonts.sizes.sm,
      textAlign: 'center',
      padding: Spacing.sm,
    },
    formContainer: {
      padding: Spacing.lg,
      gap: Spacing.md,
      paddingTop: Spacing.xl,
    },
    backLink: { color: colors.textSecondary, fontSize: Fonts.sizes.md, marginBottom: Spacing.sm },
    formTitle: { color: colors.text, fontSize: Fonts.sizes.xl, fontWeight: '800' },
    formSubtitle: { color: colors.textSecondary, fontSize: Fonts.sizes.md },
    inputGroup: { gap: Spacing.xs },
    inputLabel: { color: colors.textSecondary, fontSize: Fonts.sizes.sm, fontWeight: '600' },
    input: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      fontSize: Fonts.sizes.md,
      padding: Spacing.md,
    },
    forgotLink: { alignSelf: 'flex-end' },
    forgotLinkText: { color: colors.primary, fontSize: Fonts.sizes.sm },
    submitBtn: { borderRadius: BorderRadius.md, overflow: 'hidden', marginTop: Spacing.sm },
    submitBtnGrad: { padding: Spacing.md, alignItems: 'center' },
    submitBtnText: { color: '#FFFFFF', fontSize: Fonts.sizes.lg, fontWeight: '800' },
    switchLink: { color: colors.textSecondary, fontSize: Fonts.sizes.sm, textAlign: 'center' },
  });
}

export default function AuthScreen() {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { setUser, setError, error } = useAuthStore();
  const [mode, setMode] = useState<AuthMode>('landing');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const google = useGoogleAuthRequest();
  const facebook = useFacebookAuthRequest();
  const twitter = useTwitterAuthRequest();

  const isConfigured = (key: string) => !key.startsWith('YOUR_');

  useEffect(() => {
    if (google.response?.type === 'success') {
      const idToken = (google.response.params as any).id_token;
      if (idToken) {
        setLoading(true);
        signInWithGoogleToken(idToken)
          .then(setUser)
          .catch(e => setError(e.message))
          .finally(() => setLoading(false));
      }
    }
  }, [google.response]);

  useEffect(() => {
    if (facebook.response?.type === 'success') {
      const token = (facebook.response.params as any).access_token;
      if (token) {
        setLoading(true);
        signInWithFacebookToken(token)
          .then(setUser)
          .catch(e => setError(e.message))
          .finally(() => setLoading(false));
      }
    }
  }, [facebook.response]);

  useEffect(() => {
    if (twitter.response?.type === 'success') {
      const token = (twitter.response.params as any).access_token;
      if (token) {
        setLoading(true);
        signInWithTwitterToken(token)
          .then(setUser)
          .catch(e => setError(e.message))
          .finally(() => setLoading(false));
      }
    }
  }, [twitter.response]);

  const handleEmailAuth = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError(null);
    try {
      if (mode === 'email-register') {
        if (!displayName) { setError('Please enter a display name.'); setLoading(false); return; }
        const user = await signUpWithEmail(email, password, displayName);
        setUser(user);
      } else {
        const user = await signInWithEmail(email, password);
        setUser(user);
      }
    } catch (e: any) {
      setError(friendlyAuthError(e.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) { setError('Enter your email address first.'); return; }
    setLoading(true);
    setError(null);
    try {
      await resetPassword(email);
      setSuccessMsg('Password reset email sent! Check your inbox.');
      setMode('email-login');
    } catch (e: any) {
      setError(friendlyAuthError(e.code));
    } finally {
      setLoading(false);
    }
  };

  const gradientTop = isDark ? '#060D1F' : '#EDE9FF';

  // ── Landing screen ──────────────────────────────────────────────────────────
  if (mode === 'landing') {
    return (
      <LinearGradient colors={[gradientTop, colors.background]} style={styles.flex}>
        <SafeAreaView style={styles.center}>
          <View style={styles.titleRow}>
            <Text style={styles.titleHira}>Hira</Text>
            <Text style={styles.titleGame}>game</Text>
          </View>
          <Text style={styles.tagline}>Master Japanese kana through games and spaced repetition.</Text>

          <View style={styles.divider} />

          {isConfigured(AUTH_CONFIG.GOOGLE_CLIENT_ID) && (
            <SocialButton
              emoji="🔵"
              label="Continue with Google"
              color="#4285F4"
              onPress={() => google.promptAsync({})}
              disabled={!google.request || loading}
              styles={styles}
            />
          )}
          {isConfigured(AUTH_CONFIG.FACEBOOK_APP_ID) && (
            <SocialButton
              emoji="📘"
              label="Continue with Facebook"
              color="#1877F2"
              onPress={() => facebook.promptAsync({})}
              disabled={!facebook.request || loading}
              styles={styles}
            />
          )}
          {isConfigured(AUTH_CONFIG.TWITTER_CLIENT_ID) && (
            <SocialButton
              emoji="🐦"
              label="Continue with X / Twitter"
              color="#000000"
              onPress={() => twitter.promptAsync({})}
              disabled={!twitter.request || loading}
              styles={styles}
            />
          )}

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.orLine} />
          </View>

          <TouchableOpacity
            style={styles.emailBtn}
            onPress={() => setMode('email-login')}
            activeOpacity={0.8}
          >
            <Text style={styles.emailBtnText}>Sign in with Email</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode('email-register')}>
            <Text style={styles.registerLink}>New here? Create an account</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: Spacing.md }} />}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // ── Email auth forms ────────────────────────────────────────────────────────
  const isRegister = mode === 'email-register';
  const isForgot = mode === 'forgot-password';

  return (
    <LinearGradient colors={[gradientTop, colors.background]} style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView style={styles.flex}>
          <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
            <TouchableOpacity onPress={() => { setMode('landing'); setError(null); setSuccessMsg(''); }}>
              <Text style={styles.backLink}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.formTitle}>
              {isForgot ? 'Reset Password' : isRegister ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text style={styles.formSubtitle}>
              {isForgot
                ? "We'll send a reset link to your email"
                : isRegister
                ? 'Start your Japanese learning journey'
                : 'Sign in to continue your streak'}
            </Text>

            {successMsg ? <Text style={styles.successText}>{successMsg}</Text> : null}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {isRegister && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Display Name</Text>
                <TextInput
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="e.g. KanaKing"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {!isForgot && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={isRegister ? 'At least 6 characters' : '••••••••'}
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
              </View>
            )}

            {!isRegister && !isForgot && (
              <TouchableOpacity
                onPress={() => { setMode('forgot-password'); setError(null); }}
                style={styles.forgotLink}
              >
                <Text style={styles.forgotLinkText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={isForgot ? handleForgotPassword : handleEmailAuth}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.submitBtnGrad}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.submitBtnText}>
                      {isForgot ? 'Send Reset Link' : isRegister ? 'Create Account' : 'Sign In'}
                    </Text>
                }
              </LinearGradient>
            </TouchableOpacity>

            {!isForgot && (
              <TouchableOpacity
                onPress={() => { setMode(isRegister ? 'email-login' : 'email-register'); setError(null); }}
              >
                <Text style={styles.switchLink}>
                  {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function SocialButton({
  emoji, label, color, onPress, disabled, styles,
}: {
  emoji: string;
  label: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <TouchableOpacity
      style={[styles.socialBtn, { borderColor: color, opacity: disabled ? 0.5 : 1 }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.socialEmoji}>{emoji}</Text>
      <Text style={styles.socialLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function friendlyAuthError(code: string): string {
  const map: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  };
  return map[code] ?? 'Something went wrong. Please try again.';
}
