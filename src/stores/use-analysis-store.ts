import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type AnalysisState = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';

interface AnalysisStore {
  state: AnalysisState;
  progress: number;
  error: string | null;
  startAnalysis: () => void;
  setProgress: (progress: number) => void;
  completeAnalysis: () => void;
  setError: (message: string) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisStore>()(
  devtools(
    (set) => ({
      state: 'idle',
      progress: 0,
      error: null,
      startAnalysis: () => set({ state: 'uploading', progress: 0, error: null }),
      setProgress: (progress) => set({ progress: Math.min(progress, 90) }),
      completeAnalysis: () => set({ state: 'complete', progress: 100 }),
      setError: (message) => set({ state: 'error', error: message }),
      reset: () => set({ state: 'idle', progress: 0, error: null }),
    }),
    { name: 'AnalysisStore', enabled: import.meta.env.DEV },
  ),
);