## Context

The app uses US English "Analyze" (verb) and "Analyzing" (present participle) in 3 user-visible text locations across components, 2 spec files, and 1 E2E test file. The target audience is UK/European, so all user-facing text should use British English spelling: "Analyse" and "Analysing". The word "analysis" is the same in both dialects and is not affected.

## Goals / Non-Goals

**Goals:**
- Replace all user-visible "Analyze" → "Analyse" in component text strings
- Replace all user-visible "Analyzing" → "Analysing" in component text strings
- Replace "analyzes" → "analyses" in component text strings
- Update UK-specific terminology in dummy data (e.g., "tub" → "bath", "inches" → "cm")
- Update E2E test selectors that target the button by its visible text
- Update spec requirements that specify the exact text strings

**Non-Goals:**
- No changes to internal code (function/variable names, type names, file names, store names, hook names, API routes, import paths)
- No changes to the word "analysis" (same spelling in UK/US)
- No changes to aria-labels using "Analysis" (same spelling in UK/US)
- No behavior, logic, or data model changes

## Decisions

- **Simple find-and-replace approach**: Each affected string is a literal in the source code. No i18n/l10n layer exists yet, so direct string replacement is the only viable approach. A future i18n effort can adopt UK English as the default locale.
- **E2E tests updated alongside components**: The E2E selectors use `button:has-text("Analyze")` which references the visible button text. These must be updated in the same batch to keep tests green.
- **Specs updated as delta files**: Following the project's spec-driven workflow, modified requirements are captured as delta spec files under the change directory. This preserves the original spec while documenting the modification.
- **No spec update for Instructional Home**: The instructional-home spec does not prescribe the exact text "analyzes your home" — it only defines high-level content requirements. So no delta spec is needed for that capability.

## Risks / Trade-offs

- [Test timing] E2E test selectors will fail if the button text change is deployed before the test update. Mitigation: changes to component text and E2E selectors are in the same commit.
- [Scope creep] No risk — changes are purely cosmetic and mechanically verifiable.
