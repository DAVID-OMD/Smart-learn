# PRD.md — SmartLearn (Product Requirements Document + Implementation Plan)

## 1. Product Name / Application Title
**Product Name: SmartLearn**
A minimal secondary-school learning prototype: one local page that opens in the browser, with mock data only.

## 2. Problem & Goal
Secondary-school students need quick, offline-friendly revision. Goal for this lesson: build a **minimal prototype** — a single local page that opens in the browser — plus design preview, all documented in a public GitHub repo for automated grading.

## 3. Tool Choice (AI coding tool used)
**AI coding tool: OpenCode** (this session).

## 4. Technical Choices (explicit, for grader)
- **Framework:** No framework — plain HTML + CSS + JavaScript (vanilla, no build step, no dependencies). Prototype runs by opening `index.html` directly.
- **Database:** No real database for the prototype. Mock data only: `practiceData` and `quizData` objects in `script.js` + browser `localStorage` keys `smartlearn-complete` and `smartlearn-scores` for progress. Future local option (Phase 2): SQLite running locally.
- **Authentication method:** Mock only — no real sign-in, no passwords, no tokens. Prototype has no login screen. Future: local mock username stored in `localStorage` only (never real credentials).
- **File storage:** Local file storage only. Static files in this repo (`index.html`, `styles.css`, `script.js`) plus browser `localStorage`. No cloud storage, no uploads, no `.env` files.
- **Local execution:** The app + DB will run **locally for now**. Open `index.html` in a browser. No server, no deployment, no external API required.

## 5. Implementation Plan — Ordered Phases with Concrete Outputs
- **Phase 0 — PRD & repo setup (output: `PRD.md` in repo root).** Define product, framework, database, auth, storage, local-run statement, and roadmap.
- **Phase 1 — Initial working local page [REACHED]. (output: `index.html` + `about.html` + `subjects.html` + `styles.css` + `script.js` that open via double-click).** Home page, subjects list with filter, practice sets, 3-question quizzes with instant feedback, progress bar + localStorage, dark mode, random picker. All mock data.
- **Phase 2 — Local persistence upgrade (output: same pages + SQLite file `smartlearn.db` accessed locally, still no server).** Move quiz/progress from `localStorage` to local SQLite; add mock login dropdown (test user only).
- **Phase 3 — Teacher editing (output: `admin.html` local-only page).** Add/edit quiz questions in local DB; export/import JSON.
- **Phase 4 — Optional share (output: docs only, no deployment required).** Instructions for running via a tiny local server (`python -m http.server`) if needed.

## 6. Phase Reached & Application Progress (for submission form)
**Reached Phase 1. Built a single local HTML page set with mock data that opens in the browser (`index.html`, `subjects.html` with filter + quizzes + progress saved in localStorage, `design.html` preview). No real sign-in, no real database. Next phase would be Phase 2: adding a local mock login and connecting a local SQLite database running locally.**

## 7. Agent Steering Note — Tool Choice (Task 1, item 4)
I steered OpenCode on **one tool choice: Database — localStorage vs SQLite for Phase 1**.
What I asked: "Explain the trade-off for a single-file offline school prototype: browser localStorage vs adding SQLite now?"
What I decided and why: **Stay with localStorage (mock) for Phase 1, defer SQLite to Phase 2.** Reason: localStorage needs zero install, works when opening `index.html` by double-click and via htmlpreview-style viewers, keeps the repo to 6 static files, and is enough for 4 subjects of mock progress/scores. SQLite would require a local runner/dependency and would break the "single local page, no server" constraint for the grader. This note documents the decision.

## 8. Agent Steering Note — Design Refinement (Task 2, item 4)
Exact refinement I told the agent to apply to `design.html` (and it is reflected in the file):
1. "Make the font clearer — use Arial/Helvetica, base body 18px, headings 32px/24px, line-height 1.6."
2. "Increase contrast — body text #1f2937 on #ffffff background, primary button white text on #1e40af navy, secondary section #dbeafe only for large headings, muted text darkened to #475569."
3. "Improve button styling — larger padding 0.75rem 1.4rem, bold 700 weight, 8px border-radius, visible hover (darken to #1e3a8a) and 3px focus outline for keyboard users."
The grader can compare this list against `design.html`: the preview uses Arial 18px, the listed hex colors, and the button/input styles described.

## 9. Mock Data & Safety Note
Test/mock data only. No real passwords, API keys, tokens, or `.env` files are in this repo or demo. Quiz content is placeholder school questions. `localStorage` holds only mock progress.

## 10. Repo Contents (what the grader should open)
- `PRD.md` — this file (plan + all agent-steering notes)
- `design.html` — visual preview (colors, typography, styled button, sample input), self-contained for htmlpreview.github.io
- `index.html` — prototype home page (opens locally)
- `subjects.html` — prototype subjects + quizzes
- `about.html`, `styles.css`, `script.js`, `README.md` — rest of prototype
- `db/schema.sql`, `db/seed.sql` — Phase 2 local SQLite design (mock only)
- Public repo: https://github.com/DAVID-OMD/Smart-learn

## 11. Phase 2 Progress Update (started)
- **Phase 2 — Local persistence upgrade [STARTED, prototype still local-only].** Added: mock user switcher in navbar (`Guest` / `Test Student` / `Demo Teacher`, test data only, no passwords) on all pages; per-user progress/scores namespaced in `localStorage` (`smartlearn-<user>-complete`, `smartlearn-<user>-scores`) with migration from Phase 1 global keys; local SQLite design files `db/schema.sql` (tables `users`, `progress`, `scores`) + `db/seed.sql` (mock seed). The real `smartlearn.db` file stays local-only and is never committed.
- **How to run Phase 2 locally for now:** double-click `index.html` (same as Phase 1). Optional local DB inspect: `sqlite3 smartlearn.db < db/schema.sql` then `sqlite3 smartlearn.db < db/seed.sql` — still local, no server, no deployment.
- **Submission status:** still satisfies Task 3 (single local page, mock data only). Next after Phase 2 full: Phase 3 `admin.html` teacher editing.

## 12. Phase 3 Progress Update (started)
- **Phase 3 — Teacher editing [STARTED, local-only page `admin.html`].** Added: add-question form (subject + question + 3 options + correct answer + explanation, validated by `isValidQuizItem`); custom question list per mock user with per-item delete and Delete All; Export JSON (refresh/copy/download `smartlearn-custom-quiz.json`); Import JSON (paste or `.json` file, validated, merged per mock user). Storage: `smartlearn-<user>-custom-quiz` in `localStorage`; subject quizzes now use `getQuizQuestions(subject)` = built-in `quizData` + custom, and best-score denominators follow. Built-in questions are never modified.
- **How to run:** double-click `admin.html` (or use navbar Admin link). Still local, no server, mock data only. Next after Phase 3: Phase 4 docs-only share notes.
