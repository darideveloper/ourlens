# api-integration Delta Specification

## Modified Requirements

### Requirement: Hazard Data Type
The `riskLevel` field on `Hazard` SHALL accept `"High"`, `"Medium"`, or `"Low"`. Any response where a hazard contains any other `riskLevel` value SHALL fail `isSafetyReport()` validation and be replaced by the safe default.

#### Scenario: Medium riskLevel accepted
- **WHEN** n8n returns a hazard with `riskLevel` set to `"Medium"`
- **THEN** `isSafetyReport()` SHALL return `true`
- **AND** `parseSafetyReport()` SHALL include the hazard in the report
