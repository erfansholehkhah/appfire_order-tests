# Appfire — Senior QA Take-Home: UI ↔ Backend Reconciliation

A small Playwright (TypeScript) suite that reproduces two real UI/backend
state-consistency incidents and the reconciliation checks that catch them.

The original environment is not accessible, so a small local **mock service**
(`mock-server/`) stands in for the storefront + backend to reproduce each
incident's critical path deterministically. It does not reproduce any
proprietary code.

## Incidents modelled

1. **Cart badge mismatch (headline).** Adding a *large quantity* returned an
   error and the cart-icon count did not update — yet the items *were* added
   to the backend cart. Partial-failure / state-inconsistency bug.
2. **Order creation (related).** An order appeared placed in the UI but was
   never created in the backend.

## Prerequisites

- Node.js 18+ (LTS)

## Install
npm install
npx playwright install

## Run
npx playwright test # run the whole suite

npx playwright show-report # open the HTML report


Playwright auto-starts and stops the mock service (see `webServer` in
`playwright.config.ts`) — no manual server step needed.

**Expected runtime:** ~10 seconds (10 tests).

## Layout
mock-server/ mock service + static product/confirmation pages
Pages/ Page Objects (ConfirmationPage, CartPage)
fixture.ts custom fixtures that provide the Page Objects
tests/ order-* and cart-* specs (api / ui / integration)
playwright.config.ts

## Notes
- Tests run single-worker (`workers: 1`) because the mock holds cart state
  globally; this keeps the shared-state tests deterministic. In a real system
  the cart would be scoped per session/test to allow full parallelism.
- Each stateful test resets backend state in `beforeEach` for isolation.