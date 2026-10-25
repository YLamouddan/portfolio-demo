# Client portfolio revision — 2026-10-26

## Current brief
The owner rejected the original subtle assembly, forced light appearance, technical terminology and engineering-specific projects. The new draft focuses on acquiring clients through recognisable business examples while retaining personal engineering background in About. Keep everything private on the existing Tailscale preview.

## Scroll behaviour
Three enquiry, quote and booking panels translate and rotate into a connected business workflow. Headlines move and change with scroll progress. Native scrolling stays intact. The former short-mobile CSS disabled the sticky scene below 650px height; that restriction is removed. The installed Framer Motion 11 reduced-motion hook samples a value without subscribing React state to later preference changes, so a local matchMedia listener now updates the control live. System reduced-motion remains the default policy, with an explicit persistent System/On/Off motion selector so a visitor can choose the experience. Short screens compress the composition without removing the scroll range.

## Appearance
System, Dark and Light through the existing next-themes provider. A new portfolio-specific storage key avoids stale theme choices from the previous draft. System follows prefers-color-scheme and subsequent browser changes. Semantic surface/text/accent tokens style the homepage, illustrations and new demo pages. Locally hosted Manrope is retained.

## Client-facing projects
1. Enquiry to quote: configurable services, whole-cent prices, discounts and a proposal state cleared when scope changes.
2. Book without the back-and-forth: availability checks against full appointment duration, sample reservations and overlapping-time rejection.
3. A calmer client portal: visible progress, change requests and approvals tied to deliverable versions.
4. A helpful support desk: suggested replies from authored sample shop policies, source labels and human handover for unsupported or mixed-policy queries.

All are newly built independent browser demos with fictional data. No invented client work, performance figures, AI integration, email delivery, shared calendar or durable login/storage is claimed. Superseded technical demos remain recoverable in local checkpoint da4efb1; legacy /projects URLs are retained.

## Email boundary
Mailu already contains me@ylamouddan.com as an alias delivering to hello@ylamouddan.com. Public MX records still point to iCloud. The owner explicitly chose to keep iCloud routing for now on 2026-10-26. Do not change MX, create a conflicting mailbox, or present Mailu alias existence as proof of external delivery. Current working Gmail contact stays in the private draft until the desired personal address is confirmed at the actual receiving provider. No mailbox/DNS changes or email tests that send messages were performed.

## Skills and verification
Frontend-design and UI/UX Pro Max guidance applied. A theme search returned an unrelated result and was discarded; next-themes official documentation supplied preference handling instead. Motion official useScroll/accessibility documentation supplied the scroll and motion-override approach.

Focused logic tests live in tests/client-tools.test.mjs. Browser checks live in scripts/verify-client-portfolio.cjs and use actual mouse wheel scrolling, short mobile viewports, reduced-motion and explicit overrides, theme persistence and live system changes, new demo interactions, mobile overflow and page-error checks. Results/screenshots go to ignored review/client-revision/. This does not constitute a full accessibility audit.

## Operations
Local checkpoint branch checkpoint/portfolio-before-client-revision-20261026 at da4efb1 preserves the previous exact source state. Feature branch feat/client-portfolio-theme-scroll-20261026. No branch push because the owner prohibits publication and Vercel creates branch previews. Only restart the existing private preview after a passing build and browser checks; keep its Tailscale address binding and other services unchanged.
