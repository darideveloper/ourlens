<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

**CRITICAL — Task marking override:**
When implementing tasks from any OpenSpec proposal, you MUST load and follow the
`apply-spec-proposal-iteratively` skill. Mark each task `- [x]` in `tasks.md`
IMMEDIATELY after completing it, before moving to the next task. Never batch-mark
all tasks at the end of implementation. The tasks.md file must reflect real-time
progress at all times.

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->