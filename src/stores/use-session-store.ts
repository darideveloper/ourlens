import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { useEffect, useState } from 'react';
import { validateCode } from '@/lib/api/validate-code';

interface SessionState {
  code: string;
  isValidating: boolean;
  isValid: boolean | null;
  termsAccepted: boolean;
  error: string | null;
  validateCodeAction: (code: string) => Promise<void>;
  setTermsAccepted: (accepted: boolean) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>()(
  devtools(
    persist(
      (set) => ({
        code: '',
        isValidating: false,
        isValid: null,
        termsAccepted: false,
        error: null,
        validateCodeAction: async (code: string) => {
          set({ isValidating: true, error: null, code });
          try {
            const result = await validateCode(code);
            if (result.valid) {
              set({ isValid: true, isValidating: false });
            } else {
              set({
                isValid: false,
                isValidating: false,
                error: 'That invitation code is not recognised or expired. Please check and try again.',
              });
            }
          } catch (err) {
            set({
              isValid: false,
              error: err instanceof Error ? err.message : 'Unknown error',
              isValidating: false,
            });
          }
        },
        setTermsAccepted: (accepted: boolean) => set({ termsAccepted: accepted }),
        reset: () =>
          set({ code: '', isValidating: false, isValid: null, termsAccepted: false, error: null }),
      }),
      {
        name: 'ourlens-session',
        skipHydration: true,
        partialize: (state) => ({ code: state.code, isValid: state.isValid, termsAccepted: state.termsAccepted }),
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
    const unsub = useSessionStore.persist.onFinishHydration(() => {
      const state = useSessionStore.getState();
      if (state.isValid === null) {
        useSessionStore.setState({ isValid: false });
      }
      if (!state.termsAccepted) {
        useSessionStore.setState({ termsAccepted: false });
      }
      setHydrated(true);
    });
    if (useSessionStore.persist.hasHydrated()) {
      const state = useSessionStore.getState();
      if (state.isValid === null) {
        useSessionStore.setState({ isValid: false });
      }
      if (!state.termsAccepted) {
        useSessionStore.setState({ termsAccepted: false });
      }
      setHydrated(true);
    }
    return unsub;
  }, []);
  const store = useSessionStore();
  return hydrated ? store : { ...store, code: '', isValid: null };
}
