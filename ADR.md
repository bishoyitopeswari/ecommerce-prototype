# Architecture Decision Record (ADR)

Status: Accepted
Date: 2026-04-19
Applies to: ecommerce-prototype
Primary reference: [plan.md](plan.md)

## Purpose
This document records the architecture and design decisions implemented for the ecommerce prototype, including why each choice was made, alternatives considered, and expected consequences.

The decisions below are mapped to the phase plan in [plan.md](plan.md), which was used as the implementation roadmap from Phase 0 through Phase 13.

## Decision 1: Use a modular monolith with strict feature boundaries
Plan traceability: Phase 1, Domain Boundaries section

Decision:
Organize the application by feature domains instead of technical layers, and enforce boundaries through feature public APIs.

Why:
- The product scope is moderate, but future growth and team scaling were expected.
- The project guideline required strict domain boundaries and future microfrontend readiness.
- Feature ownership improves maintainability and isolates change impact.

Alternatives considered:
- Type-based folders (components, hooks, services, utils): easier at first, but weak domain ownership.
- Monolithic page-based structure: fast start, harder long-term evolution.

Consequences:
- Positive: better scalability and clearer ownership.
- Tradeoff: requires discipline in import boundaries and feature export surfaces.

## Decision 2: Use Material UI for component primitives
Plan traceability: Objective, Phase 0, Phase 6-9 page implementations

Decision:
Build all page-level UI with Material UI components and icons.

Why:
- Rapid implementation with accessibility-ready controls and coherent design language.
- Reduced custom CSS burden while still enabling theming.

Alternatives considered:
- Custom component library: more flexibility, slower delivery.
- Tailwind-only build: fast utility styling, but more manual accessibility and component behavior work.

Consequences:
- Positive: consistent UI, faster delivery.
- Tradeoff: larger bundle footprint than hand-rolled primitives.

## Decision 3: Use local mock APIs with MSW and keep all mock artifacts outside app code

Decision:
Implement local mocked endpoints through MSW and place all fixtures/handlers under root mock folder, separate from src.

Why:
- Requirement explicitly stated all API calls must be local mocks and mocks must not live in application code directories.
- MSW provides network-level interception close to real backend behavior.

Alternatives considered:
- In-app fake functions: simple but unrealistic network behavior.
- JSON server process: realistic but adds separate process management overhead.

Consequences:
- Positive: realistic API behavior, easy future backend swap.
- Tradeoff: mock contracts must be maintained carefully to avoid drift.

## Decision 4: Centralize HTTP access through one API client with interceptors

Decision:
Use a centralized axios client for all features, with request and response interceptors.

Why:
- Requirement called for centralized HTTP and auth token interception.
- Prevents feature code from duplicating transport concerns.

Alternatives considered:
- Per-feature fetch wrappers: can diverge in behavior and error contracts.
- Direct fetch in components: tightly couples UI and transport concerns.

Consequences:
- Positive: consistent behavior across all API traffic.
- Tradeoff: interceptor changes have wide impact and require regression checks.

## Decision 5: Normalize all API errors into one UI-safe shape

Decision:
Normalize transport and server errors into a single structure with code, message, status, details.

Why:
- Requirement stated UI should never parse raw HTTP errors.
- Enables consistent error handling in pages and mutations.

Alternatives considered:
- Pass-through axios errors to UI: fast initially, fragile and inconsistent.

Consequences:
- Positive: predictable UX and easier testing.
- Tradeoff: may hide transport-level details unless explicitly logged.

## Decision 6: Separate server state and client state using TanStack Query

Decision:
Use TanStack Query for server state management and caching semantics.

Why:
- Requirement forbids storing API payloads in global client stores when data libraries already handle it.
- Needed fine-grained caching/invalidation patterns across products, cart, and orders.

Alternatives considered:
- Global store for all state: increases stale data risk and duplication.
- Per-component useEffect fetching: repetitive and harder to cache/invalidate safely.

Consequences:
- Positive: robust query lifecycle and cache control.
- Tradeoff: adds conceptual complexity for optimistic updates and invalidation strategy.

## Decision 7: Apply domain-specific caching strategy

Decision:
- Products: stale-while-revalidate style behavior for speed.
- Cart: always refetch-oriented semantics to reflect server truth.
- Orders: cached by page key and invalidated on place-order.

Why:
- Matches requirements exactly and aligns behavior to business criticality.

Alternatives considered:
- Uniform cache policy for all domains: simpler but wrong for cart consistency needs.

Consequences:
- Positive: user experience and correctness balanced by domain.
- Tradeoff: more complex query key and invalidation logic.

## Decision 8: Implement optimistic cart updates with rollback

Decision:
Use optimistic cache mutation for cart quantity/remove actions, with rollback on failure and server re-sync after settlement.

Why:
- Requirement explicitly requested optimistic cart behavior with rollback.

Alternatives considered:
- Strict server-first updates: safer but slower and less responsive UX.

Consequences:
- Positive: responsive cart UI.
- Tradeoff: requires careful rollback logic and testing around failure timing.

## Decision 9: Use route-level code splitting with data prefetching

