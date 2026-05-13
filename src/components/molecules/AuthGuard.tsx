import { type ReactNode } from 'react';
import { navigate } from 'astro:transitions/client';
import { useHydratedSessionStore } from '@/stores/use-session-store';
import { Spinner } from '@/components/atoms/Spinner';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isValid } = useHydratedSessionStore();

  if (isValid === null) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isValid !== true) {
    navigate('/', { history: 'replace' });
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
