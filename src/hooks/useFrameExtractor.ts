import { useRef, useCallback, useState } from 'react';
import { useCameraStore } from '@/stores/use-camera-store';
import { processFrame } from '@/lib/camera';

const RECORD_DURATION = 3_000;
const FRAME_INTERVAL = 750;

export function useFrameExtractor(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const { frames, setStatus, pushFrame, clearFrames } = useCameraStore();
  const [isRecording, setIsRecording] = useState(false);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number>(0);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    const result = processFrame(video, canvas);
    if (result) {
      pushFrame(result);
    }
    return result;
  }, [videoRef, canvasRef, pushFrame]);

  const startRecording = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || isRecording) return;

    clearFrames();
    setStatus('recording');
    setIsRecording(true);
    startedAtRef.current = performance.now();

    captureFrame();

    timerRef.current = setInterval(() => {
      const now = performance.now();
      if (now - startedAtRef.current >= RECORD_DURATION) {
        stopRecording();
        return;
      }

      rafRef.current = requestAnimationFrame(() => {
        captureFrame();
      });
    }, FRAME_INTERVAL);
  }, [videoRef, canvasRef, isRecording, clearFrames, setStatus, captureFrame]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsRecording(false);
    setStatus('ready');
  }, [setStatus]);

  const captureSingle = useCallback(() => {
    setStatus('capturing');
    captureFrame();
    setTimeout(() => setStatus('ready'), 300);
  }, [captureFrame, setStatus]);

  return {
    frames,
    isRecording,
    captureFrame: captureSingle,
    startRecording,
    stopRecording,
  };
}
