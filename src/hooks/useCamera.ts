import { useEffect, useRef, useCallback } from 'react';
import { useCameraStore } from '@/stores/use-camera-store';
import {
  getRearCameraStream,
  classifyCameraError,
  stopStreamTracks,
  releaseVideoElement,
} from '@/lib/camera';

const TIMEOUT_MS = 10_000;

export function useCamera(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const status = useCameraStore((s) => s.status);
  const setStatus = useCameraStore((s) => s.setStatus);
  const setError = useCameraStore((s) => s.setError);
  const streamRef = useRef<MediaStream | null>(null);
  const startRequestedRef = useRef(false);
  const abortedRef = useRef(false);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const startCamera = useCallback(async () => {
    const video = videoRef.current;
    if (!video || startRequestedRef.current) return;

    startRequestedRef.current = true;
    abortedRef.current = false;

    setStatus('starting');
    setError(null);

    try {
      const stream = await Promise.race([
        getRearCameraStream(),
        new Promise<never>((_, reject) => {
          timeoutIdRef.current = setTimeout(
            () => reject(new DOMException('Timeout', 'TimeoutError')),
            TIMEOUT_MS,
          );
        }),
      ]);

      if (abortedRef.current) {
        stopStreamTracks(stream);
        return;
      }

      clearTimeout(timeoutIdRef.current);
      streamRef.current = stream;
      video.srcObject = stream;
      await video.play();
      setStatus('ready');
    } catch (err) {
      if (abortedRef.current) return;
      clearTimeout(timeoutIdRef.current);
      setError(classifyCameraError(err));
    } finally {
      startRequestedRef.current = false;
    }
  }, [videoRef, setStatus, setError]);

  useEffect(() => {
    if (status === 'idle' && !startRequestedRef.current) {
      startCamera();
    }
  }, [status, startCamera]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return;

      const stream = streamRef.current;
      const allLive = stream?.getTracks().every((t) => t.readyState === 'live');
      if (!allLive) {
        stopStreamTracks(stream);
        releaseVideoElement(videoRef.current);
        streamRef.current = null;
        startRequestedRef.current = false;
        startCamera();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      abortedRef.current = true;
      clearTimeout(timeoutIdRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
      stopStreamTracks(streamRef.current);
      releaseVideoElement(videoRef.current);
      streamRef.current = null;
    };
  }, [videoRef, startCamera]);

  return streamRef;
}