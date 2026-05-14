import { useState, useEffect } from 'react';

const DISMISS_KEY = 'ourlens-ios-banner-dismissed';

function isIOSPwa(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !('standalone' in navigator && (navigator as Record<string, unknown>).standalone === true)
  );
}

export default function IosInstallBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isIOSPwa()) return;
    if (localStorage.getItem(DISMISS_KEY) === 'true') return;
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Install app"
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface-alt border-t border-on-surface-muted/20 px-4 py-4"
    >
      <div className="max-w-lg mx-auto flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-on-surface mb-1">
            Add Ourlens to your Home Screen
          </p>
          <p className="text-base text-on-surface-muted">
            Tap the Share button{' '}
            <span aria-label="Share icon" className="inline-flex align-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="inline"
              >
                <path d="M18 16.1c-.8 0-1.4.3-2 .8L8.9 12.3c0-.1.1-.2.1-.3s0-.2-.1-.3l7-4.6c.6.5 1.3.8 2 .8a3 3 0 1 0-3-3c0 .1 0 .2.1.3L8.1 10.2c-.6-.5-1.2-.7-1.9-.7A3 3 0 1 0 9 12c0-.1 0-.2-.1-.3l7.1 4.6c-.1.1-.1.3-.1.4a2.1 2.1 0 1 0 2.1-2.1z" />
              </svg>
            </span>{' '}
            and select &ldquo;Add to Home Screen&rdquo;
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, 'true');
            setVisible(false);
          }}
          className="min-h-tap min-w-tap flex items-center justify-center text-on-surface-muted hover:text-on-surface focus-visible:shadow-focus rounded-accessible shrink-0"
          aria-label="Dismiss"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M6.7 6.7a1 1 0 0 1 1.4 0L12 10.6l3.9-3.9a1 1 0 1 1 1.4 1.4L13.4 12l3.9 3.9a1 1 0 0 1-1.4 1.4L12 13.4l-3.9 3.9a1 1 0 0 1-1.4-1.4L10.6 12 6.7 8.1a1 1 0 0 1 0-1.4z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
