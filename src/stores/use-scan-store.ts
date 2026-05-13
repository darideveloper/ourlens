import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { useEffect, useState } from 'react';
import type { Hazard } from '@/lib/api/types';

const MAX_HISTORY = 10;

export interface ScanEntry {
  timestamp: number;
  hazards: Hazard[];
}

interface ScanState {
  currentScan: ScanEntry | null;
  scanHistory: ScanEntry[];
  setCurrentScan: (hazards: Hazard[]) => void;
  clearCurrentScan: () => void;
}

export const useScanStore = create<ScanState>()(
  devtools(
    persist(
      (set) => ({
        currentScan: null,
        scanHistory: [],
        setCurrentScan: (hazards: Hazard[]) => {
          const entry: ScanEntry = { timestamp: Date.now(), hazards };
          set((state) => ({
            currentScan: entry,
            scanHistory: [entry, ...state.scanHistory].slice(0, MAX_HISTORY),
          }));
        },
        clearCurrentScan: () => set({ currentScan: null }),
      }),
      {
        name: 'ourlens-scans',
        version: 1,
        skipHydration: true,
        partialize: (state) => ({
          scanHistory: state.scanHistory.slice(0, MAX_HISTORY),
        }),
        migrate: (persisted) => {
          const data = persisted as Record<string, unknown>;
          if (!Array.isArray(data.scanHistory)) {
            return { scanHistory: [] };
          }
          return {
            scanHistory: (data.scanHistory as ScanEntry[]).slice(0, MAX_HISTORY),
          };
        },
        storage: createJSONStorage(() => localStorage),
      },
    ),
    { name: 'ScanStore', enabled: import.meta.env.DEV },
  ),
);

export function useHydratedScanStore() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    useScanStore.persist.rehydrate();
    const unsub = useScanStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    if (useScanStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  const store = useScanStore();
  return hydrated
    ? store
    : { ...store, currentScan: null, scanHistory: [] };
}
