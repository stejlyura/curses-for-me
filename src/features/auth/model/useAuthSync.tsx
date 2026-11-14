'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ACTIVE_COURSE_EVENT,
} from '@/features/progress-tracker/model/active-course';
import {
  LEARNING_STATE_EVENT,
  applySnapshotToLocalStorage,
  clearAllLocalLearningState,
  isAuthCacheAllowed,
  isDirtyOffline,
  markAuthCacheEnabled,
  markDirtyOffline,
  readLocalSnapshot,
  readSessionToken,
  writeSessionToken,
} from '@/features/progress-tracker/model/learning-store';
import {
  LocalLearningSnapshot,
  mergeSnapshots,
} from '@/features/progress-tracker/model/learning-types';

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

interface AuthSyncContextValue {
  authStatus: AuthStatus;
  isAuthenticated: boolean;
  username: string | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthSyncContext = createContext<AuthSyncContextValue | null>(null);

export const AuthSyncProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('checking');
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const authStatusRef = useRef<AuthStatus>('checking');
  const authEpochRef = useRef(0);
  const sessionTokenRef = useRef<string | null>(null);
  const isApplyingRemoteRef = useRef(false);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedJsonRef = useRef<string>('');

  const updateAuthStatus = useCallback((next: AuthStatus, nextUser: string | null) => {
    authStatusRef.current = next;
    setAuthStatus(next);
    setUsername(nextUser);
  }, []);

  const buildAuthHeaders = useCallback(
    (extra?: Record<string, string>): Record<string, string> => {
      const token = sessionTokenRef.current ?? readSessionToken();
      if (token) {
        sessionTokenRef.current = token;
        return { ...(extra ?? {}), Authorization: `Bearer ${token}` };
      }
      return { ...(extra ?? {}) };
    },
    []
  );

