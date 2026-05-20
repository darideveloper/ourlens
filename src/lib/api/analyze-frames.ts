import type { SafetyReport, AnalyzeFramesRequest, RiskLevel, Hazard } from './types';
import { safeFetch } from './client';

const USE_DUMMY = !import.meta.env.PUBLIC_N8N_BASE_URL;

const DUMMY_HAZARDS: SafetyReport = {
  hazards: [
    {
      name: 'Loose rug in hallway',
      riskLevel: 'High',
      recommendation: 'Secure rug with non-slip backing or remove it entirely.',
    },
    {
      name: 'Poor lighting near stairs',
      riskLevel: 'Low',
      recommendation: 'Install brighter bulbs or motion-activated lights at top and bottom of stairs.',
    },
    {
      name: 'Cluttered walkway',
      riskLevel: 'High',
      recommendation: 'Clear pathway to ensure at least 36 inches of unobstructed passage.',
    },
    {
      name: 'Exposed electrical cords',
      riskLevel: 'Medium',
      recommendation: 'Secure cords along baseboards or use cord covers to prevent trips.',
    },
    {
      name: 'Bathroom grab bars missing',
      riskLevel: 'Low',
      recommendation: 'Install grab bars near toilet and inside the shower/tub.',
    },
  ],
};

function normalizeRiskLevel(level: unknown): RiskLevel | null {
  if (typeof level !== 'string') return null;
  const lower = level.toLowerCase();
  if (lower === 'low') return 'Low';
  if (lower === 'medium') return 'Medium';
  if (lower === 'high') return 'High';
  return null;
}

function isSafetyReport(data: unknown): data is SafetyReport {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.hazards)) return false;

  // We mutate the objects during validation to normalize the risk level
  // This is safe because this is called on a fresh response object
  return obj.hazards.every((h) => {
    if (typeof h !== 'object' || h === null) return false;
    const hazard = h as Record<string, unknown>;

    const normalized = normalizeRiskLevel(hazard.riskLevel);
    if (!normalized) return false;

    hazard.riskLevel = normalized; // Normalize in-place

    return (
      typeof hazard.name === 'string' &&
      typeof hazard.recommendation === 'string'
    );
  });
}

function parseSafetyReport(data: unknown): SafetyReport {
  // Handle n8n array wrapping: [{ "output": { ... } }] or [{ ... }]
  let payload = Array.isArray(data) ? data[0] : data;

  // Handle nested output field: { "output": { ... } }
  if (typeof payload === 'object' && payload !== null && 'output' in payload) {
    payload = (payload as Record<string, unknown>).output;
  }

  if (isSafetyReport(payload)) return payload;

  console.warn('[API Parsing] Failed to parse safety report. Raw data:', data);

  return {
    hazards: [
      {
        name: 'Analysis Complete',
        riskLevel: 'Low',
        recommendation:
          "We couldn't parse the detailed results. Please try scanning again.",
      },
    ],
  };
}

export async function submitFrames(
  code: string,
  images: string[],
  signal?: AbortSignal,
): Promise<SafetyReport> {
  const payload: AnalyzeFramesRequest = { code, images };

  if (USE_DUMMY) {
    await new Promise((r) => setTimeout(r, 2000));
    return DUMMY_HAZARDS;
  }

  const data = await safeFetch<unknown>(
    `${import.meta.env.PUBLIC_N8N_BASE_URL}/analyze`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    },
    60_000,
  );

  return parseSafetyReport(data);
}
