# Yassir Lamouddan — Business automation portfolio

Personal portfolio at [ylamouddan.com](https://ylamouddan.com/), built with Next.js, React, TypeScript, and Tailwind CSS.

## Invoice follow-up planner

Route: `/projects/invoice-follow-up`

Turns an unpaid-invoice CSV into a prioritised follow-up plan and message drafts. Includes fictional sample data, a downloadable CSV template, and an export of the results.

- Validates column names, email addresses, unique invoice IDs, amounts, and calendar dates.
- Calculates invoice ageing using calendar days, independent of daylight-saving transitions.
- Applies visible rules: 1–7 days overdue gets a gentle reminder, 8–30 days a follow-up, and 31+ days a personal review. Invoices due today or later get no draft.
- Processes up to 500 unpaid invoices in one currency per import. Amounts use integer cents. Currency selection labels the supplied amounts; it does not convert them.

CSV input:

```csv
customer,email,invoice,amount,due_date
Sample Customer,accounts@example.com,DEMO-001,100.00,2026-01-15
```

The sample button generates four fictional invoices relative to the visitor's current date. Users must review payment status and drafts before taking action. No accounting or email API is connected.

## Lead intake & routing

Route: `/projects/lead-routing`

Turns an enquiry into a team assignment, priority, next action, and reply draft. Includes a fictional sample enquiry and a CSV export for mapping into a CRM.

- Service determines the responsible team.
- Budget at or above the editable EUR threshold qualifies the enquiry. Qualified urgent enquiries are high priority; other qualified enquiries are normal priority.
- Below-threshold enquiries require scoping, even when marked urgent.
- The written brief is preserved in the export. Routing is deterministic and does not analyse the brief with AI.

Both tools are independent portfolio demos, not client case studies. Data stays in page memory and is lost on reload. There is no browser storage, message sending, CRM connection, or background automation. CSV exports escape spreadsheet formula prefixes.

## Personal integrations

The homepage also describes self-hosted infrastructure, knowledge/task management, and an assistant environment built by configuring and integrating existing open-source tools. Those environments are private; their credentials, hostnames, and data are not included here.

## Development

```sh
npm ci
npm run dev
npm run build
```

Run the logic tests with Node.js 22.18+ or 24+:

```sh
npm test
```

Tests cover CSV quoting, malformed data, date arithmetic, duplicate invoices, ageing thresholds, draft eligibility, spreadsheet-safe exports, and lead-routing boundaries. `npm run build` also checks TypeScript and lint rules.

Vercel builds branches for preview and deploys `main` to the existing domain. No CV download or public CV file is included.
