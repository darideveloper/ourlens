import { useCallback, useRef } from 'react';
import { useAnalysisStore } from '@/stores/use-analysis-store';
import { useCameraStore } from '@/stores/use-camera-store';
import { useScanStore } from '@/stores/use-scan-store';
import { useSessionStore } from '@/stores/use-session-store';
import { submitFrames } from '@/lib/api/analyze-frames';
import { navigate } from 'astro:transitions/client';

export function useAnalysis() {
  const abortRef = useRef<AbortController | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { startAnalysis, setProgress, completeAnalysis, setError, reset } =
    useAnalysisStore();
  const frames = useCameraStore((s) => s.frames);
  const clearFrames = useCameraStore((s) => s.clearFrames);
  const code = useSessionStore((s) => s.code);
  const setCurrentScan = useScanStore((s) => s.setCurrentScan);

  const clearProgress = useCallback(() => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  }, []);

  const stopSimulation = useCallback(() => {
    clearProgress();
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, [clearProgress]);

  const analyze = useCallback(async () => {
    if (useAnalysisStore.getState().state !== 'idle') return;
    if (frames.length === 0) {
      setError('No frames captured. Please capture some photos first.');
      return;
    }

    startAnalysis();
    abortRef.current = new AbortController();

    progressRef.current = setInterval(() => {
      const current = useAnalysisStore.getState();
      if (current.state === 'uploading' && current.progress < 15) {
        setProgress(Math.min(current.progress + 5, 15));
      } else if (current.state === 'analyzing' && current.progress < 90) {
        setProgress(Math.min(current.progress + 3, 90));
      }
    }, 150);

    useAnalysisStore.setState({ state: 'analyzing' });

    try {
      const images = frames.map((f) => f.base64);
      const report = await submitFrames(code, images, abortRef.current?.signal);
      clearProgress();
      completeAnalysis();
      setCurrentScan(report.hazards);
      clearFrames();
      navigate('/report');
    } catch (err) {
      clearProgress();
      if ((err as Error).name === 'AbortError' || (err as DOMException)?.name === 'AbortError') {
        reset();
        return;
      }
      const message =
        err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(message);
    } finally {
      abortRef.current = null;
    }
  }, [frames, code, startAnalysis, setProgress, completeAnalysis, setError, reset, clearProgress, setCurrentScan, clearFrames]);

  const cancel = useCallback(() => {
    stopSimulation();
    reset();
  }, [stopSimulation, reset]);

  return { analyze, cancel };
}