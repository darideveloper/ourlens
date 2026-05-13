import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { useEffect, useState } from 'react';
import { validateCode } from '@/lib/api/validate-code';

interface SessionState {
  code: string;
  isValidating: boolean;
  isValid: boolean | null;
  error: string | null;
  validateCodeAction: (code: string) => Promise<void>;
  reset: () => void;
}

export const useSessionStore = create<SessionState>()(
  devtools(
    persist(
      (set) => ({
        code: '',
        isValidating: false,
        isValid: null,
        error: null,
        validateCodeAction: async (code: string) => {
          set({ isValidating: true, error: null, code });
          try {
            const result = await validateCode(code);
            set({ isValid: result.valid, isValidating: false });
          } catch (err) {
            set({
              error: err instanceof Error ? err.message : 'Unknown error',
              isValidating: false,
            });
          }
        },
        reset: () =>
          set({ code: '', isValidating: false, isValid: null, error: null }),
      }),
      {
        name: 'ourlens-session',
        skipHydration: true,
        partialize: (state) => ({ code: state.code, isValid: state.isValid }),
        storage: createJSONStorage(() => localStorage),
      },
    ),
    { name: 'SessionStore', enabled: import.meta.env.DEV },
  ),
);

export function useHydratedSessionStore() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    useSessionStore.persist.rehydrate();
    const unsub = useSessionStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    if (useSessionStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  const store = useSessionStore();
  return hydrated ? store : { ...store, code: '', isValid: null };
}
