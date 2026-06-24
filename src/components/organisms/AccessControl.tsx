import { CodeForm } from '@/components/molecules/CodeForm';

export default function AccessControl() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-brand-50 to-surface">
      <div className="w-full max-w-sm text-center mb-10 landscape:mb-4 animate-fade-in">
        <img
          src="/ourlens-logo.png"
          alt="Ourlens"
          width="96"
          height="96"
          className="mx-auto mb-6 rounded-full landscape:hidden"
        />
        <h1 className="text-3xl font-bold text-on-surface mb-3">
          Welcome to Ourlens
        </h1>
        <p className="text-lg text-on-surface-muted">
          AI-powered safety scanner for peace of mind.
        </p>
      </div>
      <CodeForm />
    </div>
  );
}