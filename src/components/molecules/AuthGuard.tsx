import { type ReactNode } from 'react';
import { navigate } from 'astro:transitions/client';
import { useHydratedSessionStore } from '@/stores/use-session-store';

function Skeleton() {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 shimmer-bg rounded-full" />
        </div>
        <div className="h-8 shimmer-bg rounded w-3/4 mx-auto" />
        <div className="h-4 shimmer-bg rounded w-1/2 mx-auto" />
        <div className="space-y-3">
          <div className="h-12 shimmer-bg rounded" />
          <div className="h-12 shimmer-bg rounded" />
        </div>
      </div>
    </div>
  );
}

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isValid } = useHydratedSessionStore();

  if (isValid === null) {
    return <Skeleton />;
  }

  if (isValid !== true) {
    navigate('/', { history: 'replace' });
    return <Skeleton />;
  }

  return <div className="flex-1 min-h-0 flex flex-col">{children}</div>;
}
