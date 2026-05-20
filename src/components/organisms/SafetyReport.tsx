import type { Hazard } from '@/lib/api/types';
import { HazardCard } from '@/components/atoms/HazardCard';

interface SafetyReportProps {
  hazards: Hazard[];
  onScanAgain: () => void;
}

export function SafetyReport({ hazards, onScanAgain }: SafetyReportProps) {
  const highCount = hazards.filter((h) => h.riskLevel === 'High').length;
  const mediumCount = hazards.filter((h) => h.riskLevel === 'Medium').length;
  const lowCount = hazards.filter((h) => h.riskLevel === 'Low').length;

  return (
    <div className="min-h-dvh px-4 py-8">
      <div className="max-w-lg mx-auto space-y-8">
        <header className="text-center space-y-2 animate-fade-in">
          <img
            src="/ourlens-logo.png"
            alt="Ourlens"
            width="40"
            height="40"
            className="mx-auto mb-2 rounded-full"
          />
          <h1 className="text-3xl font-bold text-on-surface">Safety Report</h1>
          <p className="text-lg text-on-surface-muted">
            <span className="tabular-nums">{hazards.length}</span> {hazards.length === 1 ? 'hazard' : 'hazards'} found
          </p>
        </header>

        {highCount > 0 && (
          <div className="bg-danger-50 border border-danger-500/30 rounded-accessible p-4 text-center">
            <p className="text-lg font-semibold text-danger-600">
              <span className="tabular-nums">{highCount}</span> high {highCount === 1 ? 'risk' : 'risks'} need attention
            </p>
          </div>
        )}

        {mediumCount > 0 && (
          <div className="bg-warning-50 border border-warning-500/30 rounded-accessible p-4 text-center">
            <p className="text-lg font-semibold text-warning-700">
              <span className="tabular-nums">{mediumCount}</span> medium {mediumCount === 1 ? 'risk' : 'risks'} — evaluate
            </p>
          </div>
        )}

        {lowCount > 0 && (
          <div className="bg-safe-50 border border-safe-500/30 rounded-accessible p-4 text-center">
            <p className="text-base text-safe-700">
              <span className="tabular-nums">{lowCount}</span> low {lowCount === 1 ? 'risk' : 'risks'} — monitor
            </p>
          </div>
        )}

        <div className="space-y-4">
          {hazards.map((hazard, index) => (
            <div key={hazard.name} className="animate-stagger-fade" style={{ animationDelay: `${index * 80}ms` }}>
              <HazardCard
                name={hazard.name}
                riskLevel={hazard.riskLevel}
                recommendation={hazard.recommendation}
              />
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={onScanAgain}
            className="min-h-tap min-w-tap inline-flex items-center justify-center px-6 py-3 text-lg font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-accessible hover:from-brand-600 hover:to-brand-700 active:from-brand-700 active:to-brand-800 focus-visible:shadow-focus contrast-more:ring-2 contrast-more:ring-offset-2 transition-[background] motion-safe:active:scale-[0.98]"
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
      <div className="text-safe-500 mb-4 animate-scale-in">
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
        className="min-h-tap min-w-tap inline-flex items-center justify-center px-6 py-3 text-lg font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-accessible hover:from-brand-600 hover:to-brand-700 active:from-brand-700 active:to-brand-800 focus-visible:shadow-focus contrast-more:ring-2 contrast-more:ring-offset-2 transition-[background] motion-safe:active:scale-[0.98]"
      >
        Scan Again
      </button>
    </div>
  );
}
