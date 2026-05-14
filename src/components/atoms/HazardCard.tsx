interface HazardCardProps {
  name: string;
  riskLevel: 'Low' | 'High';
  recommendation: string;
}

export function HazardCard({ name, riskLevel, recommendation }: HazardCardProps) {
  return (
    <div
      className={`p-4 rounded-accessible border shadow-card hover:shadow-elevated transition-shadow ${
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