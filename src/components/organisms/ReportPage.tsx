import { useHydratedScanStore } from '@/stores/use-scan-store';
import { useAnalysisStore } from '@/stores/use-analysis-store';
import { SafetyReport, EmptyReport } from './SafetyReport';
import { navigate } from 'astro:transitions/client';

function ReportSkeleton() {
  return (
    <div className="min-h-dvh px-4 py-8">
      <div className="max-w-lg mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="h-8 shimmer-bg rounded w-48 mx-auto" />
          <div className="h-4 shimmer-bg rounded w-32 mx-auto" />
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-accessible border border-on-surface-muted/20 shimmer-bg h-24" />
          <div className="p-4 rounded-accessible border border-on-surface-muted/20 shimmer-bg h-24" />
          <div className="p-4 rounded-accessible border border-on-surface-muted/20 shimmer-bg h-24" />
        </div>
      </div>
    </div>
  );
}

export function ReportPage() {
  const hydrated = useHydratedScanStore();
  const currentScan = hydrated.currentScan;
  const clearCurrentScan = hydrated.clearCurrentScan;
  const analysisState = useAnalysisStore((s) => s.state);

  const handleScanAgain = () => {
    clearCurrentScan();
    useAnalysisStore.getState().reset();
    navigate('/scanner');
  };

  if (analysisState !== 'idle' && analysisState !== 'complete') {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 shimmer-bg rounded-full mx-auto" />
          <p className="text-lg text-on-surface-muted">Loading report…</p>
        </div>
      </div>
    );
  }

  if (!currentScan || currentScan.hazards.length === 0) {
    return <EmptyReport onScanAgain={handleScanAgain} />;
  }

  return <SafetyReport hazards={currentScan.hazards} onScanAgain={handleScanAgain} />;
}