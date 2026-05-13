interface SpinnerProps {
  size?: 'base' | 'lg';
  class?: string;
}

export function Spinner({ size = 'base', class: className = '' }: SpinnerProps) {
  const dims = size === 'lg' ? 'h-12 w-12' : 'h-8 w-8';
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <svg
        className={`animate-spin motion-reduce:animate-none text-brand-500 ${dims}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
  );
}
