export type RiskLevel = 'Low' | 'High';

export interface Hazard {
  name: string;
  riskLevel: RiskLevel;
  recommendation: string;
}

export interface SafetyReport {
  hazards: Hazard[];
}

export interface ValidateCodeRequest {
  code: string;
}

export interface ValidateCodeResponse {
  valid: boolean;
}

export interface AnalyzeFramesRequest {
  code: string;
  images: string[];
}
