import { useState, type FormEvent } from 'react';
import { navigate } from 'astro:transitions/client';
import { useHydratedSessionStore, useSessionStore } from '@/stores/use-session-store';
import { Spinner } from '@/components/atoms/Spinner';

export function CodeForm() {
  const { code, isValidating, isValid, error, validateCodeAction } =
    useHydratedSessionStore();
  const [inputValue, setInputValue] = useState(code || '');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isValidating) return;
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    await validateCodeAction(trimmed);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (error) {
      useSessionStore.setState({ error: null });
    }
  };

  if (isValid) {
    navigate('/instructions', { history: 'replace' });
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
      <div>
        <label
          htmlFor="invite-code"
          className="block text-base text-on-surface-muted mb-2"
        >
          Enter your invitation code
        </label>
        <input
          id="invite-code"
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          disabled={isValidating}
          className="h-tap w-full px-4 text-base text-on-surface bg-surface-alt border border-on-surface-muted/30 rounded-accessible focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent contrast-more:border-on-surface disabled:opacity-50"
          placeholder="Your code…"
          aria-describedby={error ? 'code-error' : undefined}
        />
      </div>

      {error && (
        <p id="code-error" className="text-danger-700 text-base" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isValidating || !inputValue.trim()}
        className="min-h-tap min-w-tap w-full inline-flex items-center justify-center px-6 py-3 text-lg font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-accessible hover:from-brand-600 hover:to-brand-700 active:from-brand-700 active:to-brand-800 focus-visible:shadow-focus contrast-more:ring-2 contrast-more:ring-offset-2 disabled:opacity-50 transition-[background]"
      >
        {isValidating ? (
          <Spinner size="base" />
        ) : (
          'Verify Code'
        )}
      </button>
    </form>
  );
}
