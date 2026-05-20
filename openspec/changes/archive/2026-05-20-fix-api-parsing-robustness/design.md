## Context

The `ourlens` frontend integrates with an n8n-hosted backend for image analysis. The current implementation assumes a specific JSON object structure and strict string matching for risk levels. In practice, the backend (due to n8n's default webhook behavior and LLM variability) often returns results wrapped in an array or with variations in casing, causing the frontend to reject valid analysis results.

## Goals / Non-Goals

**Goals:**
- Enable the frontend to successfully parse backend responses even when wrapped in arrays.
- Support case-insensitive risk level matching to improve resilience against LLM output variations.
- Provide better diagnostic visibility when parsing fails.
- Increase the timeout to support longer processing times for 10-second videos.

**Non-Goals:**
- Changing the backend response structure.
- Modifying the visual layout of the report page (beyond ensuring data is displayed).
- Implementing a full-scale logging service (using `console.warn` for now).

## Decisions

### 1. Unified Response Normalization
- **Rationale**: Instead of adding complex conditional logic throughout the API functions, we will centralize the normalization of the raw response in `parseSafetyReport`.
- **Implementation**: Check if the root data is an array; if so, take the first element. Then check for the `output` key.
- **Alternative**: Forcing the backend to change its format. **Rejected** because n8n's array wrapping is a platform default and harder to change than the frontend's consumer.

### 2. Case-Insensitive Risk Level Normalization
- **Rationale**: LLMs are non-deterministic and may return "high", "High", or "HIGH". Normalizing these at the point of entry ensures the rest of the app (including UI styling) works correctly with the expected `'Low' | 'Medium' | 'High'` type.
- **Implementation**: Create a helper function to map lowercase versions of the strings to the typed versions.

### 3. Increased Timeout for Analysis
- **Rationale**: 45 seconds is sometimes insufficient for processing multiple frames through an LLM, especially when including the network round-trip. 60 seconds provides a better buffer for these "heavy" operations.

## Risks / Trade-offs

- **[Risk]** The backend might return multiple items in the array. → **Mitigation**: Standard n8n webhooks usually return one item per execution; we will take the first element as the primary result.
- **[Risk]** Normalization might hide systemic backend issues. → **Mitigation**: Include `console.warn` logging of the raw response when parsing fails to maintain visibility.
