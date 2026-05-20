## Why

The frontend currently fails to display analysis results from the backend because it cannot handle the array-wrapped response structure common in n8n webhook outputs. Additionally, strict case-sensitivity in risk level validation and tight timeouts for long video recordings lead to a fragile user experience where legitimate analysis results are discarded.

## What Changes

- **Robust API Parsing**: Update `parseSafetyReport` to handle both object and array-wrapped responses (`[{ "output": { ... } }]`).
- **Flexible Validation**: Modify `isSafetyReport` to support case-insensitive risk levels (e.g., "high" becomes "High") to handle variations in LLM output.
- **Improved Observability**: Add diagnostic logging when parsing fails to capture the raw response for easier troubleshooting.
- **Increased Timeout**: Bump the API timeout from 45s to 60s to support 10-second video uploads and processing.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `api-integration`: Update the parsing requirements to support array-wrapped responses and case-insensitive risk level normalization.

## Impact

- `src/lib/api/analyze-frames.ts`: Primary location for parsing and validation logic.
- `src/lib/api/types.ts`: Risk level types remain the same but normalization logic will be added.
- `src/lib/api/client.ts`: The `safeFetch` timeout will be adjusted in the calling function.
