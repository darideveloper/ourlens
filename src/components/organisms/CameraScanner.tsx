import { useRef } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useFrameExtractor } from '@/hooks/useFrameExtractor';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useCameraStore } from '@/stores/use-camera-store';
import { useAnalysisStore } from '@/stores/use-analysis-store';
import { isInsecureContext } from '@/lib/camera';
import { CameraView } from '@/components/molecules/CameraView';
import { CameraControls } from '@/components/molecules/CameraControls';
import { ProcessingOverlay, ErrorOverlay } from '@/components/molecules/ProcessingOverlay';
import { Spinner } from '@/components/atoms/Spinner';

export function CameraScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { stopStream } = useCamera(videoRef);
  const { captureFrame, startRecording, isRecording, recordDuration, frames } = useFrameExtractor(
    videoRef,
    canvasRef,
  );
  const { status, error, reset } = useCameraStore();
  const analysisState = useAnalysisStore((s) => s.state);
  const analysisError = useAnalysisStore((s) => s.error);
  const { analyze, cancel } = useAnalysis();
  const insecure = isInsecureContext();

  const handleRetry = () => {
    cancel();
    stopStream();
    analyze();
  };

  const isAnalyzing = analysisState !== 'idle' && analysisState !== 'complete';

  return (
    <div className="relative flex flex-col flex-1 min-h-0 bg-surface-alt">
      <div className={status === 'ready' || status === 'recording' || status === 'capturing' ? '' : 'hidden'}>
        <CameraView videoRef={videoRef} />

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-alt/90 to-transparent pointer-events-none z-[5]" />
      </div>

      <canvas ref={canvasRef} width="1024" height="768" className="hidden" aria-hidden="true" />

      {status === 'ready' || status === 'capturing' || status === 'recording' ? (
        <CameraControls
          onCapture={captureFrame}
          onRecord={startRecording}
          isRecording={isRecording}
          disabled={status !== 'ready'}
          recordDuration={recordDuration}
        />
      ) : null}

      {status === 'ready' && frames.length > 0 && !isAnalyzing && (
        <div className="absolute bottom-24 left-0 right-0 flex justify-center z-10 px-4">
          <button
            type="button"
            onClick={() => { stopStream(); analyze(); }}
            className="min-h-tap min-w-tap w-full max-w-xs inline-flex items-center justify-center px-6 py-3 text-lg font-semibold bg-gradient-to-r from-brand-500 to-accent-500 text-white rounded-accessible hover:from-brand-600 hover:to-accent-600 active:from-brand-700 active:to-accent-700 focus-visible:shadow-focus contrast-more:ring-2 contrast-more:ring-offset-2 transition-[background] shadow-lg"
          >
            Analyze video
          </button>
        </div>
      )}

      {isAnalyzing && <ProcessingOverlay onCancel={cancel} />}
      {analysisState === 'error' && analysisError && (
        <ErrorOverlay message={analysisError} onRetry={handleRetry} />
      )}

      {status === 'recording' && (
        <div className="absolute top-16 left-0 right-0 flex justify-center z-10 pointer-events-none">
          <div className="bg-danger-500 text-white text-lg font-semibold px-4 py-2 rounded-accessible animate-pulse-slow" aria-hidden="true">
            Recording
          </div>
        </div>
      )}

      {status === 'capturing' && (
        <div className="absolute inset-0 bg-surface/80 z-20 pointer-events-none animate-flash" />
      )}

      {status === 'idle' || status === 'starting' ? (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Spinner size="lg" />
            <p className="text-base text-on-surface-muted">
              Starting camera…
            </p>
          </div>
        </div>
      ) : null}

      {status === 'error' && error ? (
        <div className="flex-1 min-h-0 flex items-center justify-center px-4" aria-live="assertive">
          <div className="max-w-sm text-center space-y-6" style={{ overscrollBehavior: 'contain' }}>
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
              className="min-h-tap min-w-tap inline-flex items-center justify-center px-6 py-3 text-lg font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-accessible hover:from-brand-600 hover:to-brand-700 active:from-brand-700 active:to-brand-800 focus-visible:shadow-focus contrast-more:ring-2 contrast-more:ring-offset-2 transition-[background]"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}