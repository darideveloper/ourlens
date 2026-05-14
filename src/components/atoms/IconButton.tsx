import { type ReactNode } from 'react';

interface IconButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: ReactNode;
}

export function IconButton({
  onClick,
  disabled = false,
  label,
  children,
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="min-h-tap min-w-tap inline-flex items-center justify-center rounded-full bg-surface-alt text-on-surface-muted hover:text-on-surface hover:bg-surface-alt/80 active:scale-95 focus-visible:shadow-focus contrast-more:border-2 contrast-more:border-on-surface disabled:opacity-50 transition-all"
    >
      {children}
    </button>
  );
}
