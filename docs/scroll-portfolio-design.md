# Current direction — business automation and four working showcases

The owner approved Catalogue, document extraction and business-system integration together, retaining Signal. Forma and Flow Studio are archived. The fresh introduction is “I turn business bottlenecks into working automation.” It draws on the process-first positioning of the saved LinkedIn draft without copying its sentences. The supporting About copy names supplier files, document copying and disconnected tools; no private employer details or invented business outcomes appear.

## Current visible experience

Four featured routes: `/work/signal`, `/work/catalogue`, `/work/folio`, `/work/bridge`. Catalogue implements real CSV parsing/mapping, source reconciliation, exact-input approval and safe export. Folio implements real local PDF text extraction and English OCR with source highlights and review-gated export. Bridge implements comparison, approval, optimistic version checks and isolated failures over simulated adapters. Every project identifies its limits and uses fictional samples. See README for the runtime and focused checks.

The scroll opening remains tied to Signal's actual sample records, priorities and scoring. The owner accepted Signal; the new overall positioning spans all four projects. Binary Material sun/moon and motion On/Off controls remain. Supplier research is a possible Signal use, not a connected live supplier feed.

## Phone failure and repair

The owner's iPhone screenshots showed default serif text, visible screen-reader-only content and unstyled links. The actual preview returned old cached HTML with a CSS URL that returned HTTP 400 after a source rebuild replaced .next assets. The previous browser checks had tested clean temporary servers, not the stale long-running preview; they did not catch this delivery failure.

The preview now runs from an independent built release under /opt/worktrees/portfolio-private-releases/. scripts/refresh-private-preview.py is dry-run first; --apply copies a completed build/public files, checks candidate HTML and every referenced stylesheet/script/font on loopback, then atomically switches the dedicated user service and verifies the actual Tailscale URL. It retains previous releases and older content-addressed assets for already-open tabs. Source rebuilds do not modify a running release. No service is boot-enabled by this helper.

Current service: portfolio-private-preview.service. The former portfolio-tailscale-preview-20261025.service is stopped. Do not restart that source-tree service. Refresh with `npm run build` followed by `python3 scripts/refresh-private-preview.py --apply`, and verify the user-visible endpoint. Both service and address are private to the Tailscale interface; no Funnel, public binding, domain change or Vercel push.

## Mobile composition and verification

Phones get a full-width readable comparison rather than a scaled desktop result; two leading records are shown in the animated preview, while the app still contains the complete dataset. Moving source fragments fit inside the illustration region above footer controls. Short-height mobile layouts retain animation with smaller but readable headline/result typography.

scripts/audit-mobile-themes.cjs tests the ACTUAL preview, captures initial/final-scroll/work-section screenshots, verifies every asset request, fonts, skip-link hiding, document width and hero/control separation. It checks visible main text contrast against effective CSS backgrounds. Current coverage is homepage at 390×740 and 375×600 plus all four project routes at 390×740 and 1440×1000, each in dark/light (20 combinations). Folio loads an actual PDF through the snapshot's extraction endpoint. The audit saves progress after every case and supports PORTFOLIO_AUDIT_RESUME=1, so a browser interruption need not repeat passing cases. Each new case gets a fresh context to bound screenshot/rendering memory. This is Chromium mobile emulation, not a physical Safari/iPhone test or complete accessibility certification. Screenshots/receipt live in ignored review/mobile-theme/; release receipts in review/releases/.

## Recovery and existing constraints

Checkpoint 571029b on checkpoint/flagships-before-signal-direction-20261026 preserves the prior exact draft. Worktree /opt/worktrees/portfolio-scroll-20261025, branch feat/signal-led-portfolio-20261026. Checkpoint 9108a88 preserves the preceding Signal-only repair; feature branch feat/catalogue-documents-integration-20261026. New changes remain local; no pushes or production deployment. Keep original artwork and no-CV rule. Keep iCloud MX unchanged; me@ylamouddan.com exists locally as a Mailu alias but external delivery at that address remains unverified, so Gmail contact remains.

