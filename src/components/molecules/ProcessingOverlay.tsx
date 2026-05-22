import { useAnalysisStore } from '@/stores/use-analysis-store';
import { Spinner } from '@/components/atoms/Spinner';

const STATUS_MESSAGES: Record<string, string> = {
  uploading: 'Uploading video…',
  analyzing: 'Analysing video…',
};

interface ProcessingOverlayProps {
  onCancel: () => void;
}

export function ProcessingOverlay({ onCancel }: ProcessingOverlayProps) {
  const { state, progress } = useAnalysisStore();
  const displayProgress = Math.round(progress);

  if (state === 'idle' || state === 'complete' || state === 'error') return null;

  const statusMessage = STATUS_MESSAGES[state] ?? 'Processing…';
  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-md"
      style={{ overscrollBehavior: 'contain' }}
      role="dialog"
      aria-modal="true"
      aria-label="Scanning in progress"
    >
      <div className="text-center space-y-6 max-w-sm px-4">
        <Spinner size="lg" />

        <div className="space-y-3" aria-live="polite">
          <p className="text-xl font-semibold text-on-surface">
            {statusMessage}
          </p>

          <div className="w-full bg-surface-alt rounded-full h-3 overflow-hidden">
            <div
              className={
                isReducedMotion
                  ? 'bg-gradient-to-r from-brand-500 to-accent-400 h-3 transition-none'
                  : 'bg-gradient-to-r from-brand-500 to-accent-400 h-3 animate-pulse-slow transition-[width] duration-150 ease-out'
              }
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={displayProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Analysis progress"
            />
          </div>

          <p className="text-sm text-on-surface-muted tabular-nums">
            {displayProgress}% complete
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="min-h-tap min-w-tap inline-flex items-center justify-center px-6 py-3 text-base font-semibold bg-surface-alt text-on-surface border border-on-surface-muted/30 rounded-accessible hover:bg-surface-alt/70 active:bg-surface-alt focus-visible:shadow-focus contrast-more:ring-2 contrast-more:ring-offset-2 transition-[background-color]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

interface ErrorOverlayProps {
  message: string;
  onRetry: () => void;
}

export function ErrorOverlay({ message, onRetry }: ErrorOverlayProps) {
  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-md px-4"
      style={{ overscrollBehavior: 'contain' }}
      role="alertdialog"
      aria-modal="true"
      aria-label="Analysis error"
    >
      <div className="text-center space-y-6 max-w-sm">
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
            className="mx-auto"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-on-surface">
            Analysis Failed
          </h2>
          <p className="text-base text-on-surface-muted" aria-live="assertive">{message}</p>
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="min-h-tap min-w-tap inline-flex items-center justify-center px-6 py-3 text-lg font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-accessible hover:from-brand-600 hover:to-brand-700 active:from-brand-700 active:to-brand-800 focus-visible:shadow-focus contrast-more:ring-2 contrast-more:ring-offset-2 transition-[background]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
