import { useHydratedScanStore } from '@/stores/use-scan-store';
import { useAnalysisStore } from '@/stores/use-analysis-store';
import { SafetyReport, EmptyReport } from './SafetyReport';
import { navigate } from 'astro:transitions/client';
import { Spinner } from '@/components/atoms/Spinner';

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
          <Spinner size="lg" />
          <p className="text-lg text-on-surface-muted">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!currentScan || currentScan.hazards.length === 0) {
    return <EmptyReport onScanAgain={handleScanAgain} />;
  }

  return <SafetyReport hazards={currentScan.hazards} onScanAgain={handleScanAgain} />;
}