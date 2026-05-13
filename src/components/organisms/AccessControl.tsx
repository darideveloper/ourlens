import { CodeForm } from '@/components/molecules/CodeForm';

export default function AccessControl() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm text-center mb-10">
        <h1 className="text-3xl font-bold text-on-surface mb-3">
          Welcome to Ourlens
        </h1>
        <p className="text-lg text-on-surface-muted">
          AI-powered home safety scanner for peace of mind.
        </p>
      </div>
      <CodeForm />
    </div>
  );
}
