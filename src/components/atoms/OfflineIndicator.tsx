import { useState, useEffect } from 'react';

export default function OfflineIndicator() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);

    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="alert"
      className="fixed top-0 left-0 right-0 z-50 bg-danger-700 text-white text-base text-center py-2 px-4 animate-slide-down"
    >
      <div className="max-w-lg mx-auto flex items-center justify-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="shrink-0"
        >
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm1 3v2h-2V7h2zm0 4v6h-2v-6h2z" />
        </svg>
        <span>
          You are offline. Some features may be unavailable.
        </span>
      </div>
    </div>
  );
}
