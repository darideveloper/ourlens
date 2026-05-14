import type { Hazard } from '@/lib/api/types';

interface HazardCardProps {
  name: string;
  riskLevel: 'Low' | 'High';
  recommendation: string;
}

export function HazardCard({ name, riskLevel, recommendation }: HazardCardProps) {
  return (
    <div
      className={`p-4 rounded-accessible border ${
        riskLevel === 'High'
          ? 'border-danger-500/50 bg-danger-50 contrast-more:border-2 contrast-more:border-danger-700'
          : 'border-on-surface-muted/20 bg-surface-alt'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-on-surface">{name}</h3>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold ${
            riskLevel === 'High'
              ? 'bg-danger-500 text-white'
              : 'bg-safe-500 text-white'
          }`}
        >
          {riskLevel}
        </span>
      </div>
      <p className="mt-2 text-base text-on-surface-muted leading-relaxed">
        {recommendation}
      </p>
    </div>
  );
}

interface SafetyReportProps {
  hazards: Hazard[];
  onScanAgain: () => void;
}

export function SafetyReport({ hazards, onScanAgain }: SafetyReportProps) {
  const highCount = hazards.filter((h) => h.riskLevel === 'High').length;
  const lowCount = hazards.filter((h) => h.riskLevel === 'Low').length;

  return (
    <div className="min-h-dvh px-4 py-8">
      <div className="max-w-lg mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-on-surface">Safety Report</h1>
          <p className="text-lg text-on-surface-muted">
            {hazards.length} {hazards.length === 1 ? 'hazard' : 'hazards'} found
          </p>
        </header>

        {highCount > 0 && (
          <div className="bg-danger-50 border border-danger-500/30 rounded-accessible p-4 text-center">
            <p className="text-lg font-semibold text-danger-600">
              {highCount} high {highCount === 1 ? 'risk' : 'risks'} need attention
            </p>
          </div>
        )}

        {lowCount > 0 && (
          <div className="bg-safe-50 border border-safe-500/30 rounded-accessible p-4 text-center">
            <p className="text-base text-safe-700">
              {lowCount} low {lowCount === 1 ? 'risk' : 'risks'} — monitor
            </p>
          </div>
        )}

        <div className="space-y-4">
          {hazards.map((hazard) => (
            <HazardCard
              key={hazard.name}
              name={hazard.name}
              riskLevel={hazard.riskLevel}
              recommendation={hazard.recommendation}
            />
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={onScanAgain}
            className="min-h-tap min-w-tap inline-flex items-center justify-center px-6 py-3 text-lg font-semibold bg-brand-500 text-white rounded-accessible hover:bg-brand-600 active:bg-brand-700 focus-visible:shadow-focus contrast-more:ring-2 contrast-more:ring-offset-2 transition-colors"
          >
            Scan Again
          </button>
        </div>
      </div>
    </div>
  );
}

export function EmptyReport({ onScanAgain }: { onScanAgain: () => void }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 text-center">
      <div className="text-safe-500 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-on-surface mb-2">No Hazards Detected</h1>
      <p className="text-lg text-on-surface-muted mb-8 max-w-sm">
        Your home looks safe based on our analysis. Keep up the good work!
      </p>
      <button
        type="button"
        onClick={onScanAgain}
        className="min-h-tap min-w-tap inline-flex items-center justify-center px-6 py-3 text-lg font-semibold bg-brand-500 text-white rounded-accessible hover:bg-brand-600 active:bg-brand-700 focus-visible:shadow-focus contrast-more:ring-2 contrast-more:ring-offset-2 transition-colors"
      >
        Scan Again
      </button>
    </div>
  );
}