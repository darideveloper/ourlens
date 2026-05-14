import { useRef } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useFrameExtractor } from '@/hooks/useFrameExtractor';
import { useCameraStore } from '@/stores/use-camera-store';
import { isInsecureContext } from '@/lib/camera';
import { CameraView } from '@/components/molecules/CameraView';
import { CameraControls } from '@/components/molecules/CameraControls';
import { Spinner } from '@/components/atoms/Spinner';

export function CameraScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useCamera(videoRef);
  const { captureFrame, startRecording, isRecording } = useFrameExtractor(
    videoRef,
    canvasRef,
  );
  const { status, error, reset } = useCameraStore();
  const insecure = isInsecureContext();

  return (
    <div className="absolute inset-0 bg-surface-alt">
      <div className={status === 'ready' || status === 'recording' || status === 'capturing' ? '' : 'hidden'}>
        <CameraView videoRef={videoRef} />
      </div>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {status === 'ready' || status === 'capturing' || status === 'recording' ? (
        <CameraControls
          onCapture={captureFrame}
          onRecord={startRecording}
          isRecording={isRecording}
          disabled={status !== 'ready'}
        />
      ) : null}

      {status === 'recording' && (
        <div className="absolute top-4 left-0 right-0 flex justify-center z-10 pointer-events-none">
          <div className="bg-danger-500 text-white text-lg font-semibold px-4 py-2 rounded-accessible animate-pulse-slow">
            Recording
          </div>
        </div>
      )}

      {status === 'capturing' && (
        <div className="absolute inset-0 bg-white/80 z-20 pointer-events-none animate-flash" />
      )}

      {status === 'idle' || status === 'starting' ? (
        <div className="min-h-dvh flex items-center justify-center">
          <div className="text-center space-y-4">
            <Spinner size="lg" />
            <p className="text-base text-on-surface-muted">
              Starting camera...
            </p>
          </div>
        </div>
      ) : null}

      {status === 'error' && error ? (
        <div className="min-h-dvh flex items-center justify-center px-4">
          <div className="max-w-sm text-center space-y-6">
            <div className="text-danger-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="mx-auto mb-4"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-on-surface">
              Camera {error.type === 'permission' ? 'Not Available' : 'Error'}
            </h2>
            <p className="text-base text-on-surface-muted">{error.message}</p>
            {insecure && (
              <p className="text-sm text-on-surface-muted">
                This app requires HTTPS to access the camera. If you are testing
                locally, use <code className="bg-surface-alt px-1 rounded">localhost</code> instead of an IP address.
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                reset();
              }}
              className="min-h-tap min-w-tap inline-flex items-center justify-center px-6 py-3 text-lg font-semibold bg-brand-500 text-white rounded-accessible hover:bg-brand-600 active:bg-brand-700 focus-visible:shadow-focus contrast-more:ring-2 contrast-more:ring-offset-2 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
