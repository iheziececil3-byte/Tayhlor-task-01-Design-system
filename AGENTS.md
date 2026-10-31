Tayhlor
Source of truth
The PRD is tayhlor_prd_v0.4.md in the repository. If that file is missing or is a different version, stop and ask.

Description
Tayhlor is a web application for one tailoring shop. It manages customer records, body measurements, clothing orders, payments, and order progress in one place. Customers submit orders, pay a 70% deposit after the tailor accepts and prices an order, and pay the 30% balance after the garment is ready and collected for fitting. An FAQ assistant answers only from tailor-approved documents. Success is measured by PRD Section 12, whose targets are proposed.

Users
Customer. Creates an account and verifies email. Keeps measurement records. Submits orders. Pays when payment is unlocked. Sees only their own orders and payments. Source: PRD 4.2, 6.3.
Tailor (admin). The shop owner, who is also the developer. Accepts or declines orders. Enters the quoted total and proposed completion date on acceptance. Updates progress. Views current measurement records of customers who have at least one order associated with the business, including completed and cancelled orders (may not view measurements of customers who have never placed an order). Monitors payments. Writes, uploads, and approves FAQ documents. Source: PRD 1, 4.2, FR-11.
Core responsibility
Show only recorded, verified information. Never invent or guess an order status, proposed completion date, payment confirmation, price, refund, or business fact. Verified business information is text in an approved FAQ document. Every FAQ answer must cite an approved document, or the assistant declines. Source: PRD 1, G3, FR-61, FR-62.

MVP scope
P0 is required for launch. P1 should be included for launch. P2 is later (PRD Section 6). MVP (v1):

Customer and tailor accounts with role-based access, for one shop per deployment.
Email and password sign-in, and Google sign-in. Email verification before ordering. Password reset by email (FR-03, P1).
Customer measurement records (create, edit, delete). Each order keeps a snapshot of its measurements.
Order submission, review, acceptance, decline, cancellation, and progress through defined statuses.
Deposit and balance payments through Paystack, confirmed only by server-side verification. Manual full refund after a cancellation that follows a successful deposit.
Customer dashboard with live status (FR-50), payment history (FR-43), and personal data export or deletion requests (FR-72, P1).
Tailor dashboard for orders, customers, and payments (FR-44). Tailor edits customer contact details, logged (FR-34, P1).
Customer email through Resend (FR-51): when an order is accepted or declined, a payment succeeds, the order is ready, or a refund is processed. AI FAQ assistant grounded in approved documents. Audit trail for status and payment changes.
Source: PRD 5.1, FR-03, FR-34, FR-72.

Not in scope for v1
Multi-tenant use, SaaS, or more than one tailoring business.
A marketplace or discovery of tailoring businesses.
Fabric and material inventory. Payroll, accounting, or tax filing.
Native iOS or Android apps. Responsive web only.
AI-generated price quotes. The tailor sets every price.
Real-time chat. Status reaches customers through the dashboard (FR-50) and email (FR-51).
Automated refunds. Refunds are processed manually.
Flutterwave or any second payment provider. Do not add one. PRD 13 asks to keep a provider adapter for later. Ask the owner how far to build it.
Image uploads for style references. Do not build them. Delivery of finished garments: collection for fitting only.
Tailor entry of cash or bank-transfer payments (FR-45, P2). Undecided. Do not build it until the owner decides (PRD Q1, 13).
Source: PRD 5.2, 6.5.

