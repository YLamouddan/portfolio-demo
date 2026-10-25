# Scroll portfolio — local review draft

User brief: attract jobs and clients; replace current projects with stronger work suited to Yassir's skills; clean, simple opening that changes with scroll, followed by modest detail. Keep everything local. Latest direction supersedes the earlier interactive-quote proposal.

## Design decisions

- Subject: electrical engineering meets software and practical automation. Domain: components, signals, connections, diagnosis, recovery.
- Signature: separate geometric components assemble into a connected system across one sticky scroll sequence. The sequence ends before project details. Native scrolling, visible skip link, static final composition under reduced motion; no autoplay, cursor gimmicks, or WebGL dependency.
- Palette: porcelain #F5F7FA, ink #182633, secondary #526171, cobalt #234FE5, line #D9E1EA, signal #B7D0FF. Cobalt comes from engineering drawings and test equipment. Depth uses surface shifts and restrained borders; an exploded component drawing supplies the one dimensional moment.
- Typography: locally hosted Manrope for display/body; system monospace for instrument labels. Display is spacious; explanatory copy stays below 70 characters per line. Base spacing 8px; controls at least 44px.
- Homepage: short name/role introduction → assembly scroll sequence → four distinct project previews → concise background/tool experience → employer/client contact. No CV download, private setup details, invented clients, career duration, impact figures, or availability claims.

## New project scope

| Project | Working local behaviour | Explicit limit |
| --- | --- | --- |
| Bench | Rule-based repair triage from sample symptoms, ranked explanations and evidence gaps | Synthetic equipment; no predictive model or real repair records |
| Loadshift | Exhaustive scheduling across bounded start windows, energy cost and demand cap, infeasibility reporting | Fictional tariffs/loads; no meter or device connection |
| Relay | Failure injection, bounded retries, human review and replay deduplication | In-memory state machine; no external delivery or durable queue |
| Fieldnotes | Passage retrieval, exact source excerpts, query coverage and unsupported-query abstention | Authored sample documents; no LLM generation or production RAG |

These are newly built independent prototypes, never represented as historic employment/client projects. Existing demos remain reachable at old routes but are replaced in featured navigation.

## Skills and research applied

Frontend-design: one subject-specific signature; quiet surrounding UI. UI/UX Pro Max: searched design system, scroll/reduced-motion, and Next.js guidance. Its suggested Space Grotesk pairing is rejected because the existing site already uses it and the user wants a different identity. Its Next.js 16 guidance is not a migration instruction; retain Next.js 14 and existing compatible APIs.

Vercel Web Design Guidelines: semantic landmarks, skip navigation, visible focus, readable contrast, touch targets, explicit transitions, transform/opacity animation. Motion's official useScroll/reduced-motion documentation informed the existing Framer Motion integration. Skills are downloaded locally under `/opt/worktrees/portfolio-review-20261025/skills/` for this session; no claim of global installation.

## Validation and delivery

Use existing dependencies through the ignored node_modules link. Test new branching logic, run the production build, and inspect desktop/mobile/reduced-motion/no-JavaScript behaviour plus the new demo interactions. Keep source and screenshots local; no pushes, Vercel preview, Sites registration, deployment or domain changes. Review visual taste with the owner before any publication.
