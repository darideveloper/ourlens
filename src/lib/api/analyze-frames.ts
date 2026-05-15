import type { SafetyReport, AnalyzeFramesRequest } from './types';
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
      name: 'Bathroom grab bars missing',
      riskLevel: 'Low',
      recommendation: 'Install grab bars near toilet and inside the shower/tub.',
    },
  ],
};

function isSafetyReport(data: unknown): data is SafetyReport {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.hazards)) return false;
  return obj.hazards.every(
    (h) =>
      typeof (h as Record<string, unknown>).name === 'string' &&
      ((h as Record<string, unknown>).riskLevel === 'Low' ||
        (h as Record<string, unknown>).riskLevel === 'High') &&
      typeof (h as Record<string, unknown>).recommendation === 'string',
  );
}

function parseSafetyReport(data: unknown): SafetyReport {
  const payload =
    typeof data === 'object' && data !== null && 'output' in data
      ? (data as Record<string, unknown>).output
      : data;
  if (isSafetyReport(payload)) return payload;
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
    45_000,
  );

  return parseSafetyReport(data);
}
