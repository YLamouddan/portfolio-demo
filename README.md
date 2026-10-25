# Yassir Lamouddan — Engineering, software & automation

## Private client-focused redesign · October 2026

This branch is a private review draft: no push, public deployment, or production-domain update. The original artwork and first draft remain in Git history and local checkpoints.

| Demo | Route | What a visitor can try |
| --- | --- | --- |
| Enquiry to quote | `/work/quotes` | Select services, calculate a price and prepare a proposal; scope changes clear stale proposals. |
| Appointment booking | `/work/booking` | Choose a service and free time; sample bookings block overlapping appointments. |
| Client portal | `/work/portal` | Review a deliverable, request changes and approve a specific version. |
| Support desk | `/work/support` | Prepare a sourced policy-based reply; unknown or mixed-policy questions go to a person. |

All are new independent browser demos with fictional data, not past client engagements. No emails are sent, appointments placed on real calendars, accounts created, refunds issued, or shared records saved. Support replies use explicit keyword rules, not an AI model.

The scroll-linked opening moves enquiry/quote/booking panels into one workflow. It keeps native scrolling and short-mobile animation, respects system reduced-motion by default, and provides a persistent System/On/Off motion control. Appearance follows the system with manual Dark/Light overrides. Manrope is hosted locally. Older `/projects/` URLs are retained but are not featured.

```sh
node --test tests/client-tools.test.mjs
npm run build
# Uses an existing Playwright installation and Chromium; owns a temporary loopback server.
node scripts/verify-client-portfolio.cjs
```

Set `PORTFOLIO_PLAYWRIGHT_PATH` and `PORTFOLIO_BROWSER` when the browser tooling is outside the default installation. Ignored `review/client-revision/` contains browser screenshots and the verification receipt. No comprehensive accessibility certification is implied by these focused checks.

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
