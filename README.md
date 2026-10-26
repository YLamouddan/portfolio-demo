# Yassir Lamouddan — Engineering, software & automation

## Current private review — Signal and mobile repair

Only Signal is currently featured; the owner rejected Forma/Flow Studio as the portfolio's other projects. Their direct routes/source remain available for recovery, while replacements await selection based on [real freelancer case studies](docs/research/2026-10-26-freelancer-portfolio-review.md).

The opening now demonstrates Signal's sample sources, priorities and computed ranking. Mobile has a readable full-width result and bounded artwork above its controls. The homepage and Signal have been checked in dark/light on mobile and desktop.

The private preview runs from independent build snapshots. Never rebuild inside the directory used by a running Next production preview: cached HTML may reference assets removed by the rebuild. Build source, then use the dry-run-first `scripts/refresh-private-preview.py --apply`. The helper checks candidate HTML/CSS/JS/fonts, switches only its private user service, retains prior releases/assets, and verifies the real endpoint. `scripts/audit-mobile-themes.cjs` audits that endpoint. No public deployment is performed.

## Earlier flagship prototypes · October 2026

No branch push, public deployment or production-domain change has been made. The current draft features three independent product prototypes with real browser interactions and explicit integration boundaries.

| Product | Route | Implemented experience |
| --- | --- | --- |
| Flow Studio | `/work/flow-studio` | Editable workflow graph, branch policies, human approval, failure injection, retry budget, replay protection and run inspection/export. AI/CRM connectors are simulated. |
| Forma | `/work/forma` | Original 3D geometry and local perspective renderer, orbit/zoom, dimensions/materials/accessories, price and room-clearance rules, saved configuration and specification export. |
| Signal | `/work/signal` | Adjustable rankings, source excerpts, filters, shortlist, validated local JSON import and export. Fictional data; deterministic analysis. |

The homepage preserves the scroll-linked business workflow but interpolates wheel input through one damped spring. Native scrolling remains intact. A binary animation switch remembers On/Off; first-visit reduced-motion preference is respected. Dark/light appearance uses a binary sun/moon toggle with Google Material Symbols SVGs hosted locally under Apache-2.0. There are no System menus or external icon fonts.

```sh
node --test tests/showcase-models.test.mjs
npm run build
# Uses an existing Playwright/Chromium; starts/stops its own loopback server.
node scripts/verify-flagships.cjs
```

Set `PORTFOLIO_PLAYWRIGHT_PATH` and `PORTFOLIO_BROWSER` for non-default tool locations. `scripts/profile-scroll.cjs` records a bounded before/after wheel-input probe against the private preview; its metrics describe the test browser, not every visitor's device. Ignored `review/flagships/` contains screenshots and receipts. Earlier browser scripts target archived draft states and are not the active verification path.

No live messages, model calls, CRM changes, orders or payments are triggered. No invented client work or business outcomes are claimed. The original artwork and rejected drafts remain in Git history/local checkpoints. Legacy `/projects/` URLs remain available.

## Existing production version and legacy demos

Live at [ylamouddan.com](https://ylamouddan.com/). Built with Next.js, React, TypeScript, and Tailwind CSS.

## Featured projects

| Project | Route | Scope |
| --- | --- | --- |
| Revenue Desk | `/projects/revenue-desk` | Interactive sales pipeline, quote configuration, margin/discount approval gates, weighted forecast, quote export, and session activity log. |
| Purchasing Control | `/projects/purchasing-control` | Interactive purchase-order / delivery / invoice matching, batch quantity checks, duplicate detection, price tolerance, gated approvals, and review export. |
| Opportunity Intelligence | `/projects/opportunity-intelligence` | Public overview of an existing private multi-source opportunity research and scoring pipeline. |
| Private Automation Platform | `/projects/automation-platform` | Public overview of existing private access, service isolation, integrations, and deployment work. |

The interactive projects are independent prototypes using explicitly fictional sample data. They run in browser memory; a page reload resets changes. They do not send messages, make payments, or update external systems. All money values are illustrative, in EUR, and before tax. Stage probabilities are scenario assumptions, not performance claims or predictions.

### Revenue workflow

Select an opportunity, configure its scope and discount, review policy exceptions, then advance it through qualification, proposal, and won. Discounts above 10% or margins below 25% require simulated approval. Quote edits clear approval; editing a proposal returns it to qualification. Won quotes are locked. Adding the same sample enquiry twice is blocked by an email duplicate check.

The forecast separates won business from open pipeline. Open stage weights are New 15%, Qualified 40%, Proposal 70%. Quote calculations use integer cents. An empty quote cannot advance to proposal.

### Purchasing workflow

The five-record sample includes a clean invoice, a partial delivery, a price discrepancy, and two copies of one supplier invoice. Record the missing delivery, adjust price tolerance, or resolve the duplicate to see the approval gate respond. Quantity checks consider all invoices for the same order/item in the current batch, preventing split invoices from bypassing the check. Duplicate supplier numbers are compared without case or surrounding whitespace.

Changes to invoice data, delivery evidence, or matching rules invalidate all session approvals conservatively. The activity log records changes and simulated approvals. This prototype does not reconcile against historical paid invoices, persist an audit log, or enforce real user roles.

## Supporting demos

- `/projects/invoice-follow-up`: validated unpaid-invoice CSV import, calendar-day ageing, prioritisation, message drafts, and CSV export.
- `/projects/lead-routing`: service/budget/urgency rules, team assignment, reply draft, and CRM-mappable CSV export.

CSV exports neutralise spreadsheet formula prefixes. Supporting demos also run only in page memory and include fictional samples.

## Development

```sh
npm ci
npm run dev
npm test
npm run build
```

Tests require Node.js 22.18+ or 24+. The build checks compilation, lint, types, and static generation. Tests cover CSV validation, date arithmetic, routing, reconciliation exceptions, cumulative overbilling, approval gates, quote calculations, and forecast separation.

Vercel previews branches and deploys `main` to the existing domain. There is no public CV file or CV link. Private hostnames, profiles, and credentials are excluded from this repository.
