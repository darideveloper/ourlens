import { create } from 'zustand';

type CameraStatus =
  | 'idle'
  | 'starting'
  | 'ready'
  | 'recording'
  | 'capturing'
  | 'error';

interface FrameResult {
  base64: string;
  width: number;
  height: number;
}

interface CameraError {
  type: 'permission' | 'timeout' | 'unavailable' | 'unknown';
  message: string;
}

interface CameraState {
  status: CameraStatus;
  error: CameraError | null;
  frames: FrameResult[];
  setStatus: (status: CameraStatus) => void;
  setError: (error: CameraError | null) => void;
  pushFrame: (frame: FrameResult) => void;
  clearFrames: () => void;
  reset: () => void;
}

export const useCameraStore = create<CameraState>()((set) => ({
  status: 'idle',
  error: null,
  frames: [],

  setStatus: (status) => set({ status }),

  setError: (error) => set({ error, status: 'error' }),

  pushFrame: (frame) =>
    set((state) => ({ frames: [...state.frames, frame] })),

  clearFrames: () => set({ frames: [] }),

  reset: () =>
    set({ status: 'idle', error: null, frames: [] }),
}));
