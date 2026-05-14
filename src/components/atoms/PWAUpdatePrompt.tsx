import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label="Update available"
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface-alt border-t border-on-surface-muted/20 px-4 py-4"
    >
      <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
        <p className="text-base font-semibold text-on-surface">
          A new version is available.
        </p>
        <button
          type="button"
          onClick={() => updateServiceWorker(true)}
          className="min-h-tap min-w-tap inline-flex items-center justify-center px-6 py-3 text-base font-semibold bg-brand-500 text-white rounded-accessible hover:bg-brand-600 active:bg-brand-700 focus-visible:shadow-focus contrast-more:ring-2 contrast-more:ring-offset-2 transition-colors shrink-0"
        >
          Update Now
        </button>
      </div>
    </div>
  );
}
