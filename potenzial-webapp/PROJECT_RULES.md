# PROJECT_RULES – Sparziel

## Architecture
- Do not move business logic into UI components.
- Preserve the current state management approach.
- Do not change folder structure unless explicitly required.
- Avoid introducing global state.

## Scope Control
- No refactors outside the defined task.
- No UI redesign unless explicitly requested.
- No data model changes without explicit PLAN MODE approval.

## Change Policy
- Minimal diff only.
- Touch only files directly required for the task.
- No dependency changes without justification.

## Verification
- Every new feature must include manual test steps.
- Edge cases must be explicitly listed before implementation.
