---
name: material-redesign
description: Redesign a page or a flow from its mission and its data, in Material Design 3, with the user's validation before building. Use when the user says /redesign, "reconçois", "repense cette page", "refais de zéro", "propose un meilleur parcours", "optimise le flow", or gives the goal of a screen (and optionally its current version, its data or its users) and wants new pages designed from scratch rather than cleaned up. Produces a brief, an analysis, one or more page proposals and an optimised user flow, then builds the validated option. Requires the material-design-3 skill in the same skills folder.
---

# /redesign : design the page from its mission, propose, get validation, then build

Unlike `/normalize`, nothing from the current layout is kept by default. What is kept: the mission of the page, the data it must handle, the actions the user must be able to take, and the constraints of the product. The user validates the proposal before any code is written.

Read `../material-design-3/SKILL.md` first and follow its priorities (end user, then the standard, then the look, then the code). Read `DESIGN.md` at the project root if it exists; if it does not, run the first-use audit from that SKILL.md.

## Phase 1: brief (write `reports/<page>/brief.md`)

Collect, from the user, the code, screenshots or data files, and ask only for what is missing:
- Mission: the one sentence that says what the user comes to do on this page, and the two or three jobs behind it in order of importance (for a cashier: know the cash to have in the drawer, close the day, find one order).
- Users: who, on what device, in what situation (noisy, one hand, in a hurry, once a day or fifty times a day).
- Data: every field the page shows or edits, its source, its volume (10 rows or 10 000), what changes in real time, what is computed and how.
- Actions: everything the user can do, with its consequences and its failure modes.
- Constraints: app navigation, brand, languages, offline, legal, existing components to reuse, what cannot change (a URL, an API, a report format).
- Current version, if any: what works, what users complain about, what is never used.

Do not invent data, users or complaints. If something is unknown, write "unknown" and ask.

## Phase 2: analysis (append to `brief.md`)

- Coherence of the mission with the data and the actions: what the page shows that nobody needs, what it needs that it does not show, actions without feedback, data without a source, two things that fight for the same place.
- Flow: the current path for each job, in steps and taps; the shortest path that still gives feedback at each step; what can be done in place instead of on another screen; what must stay a separate screen (a long form, a destructive confirmation, a detail with many fields).
- Split or merge: whether the mission needs one page or several (one page per job when the jobs happen at different moments or on different devices; one page when they are done together). Propose the minimum.
- Material components per job (`../material-design-3/references/components/_overview.md`) and the navigation pattern per window class (`references/foundations/layout.md`).

## Phase 3: proposals (write `reports/<page>/proposals.md`, then stop and ask)

Offer one to three options. Each option has: a name; the list of pages it creates with the mission of each; the information hierarchy of each page (what is visible without scrolling on a phone, what comes after, what is in a sheet or a dialog); the user flow for each job as a numbered list of steps; the Material components chosen and why; what it gains for the user and what it costs (more taps somewhere, a new screen to learn, data the back end must provide); a low-fidelity sketch as an ASCII wireframe or a quick HTML wireframe with grey boxes, 400px and 1280px.

State which option you recommend and why in two sentences. Then ask the user to validate one (with AskUserQuestion when it exists, otherwise in plain text) and wait. Do not build before the answer. If the user is away and said so, build the recommended option and mark the result "built on the recommended option, to confirm".

## Phase 4: build the validated option

Follow the main SKILL.md end to end: project structure, tokens from `DESIGN.md`, components from the references (reuse the stack first), every state, accessibility, head metadata, performance. Use the data from the brief; where real data is not available, use an explicit mock marked as such with realistic values (never figures that look real but are invented in the final product). Then run `check_material.py`, `e2e_smoke.mjs`, and the controller and tester passes from the main SKILL.md. Deliver the pages, `notes.md` (decisions, deviations, mocks), and a two-column table "job to do: steps before / steps after" so the user sees the gain.

## Rules

- The user validates the proposal before code. Always.
- Every element on the new page traces back to a job or a datum in the brief; nothing decorative, nothing "because the old page had it".
- One strong action per screen; secondary actions in text buttons, menus or sheets.
- Both themes, compact and expanded, loading, empty and error states, from the first build.
- If the current version is also given, finish with what the new version drops and why, so the user can object.