---

## Prior flagship implementation record (superseded as featured selection)

# Flagship showcase revision — 2026-10-26

## Owner direction
The owner likes the enquiry/quote/booking scroll concept but finds it choppy. They rejected small feature demos and selected both advanced AI automation and polished interactive web apps. Replace visible System menus with binary controls: motion On/Off, appearance sun/moon toggle. All work remains on the private Tailscale preview. iCloud routing remains unchanged.

## Scroll diagnosis and implementation
The previous opening followed raw scrollYProgress directly. A bounded headless Chromium probe produced 8 changing artwork frames for 8 coarse wheel events, with no >34ms frames; this demonstrates discrete input stepping rather than proving a slow main thread. The new version drives all scene transformations and headline transitions from one damped useSpring value (stiffness 135, damping 30, mass .45), retaining native page scrolling. The spring settles instead of oscillating; no React scroll-state loop is used. Active moving layers receive scoped will-change and backface visibility; static cards avoid a large painted shadow. Repeatable metrics are recorded in ignored review/flagships/ by scripts/profile-scroll.cjs. The final same-browser probe recorded 94 changing artwork frames versus 8 before, 87 changes between wheel events, no frames over 34 ms, and zero layout recalculations in the sampled interval. Server/browser numbers do not guarantee performance on the owner's device.

Motion has a persistent On/Off switch. A first visitor starts Off when the OS requests reduced motion, otherwise On; a manual setting wins afterward. There is no visible System choice. Appearance defaults to dark with a persistent sun/moon switch and no System option. The Material Symbols Outlined light_mode/dark_mode SVG paths are from Google's official repository, self-hosted with Apache-2.0 licensing under public/icons/material/. No emojis or remote icon font.

## Three product showcases
- Flow Studio: editable/draggable node layout (with keyboard movement), sample enquiries and rules, intent adapter, budget branching, response preview, human approval, connector failure injection, bounded retries, replay protection, payload inspection and workflow/run JSON export. The AI adapter is explicitly simulated; the local CRM outbox is a browser fixture, not a live integration.
- Forma: original desk/chair/accessory meshes, perspective projection and shaded 3D faces rendered locally into Canvas 2D; drag/keyboard camera, zoom/reset, dimensions, finishes, accessories, itemised pricing, room-clearance rules, browser saving and JSON specification export. This is actual 3D geometry rendered in software, not a loaded product photo or WebGL claim. Prices/inventory are illustrative; no commerce backend.
- Signal: source-linked fictional opportunity data, adjustable score factors, filters/search, score contribution breakdown, evidence excerpts, shortlist, validated bounded JSON import and shortlist export. Ranking is deterministic, not an AI prediction, and no live research service is connected.

Each route opens the application prominently, followed by concise rationale and explicit implementation boundaries. The homepage uses coherent previews of the three apps. The older client widgets remain recoverable in checkpoint 75a4d4f; the original /projects routes are retained.

## Validation
Focused domain tests: tests/showcase-models.test.mjs (branching/approval, retries, price/clearance, ranking/filtering/deduplication, import validation). Browser script: scripts/verify-flagships.cjs (icon toggles/persistence, binary motion and reduced-motion initialisation, interpolation/settling, three project navigation, actual app behaviours and mobile containment). Receipts/screenshots: ignored review/flagships/. These checks are not full accessibility certification or evidence of production integrations.

## Safe operations
Checkpoint 75a4d4f on checkpoint/client-demos-before-flagships-20261026 preserves exact prior draft; feature branch feat/flagship-showcases-smooth-scroll-20261026. No pushes: branch previews/publication are not authorised. Rebuild then restart only portfolio-tailscale-preview-20261025.service, retaining its 100.112.32.62:3418 binding. Mailu me@ alias exists, but incoming domain MX still routes to iCloud by the owner's explicit decision; current Gmail contact stays until the desired address is verified at its actual receiving provider.