Stack
Framework: Next.js with the App Router and TypeScript. Locked.
ORM: Prisma. Locked.
Database: PostgreSQL with pgvector, hosted through Vercel. The provider is undecided (PRD Q12).
The v1 application uses one PostgreSQL database for development, test, preview, and production activity, as specified by the PRD. Test-data safeguards are mandatory: test records must be explicitly identifiable with a recordEnvironment marker that propagates to all related records (orders, payments, audit events); test operations must not modify, delete, or impersonate real customer records; test payment credentials must not be used to initiate transactions against real customer payment records; and test data must not be presented as genuine customer activity.
Runtime queries use a pooled connection. Migrations and the Prisma CLI use a direct connection (PRD 8.2).
Hosting: Vercel for the app and preview deployments.
Payments: Paystack only, in test mode (see Payment rules). Flutterwave is deferred.
Email: Resend. Requires a verified sending domain.
Sign-in library: undecided. Working assumption: Auth.js, with an app-owned verification step (PRD Q6).
Embeddings and FAQ answers: Google Gemini API, free tier. Models are confirmed at build time against Google's model list (PRD Q5, Q13). Ask the owner if unclear.
Vector search: pgvector in the same database as application data (PRD 9.2).
Orchestration: undecided. Vercel AI SDK or a custom layer in route handlers (PRD 7.3). Ask before choosing.
Password hashing: bcrypt or argon2 (PRD 8.2). Undecided. Ask before implementing.
Scheduled job: re-checks PENDING payments to catch missed webhooks. Frequency depends on the Vercel plan (PRD 8.3, Q9).
Locations named in the PRD
The PRD names these locations and no other folder:

