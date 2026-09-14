# Yassir Lamouddan — Automation & software portfolio

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