  const pushStateToDb = useCallback(
    async (snapshot: LocalLearningSnapshot) => {
      if (authStatusRef.current !== 'authenticated') return;
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        markDirtyOffline(true);
        return;
      }

      const serialized = JSON.stringify(snapshot);
      if (serialized === lastSyncedJsonRef.current) {
        markDirtyOffline(false);
        return;
      }

      try {
        const res = await fetch('/api/state/', {
          method: 'PUT',
          credentials: 'same-origin',
          headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
          cache: 'no-store',
          body: JSON.stringify({ state: snapshot }),
        });

        if (res.status === 401) {
          sessionTokenRef.current = null;
          clearAllLocalLearningState();
          lastSyncedJsonRef.current = '';
          updateAuthStatus('unauthenticated', null);
          return;
        }

        if (res.ok) {
          lastSyncedJsonRef.current = serialized;
          markDirtyOffline(false);
        }
      } catch {
        markDirtyOffline(true);
      }
    },
    [buildAuthHeaders, updateAuthStatus]
  );

  const hydrateFromDb = useCallback(async (): Promise<'ok' | 'unauthorized' | 'error'> => {
    try {
      const res = await fetch('/api/state/', {
        method: 'GET',
        credentials: 'same-origin',
        headers: buildAuthHeaders(),
        cache: 'no-store',
      });

      if (res.status === 401) {
        sessionTokenRef.current = null;
        clearAllLocalLearningState();
        lastSyncedJsonRef.current = '';
        updateAuthStatus('unauthenticated', null);
        return 'unauthorized';
      }

      if (!res.ok) return 'error';

      const data = (await res.json()) as { state?: LocalLearningSnapshot | null };
      const remoteState = data.state ?? null;

      if (remoteState) {
        if (isDirtyOffline() && isAuthCacheAllowed()) {
          const localState = readLocalSnapshot();
          const merged = mergeSnapshots(localState, remoteState);
          isApplyingRemoteRef.current = true;
          try {
            applySnapshotToLocalStorage(merged);
          } finally {
            isApplyingRemoteRef.current = false;
          }
          await pushStateToDb(merged);
        } else {
          isApplyingRemoteRef.current = true;
          try {
            applySnapshotToLocalStorage(remoteState);
            lastSyncedJsonRef.current = JSON.stringify(remoteState);
            markDirtyOffline(false);
          } finally {
            isApplyingRemoteRef.current = false;
          }
        }
      } else if (isDirtyOffline() && isAuthCacheAllowed()) {
        const localState = readLocalSnapshot();
        await pushStateToDb(localState);
      }

      return 'ok';
    } catch {
      // Offline: retain cached authenticated state if already signed in
      return 'error';
    }
  }, [buildAuthHeaders, pushStateToDb, updateAuthStatus]);

  const verifySessionAndSync = useCallback(async () => {
    const epoch = authEpochRef.current;
    try {
      const res = await fetch('/api/auth/session/', {
        method: 'GET',
        credentials: 'same-origin',
        headers: buildAuthHeaders(),
        cache: 'no-store',
      });

      if (epoch !== authEpochRef.current) return;

      if (!res.ok) {
        throw new Error('Session check HTTP failure');
      }

      const data = (await res.json()) as { authenticated?: boolean; username?: string | null };
      if (epoch !== authEpochRef.current) return;

      if (data.authenticated && data.username) {
        markAuthCacheEnabled(true);
        updateAuthStatus('authenticated', data.username);
        await hydrateFromDb();
      } else {
        sessionTokenRef.current = null;
        clearAllLocalLearningState();
        lastSyncedJsonRef.current = '';
        updateAuthStatus('unauthenticated', null);
      }
    } catch {
      if (epoch !== authEpochRef.current) return;
      // Network error (offline PWA): allow previously authenticated device to use local cache offline
      if (isAuthCacheAllowed()) {
        updateAuthStatus('authenticated', 'admin');
      } else {
        sessionTokenRef.current = null;
        clearAllLocalLearningState();
        updateAuthStatus('unauthenticated', null);
      }
    }
  }, [buildAuthHeaders, hydrateFromDb, updateAuthStatus]);

  useEffect(() => {
    void verifySessionAndSync();
  }, [verifySessionAndSync]);

  useEffect(() => {
    const scheduleSync = () => {
      if (authStatusRef.current !== 'authenticated') return;
      if (isApplyingRemoteRef.current) return;

      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
      syncTimerRef.current = setTimeout(() => {
        syncTimerRef.current = null;
        void pushStateToDb(readLocalSnapshot());
      }, 350);
    };

    const handleOnline = () => {
      void verifySessionAndSync();
    };

    const handleVisibility = () => {
      if (
        document.visibilityState === 'hidden' &&
        authStatusRef.current === 'authenticated' &&
        isDirtyOffline()
      ) {
        if (syncTimerRef.current) {
          clearTimeout(syncTimerRef.current);
          syncTimerRef.current = null;
        }
        void pushStateToDb(readLocalSnapshot());
      }
    };

    window.addEventListener(LEARNING_STATE_EVENT, scheduleSync);
    window.addEventListener(ACTIVE_COURSE_EVENT, scheduleSync);
    window.addEventListener('online', handleOnline);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener(LEARNING_STATE_EVENT, scheduleSync);
      window.removeEventListener(ACTIVE_COURSE_EVENT, scheduleSync);
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
    };
  }, [pushStateToDb, verifySessionAndSync]);

  const login = useCallback(
    async (
      inputUser: string,
      inputPass: string
    ): Promise<{ ok: boolean; error?: string }> => {
      authEpochRef.current += 1;
      try {
        const res = await fetch('/api/auth/login/', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({ username: inputUser.trim(), password: inputPass }),
        });

        const payload = (await res.json()) as {
          authenticated?: boolean;
          username?: string;
          token?: string;
          error?: string;
        };

        if (!res.ok || !payload.authenticated) {
          return {
            ok: false,
            error: payload.error || 'Неверный логин или пароль.',
          };
        }

        clearAllLocalLearningState();
        markAuthCacheEnabled(true);
        const signedToken = typeof payload.token === 'string' ? payload.token : null;
        sessionTokenRef.current = signedToken;
        writeSessionToken(signedToken);

        updateAuthStatus('authenticated', payload.username || inputUser.trim());
        const hydrateStatus = await hydrateFromDb();
        if (hydrateStatus === 'unauthorized') {
          return {
            ok: false,
            error: 'Не удалось подтвердить сессию. Попробуйте ещё раз.',
          };
        }

        setIsAuthModalOpen(false);
        return { ok: true };
      } catch {
        return {
          ok: false,
          error: 'Нет соединения с сервером. Проверьте интернет.',
        };
      }
    },
    [hydrateFromDb, updateAuthStatus]
  );

  const logout = useCallback(async () => {
    authEpochRef.current += 1;
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
      syncTimerRef.current = null;
    }

    try {
      await fetch('/api/auth/logout/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: buildAuthHeaders(),
        cache: 'no-store',
      });
    } catch {
      // Clear local state regardless of network failure
    }

    sessionTokenRef.current = null;
    lastSyncedJsonRef.current = '';
    clearAllLocalLearningState();
    updateAuthStatus('unauthenticated', null);
  }, [buildAuthHeaders, updateAuthStatus]);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  return (
    <AuthSyncContext.Provider
      value={{
        authStatus,
        isAuthenticated: authStatus === 'authenticated',
        username,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
      }}
    >
      {children}
    </AuthSyncContext.Provider>
  );
};

export const useOptionalAuthSync = (): AuthSyncContextValue | null =>
  useContext(AuthSyncContext);

export const useAuthSync = (): AuthSyncContextValue => {
  const ctx = useContext(AuthSyncContext);
  if (!ctx) {
    throw new Error('useAuthSync must be used inside AuthSyncProvider');
  }
  return ctx;
};