Route handlers: /api/payments/*, /api/webhooks/*, /api/assistant (PRD 8.1).
Server components and server actions in the Next.js app. The auth module: session cookies, email and password, Google (PRD 8.1).
prisma.config.ts: holds the direct connection used by the Prisma CLI (PRD 8.5).
Migrations: written in Git. The PRD does not name their folder. Ask before creating migration files.
Work rules
Stop and ask when the PRD states no rule. If an Open Question has a working assumption, use it until the owner decides (PRD 14).
Do not run migrations or any SQL that changes the database. The owner runs migrations manually. The app never runs migrations at request time (PRD 8.2).
Section 10 holds SQL for the vector extension and index. Do not run it directly. Database structure changes reach the database only through migrations the owner runs (PRD 8.2, 10.1).
Every query filters by the business ID from the authenticated session, never from the request body (PRD 9.6). Customer queries also filter by the customer's own user ID (FR-70).
Every page and API route checks the caller's role. A customer calling a tailor route gets 403. Automated tests cover every route (FR-04).
Order and payment questions are answered from database records only. The language model never generates them (FR-63).
The language model never receives customer identity, order records, or payment data (PRD 7.2). Do not send customer identifiers to the Gemini API (PRD 9.6, FR-73).
Payment rules
Payment is unlocked only after the tailor accepts the order with a quoted total and proposed completion date (FR-31). If declined, no payment option appears (FR-32).
Deposit: 70% of the quoted total, calculated on the server and rounded to the minor unit. Payable when status is ACCEPTED and no deposit has succeeded (FR-40).
Work begins when the order moves to IN_PROGRESS. Starting work requires a successful deposit (PRD 8.4).
Balance: the quoted total minus the deposit, which is 30% of the quoted total. Payable only at READY_FOR_COLLECTION after the deposit succeeds (FR-42).
A payment becomes SUCCESSFUL only after a verified Paystack webhook and a server-side verify call with matching amount and currency. The browser redirect never confirms payment (FR-41).
Repeated webhooks have no effect and create no duplicate payments (FR-41, PRD 8.3).
Only one SUCCESSFUL payment per order and type is allowed. A FAILED attempt can be retried (PRD 8.5).
Currency is NGN. Money is stored as whole minor units, kobo (PRD 8.5).
Refund: the full amount paid. The tailor processes it manually in Paystack, records the payment as REFUNDED with a date, and logs it (FR-46). The refund timeframe is undecided (PRD Q4).
Paystack test credentials must remain active throughout development, integration testing, and pre-launch verification. Production credentials may only be configured after the required payment tests pass and the owner explicitly approves the production launch.
Order rules
Statuses: SUBMITTED, ACCEPTED, DECLINED, IN_PROGRESS, READY_FOR_COLLECTION, COMPLETED, CANCELLED.
Allowed moves: SUBMITTED to ACCEPTED, DECLINED, or CANCELLED. ACCEPTED to IN_PROGRESS, then READY_FOR_COLLECTION, then COMPLETED. ACCEPTED can also move to CANCELLED under the cancellation rules. No other moves are allowed (PRD 8.4, FR-33).
On acceptance, the tailor enters the exact quoted total and a proposed completion date, both required (FR-31). On decline, the tailor enters a reason the customer sees (FR-32).
COMPLETED needs a verified balance payment and a recorded fitting with outcome SATISFACTORY in the dedicated Fitting model (PRD 8.4, 8.5). A fitting marked ALTERATIONS_REQUIRED does not satisfy completion. The alteration workflow remains open.
Customer cancellation: allowed while SUBMITTED, with no payment involved. Allowed while ACCEPTED with a successful deposit, with a full refund (PRD 8.4). Cancelling an ACCEPTED order with no deposit is undecided, because FR-22 and PRD 8.4 differ. Ask the owner. Cancelling after work starts is not allowed (PRD Q3).
Tailor cancellation: the PRD allows it with a reason. The rule is open (PRD 4.2, Q2). Use the working assumption in Open questions until the owner decides.
Customers see status, quoted total, and proposed completion date for their own orders only (FR-21).
Every order status change and payment event is logged with actor attribution (USER with user ID, or SYSTEM with null user ID and source reference in note), time, and previous and new value. Logs are append-only (FR-33, FR-71).
Measurements, accounts, and privacy
Measurement values are in centimetres (FR-10). Working assumption for the standard fields: chest, waist, hip, shoulder, sleeve, inseam, and length (PRD Q7).
Each order keeps a snapshot of its measurements. Later edits or deletions do not change it (FR-20).
Sign-up collects full name, email, phone, and password, or uses Google. A duplicate email shows a clear message. A Google account links to an existing account only after confirmation (FR-01). Passwords are stored as a salted hash.
Unverified customers can sign in only to verify. Google sign-ins count as verified by Google (FR-05). Password reset links are single-use (FR-03).
A privacy notice appears at sign-up and in the footer. It states that order and payment data stay in the app, and that document text and FAQ questions go to Google. Check its wording against Google's terms before launch (FR-73).
On the Gemini free tier, Google may use the content to improve its products, and human reviewers may read it. The owner decides before a real-customer pilot whether to stay on the free tier (PRD Q13). Category-based retention and deletion policy applies; specific retention periods require owner approval and legal review (PRD Q8).
FAQ assistant rules
Answers come only from approved documents. Draft documents are never used (FR-61, FR-64). Every answer names its source document (FR-61).
Editing an approved document returns it to DRAFT and removes its chunks from search until the owner approves it again (FR-64, PRD 9.4).
Documents are split by heading, then paragraph. Each chunk keeps its document title (PRD 9.3).
Retrieval keeps only results above the similarity threshold (PRD 9.5). If no approved chunk passes, the assistant returns the decline response and does not call the language model (PRD 7.1).
Output that cites no source is replaced with the decline response (PRD 7.2).
The assistant does not answer from general knowledge. It does not promise dates, prices, or refunds unless the source says so (PRD 7.2).
Decline response, exact text: "I don't have a verified answer for that. Please ask the tailor directly," followed by the shop's contact details from the business record (FR-62).
Response time is a measured target (FR-60). Test it before each release (PRD 7.4).
Definitions
Order: a customer's request for a garment, from submission until it is COMPLETED, DECLINED, or CANCELLED.
Quoted total: the exact price the tailor enters on acceptance. The app never sets it.
Proposed completion date: the date the tailor enters on acceptance (FR-31).
Payment unlocked: the payment option is shown, because the rules in Payment rules are met.
Work begins: the order moves to IN_PROGRESS (PRD 8.4).
Fitting: a dedicated record (model Fitting) captured by the tailor with outcome SATISFACTORY or ALTERATIONS_REQUIRED. Completion requires a satisfactory fitting. Subsequent fittings may be recorded. Alteration workflow remains undecided (open).
Deposit: the first payment, 70% of the quoted total, paid before work begins.
Balance: the second payment, the quoted total minus the deposit (30%), paid after the garment is ready and collected for fitting.
Payment: one deposit or balance attempt, with status PENDING, SUCCESSFUL, FAILED, or REFUNDED.
Refund: the full amount paid, returned after a cancellation that follows a successful deposit.
Measurement snapshot: a copy of a customer's measurements stored with an order at submission.
Approved document: a FAQ source the tailor wrote or uploaded and approved. Other documents are DRAFT.
Chunk: a passage of an approved document, split by heading and then paragraph, stored with its document title (PRD 9.3).
Decline response: the fixed reply under FAQ assistant rules.
Audit log: an append-only record of every order status change (with USER or SYSTEM attribution) and payment event (FR-71). Preserved upon account deletion; actor references anonymised.
Priority: P0 (required for launch), P1 (should have), P2 (later). The PRD defines no product tiers. "Free tier" refers only to the Google Gemini API.
Rules files (.agents/rules/)
Non-negotiable (every project):

.agents/rules/security.md: access checks, secrets, input checks, dependencies, payment and record handling (FR-70, FR-71, PRD 9.6).
.agents/rules/database.md: migrations, connections, backups before risky changes (PRD 8.2, 10.1).
.agents/rules/command.md: allowed and forbidden commands, deploy approval, checks before done.
.agents/rules/env.md: environment variables, secret storage, test keys (PRD 8.1, 8.2).
.agents/rules/git.md: branches, no pushes to the main branch, no force pushes, no secret files in commits.
Tayhlor-specific:

.agents/rules/requirements.md: PRD Sections 5 and 6, measurements, notification triggers (FR-10, FR-20, FR-51).
.agents/rules/accounts-and-access.md: role matrix, sign-up, verification, sign-in (PRD 4.2, FR-01 to FR-05).
.agents/rules/order-lifecycle.md: statuses, moves, cancellation, audit events (PRD 8.4, FR-21 to FR-33, FR-71).
.agents/rules/payments.md: unlock gates, deposit, balance, verification, refunds (PRD 8.3, FR-40 to FR-46).
.agents/rules/data-model.md: record ownership, money units, snapshots, audit (PRD 8.5, 9.4).
.agents/rules/faq-assistant.md: FAQ pipeline, citations, decline text, vector rules, evaluation (PRD 7, 9, 10).
.agents/rules/privacy.md: privacy notice, Gemini free-tier disclosure, export and deletion, retention (FR-72, FR-73, PRD 9.6, Q8, Q13).
Until a rules file exists, the PRD is the source. Success metrics (Section 12) and risks (Section 13) stay in the PRD.

Self-check
Before finishing a change, confirm:

Every new query filters by the business ID from the session.
No payment is marked SUCCESSFUL from a browser redirect.
Customer queries return only that customer's records.
Every order status change writes an audit entry.
No migration was run and no database-changing command was executed.
No FAQ answer is shown without an approved source.
Nothing was built that the PRD lists as out of scope or undecided.
Open questions
Each has a working assumption that stays in effect until the owner decides (PRD 14).

Q1 Balance by Paystack, manual, or both: online via Paystack, with manual recording as fallback.
Q2 Tailor cancellation: cancel with a reason, with a manual full refund.
Q3 Customer cancellation after work starts: not allowed.
Q4 Manual refund timeframe: see PRD Q4.
Q5 Gemini model for answers: confirmed at build time.
Q6 Sign-in library: Auth.js.
Q8 Data retention and deletion: category-based policy adopted; statutory retention periods subject to owner approval and Nigerian legal review.
Q9 Scheduled job frequency: frequent if the Vercel plan allows, otherwise hourly.
Q11 Business model: undecided. Working assumption: portfolio scope, no revenue.
Q12 PostgreSQL provider: undecided. Any Vercel Marketplace PostgreSQL offering with pgvector is a candidate.
Q13 Gemini embedding model, output dimension, and free or paid tier: free tier for the build; candidate models verified (gemini-embedding-001 with MRL 768/1536/3072 or text-embedding-004 at 768), model and dimension choice open (PRD Q13).
Q14 Alteration workflow: tracking alteration progress and order statuses after an ALTERATIONS_REQUIRED fitting is open.
Not numbered: cancelling an ACCEPTED order with no deposit; how far to build the provider adapter; which event switches to live keys; password hashing algorithm; orchestration choice; migrations folder; rules file names.