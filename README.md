# Appfire — Senior QA Take-Home: Cart Badge / Backend Reconciliation

A small Playwright (TypeScript) suite that reproduces one real UI/backend
state-consistency incident and the reconciliation check that catches it.

The original environment is not accessible, so a small local **mock service**
(`mock-server/`) stands in for the storefront + backend to reproduce the
incident's critical path deterministically. It does not reproduce any
proprietary code.

## The incident

Adding a **large quantity** of a product returned an **error** and the
cart-icon count **did not update** — yet the items **were committed** to the
backend cart (visible on the cart page). A partial-failure / state-inconsistency
bug: the backend write succeeded while the response path that drives the UI
failed, so the badge went stale. Customers who re-tried ended up with
**duplicate quantities**.

## Prerequisites

- Node.js **20+** (required by the Playwright version in use)

## Install

    npm install
    npx playwright install

## Run

    npm test                                 # run the whole suite
    npm run test:headed                      # watch it in a browser
    npx playwright test --grep @bug          # bug-reproduction tests
    npx playwright test --grep @regression   # regression-protection tests
    npm run report                           # open the HTML report

Playwright auto-starts and stops the mock service (see `webServer` in
`playwright.config.ts`) — no manual server step needed.

**Expected runtime:** ~8 seconds (11 tests).

## Test design

- **`@bug`** tests reproduce the historical failure (error + stale icon, items
  still committed; and the retry → duplicate-quantity consequence).
- **`@regression`** tests verify the agreed correct behaviour against the mock's
  corrected mode (`?mode=fixed`): the same bulk add must reconcile the icon with
  the backend, and must preserve an already-populated cart.
- **`@boundary`** tests pin the failure boundary (qty 9 / 10 / 11).
- Every stateful test resets backend state in `beforeEach` for isolation.

## CI

`.github/workflows/playwright.yml` runs the suite (Node 20, Chromium) on pushes
to `main` and pull requests targeting `main`, and uploads the HTML report as a
build artifact so results are visible without running anything locally. When this
check is required by a branch rule, a red run blocks the merge.

## Layout

    mock-server/            mock cart service + static product page
    Pages/                  CartPage page object
    fixture.ts              custom fixture providing the page object
    tests/                  cart-api / cart-ui / cart-integration specs
    playwright.config.ts
    .github/workflows/      CI

## Notes

- Tests run single-worker (`workers: 1`) because the mock holds cart state
  globally; this keeps the shared-state tests deterministic. In a real system
  the cart would be scoped per session/test to allow full parallelism.
- `trace: retain-on-failure` + `screenshot: only-on-failure` capture evidence
  automatically when a test fails.
  - Scope limits of the mock: the corrected flow handles an HTTP 500 after a
  committed write. It does not handle a dropped connection (fetch rejection), a
  genuinely empty commit, or an error on the reconciliation request itself —
  deliberately out of scope for a small mock.

  ## AI assistance

This submission was built with AI assistance, disclosed here and in the write-up (§4):

- The mock service files (`mock-server/server.js`, `mock-server/public/shop.html`)
  were generated with Claude and then reviewed and adjusted by me.
- I wrote the tests, the page object, and the fixtures myself, with Claude
  explaining the TypeScript/Playwright patterns.
- Claude also helped scaffold the Playwright config and CI workflow, and drafted
  the write-up.

I reviewed and validated everything committed to this repository.