Decision:
Use lazy loaded routes with Suspense fallbacks, plus route/pointer-intent prefetch for product data.

Why:
- Requirement asked for route-based code splitting and prefetch strategy.
- Reduces initial JS payload and improves perceived navigation speed.

Alternatives considered:
- Eager route imports: simple but heavier first load.

Consequences:
- Positive: better startup and navigation performance profile.
- Tradeoff: route setup and testing become more complex.

## Decision 10: Add navigation guard for unsaved form state

Decision:
Implement a reusable unsaved-changes guard hook using router blocker and browser beforeunload behavior.

Why:
- Requirement requested confirmation prompts before leaving pages with unsaved form changes.

Alternatives considered:
- No guard: simpler but risks accidental data loss.

Consequences:
- Positive: protects user input.
- Tradeoff: needs careful UX timing to avoid over-prompting.

## Decision 11: Implement dummy credential auth contract

Decision:
Use fixed mock credentials and token-based session simulation.

Why:
- Requirement explicitly called for dummy username/password and local mock API auth.

Alternatives considered:
- Full OAuth simulation: unnecessary for current prototype scope.

Consequences:
- Positive: deterministic auth flow for development and tests.
- Tradeoff: not security-representative of production auth.

## Decision 12: Protect feature routes and persist session locally

Decision:
Persist token and profile in local storage, gate product/cart/orders routes via a protected route component, and provide logout in shell.

Why:
- Required protected route behavior and login persistence semantics.

Alternatives considered:
- Session in memory only: would lose login on refresh.

Consequences:
- Positive: realistic session continuity in prototype usage.
- Tradeoff: local storage token persistence is less secure than hardened production patterns.

## Decision 13: Build logger behind an interface with structured events

Decision:
Define logger interface with debug/info/warn/error and default console provider; route all API duration, route change, and error events through this abstraction.

Why:
- Requirement asked for provider-swappable logging and structured event capture.

Alternatives considered:
- Direct console calls throughout code: no provider abstraction, hard to migrate.

Consequences:
- Positive: easy future migration to Sentry/Datadog style backends.
- Tradeoff: small abstraction overhead in a prototype.

## Decision 14: Add React Error Boundary and global error listeners

Decision:
Use component-level error boundary and global window error/unhandledrejection listeners.

Why:
- Requirement requested both React boundary capture and global unhandled error capture.

Alternatives considered:
- Boundary-only approach: misses non-render async/global exceptions.

Consequences:
- Positive: broader runtime observability and resilience.
- Tradeoff: must avoid duplicate logging in some failure scenarios.

## Decision 15: Implement PWA using custom service worker plus workbox-window

Decision:
Use a custom service worker file with app-shell and product API caching, and manage registration/update prompts via workbox-window helper.

Why:
- Requirement requested app shell strategy, offline product browsing, and update notifications.
- Plugin compatibility constraints with current Vite version favored this approach.

Alternatives considered:
- vite-plugin-pwa plugin path: desirable, but incompatible with current Vite version constraints at implementation time.

Consequences:
- Positive: requirement-compliant offline and update behavior.
- Tradeoff: manual service worker maintenance compared to plugin-managed generation.

## Decision 16: Use typed environment strategy with staged env files

Decision:
Add development, staging, and production env files with typed env accessor and type declarations.

Why:
- Requirement requested explicit env strategy and elimination of raw env access.

Alternatives considered:
- Ad-hoc direct import.meta.env reads: easier, less safe and less discoverable.

Consequences:
- Positive: predictable, typed configuration model.
- Tradeoff: requires synchronized env keys across files and declarations.

## Decision 17: Add CI quality gate for lint, typecheck, tests, and build

Decision:
Add GitHub Actions workflow that runs install, lint, typecheck, tests, and build on pull requests.

Why:
- Requirement requested CI checks on PRs.
- Prevents regressions entering shared branches.

Alternatives considered:
- Lint-only CI: insufficient for runtime/type/test regressions.

Consequences:
- Positive: stronger delivery confidence.
- Tradeoff: longer CI cycle compared with minimal checks.

## Decision 18: Adopt Vitest + Testing Library with behavior-focused coverage

Decision:
Use Vitest and Testing Library for unit/integration tests covering normalized errors, interceptors, logger contract, login, products filtering, cart rollback, orders invalidation, and error boundary fallback.

Why:
- Requirement requested explicit functional and resilience coverage areas.

Alternatives considered:
- Unit-only testing: misses interaction-level behavior and mutation flows.

Consequences:
- Positive: confidence in critical user flows and architectural contracts.
- Tradeoff: increased maintenance cost as UI and contracts evolve.

## Cross-cutting tradeoffs accepted
- Prototype velocity vs production-hardening:
  - Chosen to prioritize deterministic local development and architecture clarity.
- Manual service worker control vs plugin automation:
  - Chosen due toolchain compatibility and requirement fit.
- Local mock-first architecture vs backend integration:
  - Chosen to satisfy scope and keep all API interactions testable offline.

## Revision policy
Any change that affects boundaries, caching semantics, auth/session behavior, transport contracts, observability model, PWA lifecycle, environment model, or CI quality gates should update this ADR.
