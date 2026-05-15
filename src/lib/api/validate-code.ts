import type { ValidateCodeResponse } from './types';
import { safeFetch } from './client';

const USE_DUMMY = !import.meta.env.PUBLIC_N8N_BASE_URL;

export async function validateCode(code: string): Promise<ValidateCodeResponse> {
  if (USE_DUMMY) {
    await new Promise((r) => setTimeout(r, 800));
    return { valid: code.length >= 4 };
  }
  return safeFetch<ValidateCodeResponse>(
    `${import.meta.env.PUBLIC_N8N_BASE_URL}/validate`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) },
    30_000,
  );
}
