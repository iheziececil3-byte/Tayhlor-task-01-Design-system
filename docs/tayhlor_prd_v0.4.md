# Tayhlor: Product Requirements Document

| Field | Detail |
|---|---|
| Product | Tayhlor, a web application for a single tailoring shop |
| Version | 0.4 (Draft for review) |
| Date | 30 October 2026 |
| Owner | Cecil Ihezie |
| Locked stack | Next.js (App Router), TypeScript, Prisma ORM, PostgreSQL with pgvector |
| Hosting | Vercel (app and preview deployments), PostgreSQL provisioned through Vercel (provider to be confirmed, see Section 14) |
| Third-party services | Paystack (payments, test mode until launch), Google Gemini free tier (embeddings and FAQ answers), Resend (email), Google sign-in |
| Status | Draft. Items in Open Questions must be resolved before build or pilot. |

---

## 1. Product Summary

Tayhlor is a web application that helps one tailoring shop manage customer records, body measurements, clothing orders, payments, and order progress in one place. It serves two user groups with separate interfaces and permissions. The shop owner (the tailor) also acts as the administrator and developer of the app.

- **Customers** create an account, verify their email, keep their measurement records, submit clothing orders, pay a 70% deposit after the tailor accepts an order, pay the 30% balance after the garment is ready and they have collected it for fitting, and track progress on a personal dashboard. An AI FAQ assistant answers common questions using only verified business information.
- **Tailors** review incoming orders, accept or decline them, quote the exact price and a completion timeframe for accepted orders, manage customer and order records, monitor payments, and update order progress.

The core rules:

1. A customer can pay only after the tailor has accepted the order and quoted a price and completion timeframe. If the order is declined, payment stays unavailable.
2. The deposit (70% of the quoted total) is paid before work begins.
3. The balance (30%) is paid after the garment is ready and the customer has come in for collection and fitting. The tailor then records the order as COMPLETED.

Tayhlor must show only reliable, recorded information: order status, completion timeframes, payment confirmations, and business details. It must never invent an answer.

---

## 2. Problem

Tailoring businesses coordinate most orders through direct contact. The brief describes the following pain points, which still need validation with real tailoring businesses:

1. **Customers chase updates.** Customers must call or message the tailor to learn whether an order was accepted, when it will be ready, and whether payment is due.
2. **Tailors track work in scattered places.** Measurements, order details, and payment status are spread across notes, chats, and memory, which makes it hard to see what is accepted, in progress, paid, or outstanding.
3. **Payment status is unclear.** Without a record of deposits and balances, both sides can disagree about what has been paid.
4. **Business information is repeated.** Tailors answer the same questions about services, pricing, and policies over and over.

**Validation needed:** Interview at least five tailoring businesses and ten of their customers to confirm these pain points and measure how much time is spent on status updates. For the bootcamp pilot, the single shop owned by the developer is the first test case.

---

## 3. Goals

| ID | Goal |
|---|---|
| G1 | Give the tailor one organised place for customers, measurements, orders, and payments. |
| G2 | Let customers place orders, receive decisions, pay, and track progress without contacting the tailor for each update. |
| G3 | Show only verified information. Order status, timeframes, payments, and business facts come from recorded data, never from guesses. |
| G4 | Protect customer data so each customer can access only their own records and orders. |

---

## 4. Users and Personas

### 4.1 Personas (illustrative)

**Customer: "Ada, the event guest."** Ada needs an outfit for a wedding in three weeks. She wants to order it, know when it will be ready, and pay without calling the shop each day.

**Tailor: "Mr. Okafor, the shop owner."** He runs a small workshop with two assistants. He wants to see new orders at a glance, accept only the work he can finish on time, and know who still owes money. He also maintains the app himself.

### 4.2 Roles and Permissions

| Capability | Customer | Tailor (admin) |
|---|---|---|
| Create account, verify email, and sign in (email and password, or Google) | Yes | Yes |
| Create and manage own measurement records | Yes | No |
| View customer measurements | No | Yes, for customers who have at least one order associated with the business (including completed and cancelled orders). Cannot view measurements of customers who have never placed an order. |
| Submit an order | Yes | No |
| View orders | Own orders only | All orders |
| Accept or decline an order | No | Yes |
| Cancel an order | While SUBMITTED (no payment involved) or while ACCEPTED before it enters IN_PROGRESS (no refund if no successful payment exists; full refund of the amount paid if a successful deposit exists). Not allowed once IN_PROGRESS. | Yes, with a reason (rule open, see Section 14) |
| Set quoted total and completion timeframe | No | Yes, on acceptance |
| Pay deposit and balance | Yes, when payment is unlocked | No |
| Monitor payment status | Own payments only | All payments |
| Update order progress | No | Yes |
| Write, edit, and approve FAQ source documents | No | Yes |
| Use FAQ assistant | Yes | No |

---

## 5. Scope

### 5.1 In Scope (v1)

- Customer and tailor accounts with role-based access
- Email and password sign-in, plus Google sign-in
- Email verification required before a customer can place an order
- Customer measurement records (create, edit, delete)
- Order submission, review, acceptance, decline, and cancellation
- Customer cancellation after payment, with a full refund processed manually
- Order progress tracking through defined statuses
- Deposit (70%) and balance (30%) payments through Paystack
- Payment verification and payment history
- Tailor dashboard for orders, customers, and payments
- Status notifications to customers by email (Resend)
- AI FAQ assistant grounded in tailor-approved business documents
- Audit trail for order status and payment changes
- One shop per deployment

### 5.2 Out of Scope (v1)

- Multi-tenant use, SaaS, or serving more than one tailoring business
- A marketplace or discovery of tailoring businesses
- Fabric and material inventory
- Staff payroll, accounting, or tax filing
- Native iOS or Android apps (responsive web only)
- AI-generated price quotes (the tailor sets every price)
- Real-time chat between customer and tailor (v1 uses order-level status messages)
- Automated refunds (refunds are processed manually in v1)
- Flutterwave or any second payment provider (considered after the pilot)
- Image uploads for style references (candidate for v2)
- Delivery of finished garments (v1 covers collection for fitting only)

---

## 6. Functional Requirements

**Priority key:** P0 = required for launch. P1 = should have for launch. P2 = later.

### 6.1 Accounts and Access

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-01 | Customer sign-up with full name, email, phone, and password, or with Google. | P0 | Account is created. Password is stored as a salted hash. A duplicate email shows a clear message. A Google account with a matching email links to the existing account after confirmation. |
| FR-02 | Sign-in and sign-out for both roles, with email and password or Google. | P0 | Valid credentials open the correct dashboard. Invalid credentials show a generic error. Sessions expire after a set period of inactivity. |
| FR-03 | Password reset by email. | P1 | Reset link is single-use and expires in 30 minutes. |
| FR-04 | Role-based access control on every page and API route. | P0 | A customer calling a tailor route receives a 403. Automated tests cover every route. |
| FR-05 | Email verification for email and password accounts. | P0 | An unverified customer can sign in to verify but cannot submit an order. The verification link is single-use and expires in 24 hours. Google sign-ins are treated as verified by Google. |

### 6.2 Measurements

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-10 | Customers create, edit, and delete measurement records. | P0 | Each record has a label, measurement values in centimetres, and a timestamp. Records appear only on the owner's dashboard. |
| FR-11 | The tailor views current measurement records of customers who have at least one order associated with the business. | P0 | The tailor may view the current measurement records of customers who have at least one order associated with the business, including completed and cancelled orders. The tailor may not view measurements belonging to customers who have never placed an order. Measurements are visible to the tailor admin only, and to no customer other than their owner. |

### 6.3 Orders (Customer)

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-20 | Customers submit an order with garment type, description, and a measurement record. | P0 | The order is created with status SUBMITTED. Measurement values are copied into the order as a snapshot, so later edits or deletions do not change it. No payment option appears. |
| FR-21 | Customers see a list and detail view of their own orders. | P0 | Status, quoted total, and proposed completion date come from the database. Customers see only their own orders. |
| FR-22 | Customers cancel an order. | P1 | A customer may cancel an order while SUBMITTED (no payment involved) or while ACCEPTED before it enters IN_PROGRESS. If no successful payment exists, the order is cancelled without a refund. If a successful deposit exists, the customer is entitled to a full refund of the amount paid, processed manually according to the approved refund procedure, and the customer sees the full refund amount and refund state. Once the order enters IN_PROGRESS, customer-initiated cancellation is no longer allowed. |

### 6.4 Orders (Tailor)

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-30 | The tailor sees an incoming-orders queue, filterable by status. | P0 | The queue lists all orders for the shop. |
| FR-31 | The tailor accepts an order by entering the exact quoted total and a proposed completion date. | P0 | Both fields are required. Status changes to ACCEPTED. The deposit becomes payable for the customer only after this step. |
| FR-32 | The tailor declines an order with a reason. | P0 | Status changes to DECLINED. The customer sees the reason. No payment option appears. |
| FR-33 | The tailor moves accepted orders through IN_PROGRESS, READY_FOR_COLLECTION, and COMPLETED. | P0 | Only the transitions in Section 8.4 are allowed. Each change is logged with actor, time, and optional note. COMPLETED is recorded after the balance has been paid and the customer has been fitted. |
| FR-34 | The tailor views and edits customer contact details. | P1 | Changes are logged in the audit trail. |

### 6.5 Payments

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-40 | Customers pay the 70% deposit after acceptance and before work begins. | P0 | Deposit amount is calculated on the server as 70% of the quoted total, rounded to the nearest minor unit. The pay button appears only when status is ACCEPTED and no deposit has succeeded. Customer is redirected to Paystack's checkout. |
| FR-41 | Payment is confirmed only after server-side verification. | P0 | Status becomes SUCCESSFUL only after a verified Paystack webhook and a server-side verify call. The amount and currency must match. Duplicate webhooks do not create duplicate payments. The browser redirect alone never confirms payment. |
| FR-42 | Customers pay the 30% balance after the garment is ready and collected for fitting. | P0 | Balance is payable only when status is READY_FOR_COLLECTION and the deposit has succeeded. Balance equals quoted total minus deposit. |
| FR-43 | Customers and the tailor view payment history. | P1 | Each payment shows type, amount, date, and status. Customers see their own payments only. |
| FR-44 | The tailor monitors outstanding deposits and balances across orders. | P0 | Dashboard lists every order with its deposit and balance status. |
| FR-45 | The tailor records a cash or bank-transfer payment manually. | P2 | Pending decision (see Open Questions). Any manual entry must be logged with the tailor's identity. |
| FR-46 | The tailor processes a refund for a cancelled order that has a successful deposit. | P0 | The refund is recorded on the payment with status REFUNDED and a date. Refund amount equals the full amount paid. Refunds are processed manually in Paystack and logged. |

### 6.6 Progress and Notifications

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-50 | Customers see live order status on their dashboard. | P0 | Status updates appear without a manual refresh or within a defined polling interval. |
| FR-51 | Customers receive an email when an order is accepted or declined, when a payment succeeds, when the order is ready, and when a refund is processed. | P1 | Email is sent within five minutes of the status change, through Resend. |

### 6.7 AI FAQ Assistant

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-60 | Customers ask FAQ questions in plain language. | P0 | Answer is returned within five seconds for 95% of questions. |
| FR-61 | Answers are grounded in approved business documents and cite their source. | P0 | Every answer names the source document. Draft documents are never used. |
| FR-62 | The assistant declines to answer when no verified source exists. | P0 | Response says: "I don't have a verified answer for that. Please ask the tailor directly," and shows the shop's contact details from the business record. |
| FR-63 | Order and payment questions are answered from database records only. | P0 | Example: "Is my order ready?" returns the stored status and last-updated time. The language model never generates these answers. |
| FR-64 | The tailor creates, edits, and approves FAQ source documents. | P0 | Only approved documents are indexed. Editing an approved document returns it to draft until re-approved. |

### 6.8 Privacy and Audit

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-70 | Customers access only their own records. | P0 | Automated tests confirm that requests for another customer's order, measurement, or payment return 404 or 403. |
| FR-71 | Every order status change and payment event is logged. | P0 | Log stores actor attribution (`actorType`: USER with user ID, or SYSTEM with null ID and source reference), timestamp, previous and new value. Logs are append-only and immutable. |
| FR-72 | Customers can request export or deletion of their personal data. | P1 | Fulfilled under a category-based retention and deletion policy: personal profile details are anonymised or deleted once active orders reach a terminal state (COMPLETED/CANCELLED); financial and order records are preserved for statutory compliance with direct personal identifiers minimised; standalone measurements are deleted while order snapshots are retained; append-only audit events are preserved with anonymised actor references; and backup restores re-apply deletions from a tombstone log. Specific retention periods are OPEN for owner and legal review under Nigerian law (Section 14 Q8). |
| FR-73 | A privacy notice states that order and payment data stay in the app, and that document text and FAQ questions are sent to Google for embeddings and answer generation. If the Gemini free tier is used (Q13), the notice also states that Google may use that content to improve its products. | P0 | The notice is visible at sign-up and in the footer. Its wording is checked against Google's terms in effect before launch. |

---

## 7. AI and AI-Related Tools and Solutions

### 7.1 FAQ Assistant Pipeline

The assistant uses retrieval-augmented generation (RAG). It answers only from tailor-approved documents.

1. **Ingest.** The tailor writes or uploads a document (for example, "Services and Pricing" or "Deposit and Collection Policy"). The tailor approves it.
2. **Chunk and embed.** On approval, the system splits the document into chunks and creates an embedding for each. See Section 9.
3. **Route the question.** The system classifies the question. Order-status and payment questions go to a database lookup (FR-63). Everything else goes to retrieval.
4. **Retrieve.** The question is embedded and matched against approved chunks for the shop. The top results above a similarity threshold are kept.
5. **Decide.** If no chunk passes the threshold, the assistant returns the decline response (FR-62) and does not call the language model.
6. **Generate.** The language model receives only the retrieved chunks and the question. It is instructed to answer only from those chunks and to name the source document.
7. **Log.** The question, answer, source chunk IDs, and a grounded flag are stored for review.

### 7.2 Guardrails

- The language model never receives customer identity, order records, or payment data. Those are handled by deterministic lookups.
- The system prompt forbids answering from general knowledge and forbids promising dates, prices, or refunds unless the source says so.
- Output that cites no source is replaced with the decline response.

### 7.3 Models and Tools

| Component | Decision | Status |
|---|---|---|
| Language model | Google Gemini on the Gemini API free tier. Requirements: low latency, support for system instructions, and acceptable cost per conversation. Specific model confirmed at build time (Q5). | Provider decided. Model open (Q5). |
| Embedding model | Google Gemini embedding model on the Gemini API free tier (candidate models: `gemini-embedding-001` or `text-embedding-004`). Requires `RETRIEVAL_DOCUMENT` for chunks and `RETRIEVAL_QUERY` for questions. Column size matches verified model dimension. | Provider decided. Model and dimension open (Q13). |
| Orchestration | Vercel AI SDK or a thin custom layer in Next.js route handlers. | Proposed |
| Evaluation | A test set of 50 questions for the shop covering answerable, unanswerable, and trap questions. | Proposed |

### 7.4 Evaluation

- **Before each release**, run the 50-question set. Target: 100% of answers either cite an approved source or decline. Zero fabricated prices, dates, or policies.
- **In production**, sample 5% of grounded answers each week for review.
- **Track** decline rate. A rising decline rate usually means the tailor needs to add documents.

---

## 8. Technical Architecture

### 8.1 System Overview

```
 Browser (customer / tailor)
        |
        v
 Next.js App on Vercel (App Router, TypeScript)
   |- Server Components and Server Actions
   |- Route Handlers: /api/payments/*, /api/webhooks/*, /api/assistant
   |- Auth module (session cookies, email and password, Google)
        |
        +--> Prisma ORM --> PostgreSQL (+ pgvector)
        |        (runtime: pooled connection; migrations: direct connection)
        |
        +--> Paystack (test credentials active throughout development, testing, and pre-launch; production credentials configured only after payment tests pass and owner approves launch)
        |        ^
        |        | webhook (signed)
        +--------+
        |
        +--> Google Gemini (embeddings) and language model provider
        |
        +--> Resend (verification, password reset, order emails)
```

### 8.2 Key Technology Choices

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js (App Router) with TypeScript | Locked by owner. Server-side logic lives next to the UI. |
| ORM | Prisma | Locked by owner. Type-safe queries and migrations. |
| Database | PostgreSQL with pgvector, hosted through Vercel | PostgreSQL and pgvector locked by owner. The host must support pgvector, a pooled connection string, and a direct connection string. One database serves development, test, preview, and production activity in v1 with mandatory test-data identification (`recordEnvironment` marker propagation) and customer record protection safeguards. |
| Database access | Runtime uses a pooled connection string through Prisma. Migrations and the Prisma CLI use a direct connection string. Exact variable names follow the chosen host. | Pooling suits Vercel's serverless functions. The direct connection suits migrations. |
| Schema changes | Migrations are written in Git and run manually by the owner. The app never runs migrations at request time. | Owner's decision. Keeps schema changes deliberate. |
| Authentication | Pending decision (see Open Questions). Must support email and password, Google sign-in, and email verification. Passwords hashed with bcrypt or argon2. | Requirements set by owner. |
| Email | Resend | Owner's decision. Requires a verified sending domain. |
| Embeddings | Google Gemini embedding model on the free tier | Owner's decision. Free tier content may be used by Google to improve its products (Q13). The embedding dimension must match the vector column. |
| Language model | Google Gemini on the free tier | Owner's decision. Free tier terms apply to answers as well (Q13). Specific model confirmed at build time (Q5). |
| Payments | Paystack only, as a custom integration | Owner's decision. Flutterwave is deferred until after the pilot. Lovable's built-in payments use Stripe or Paddle, so this is a custom build. |
| Hosting | Vercel for the app and preview deployments; PostgreSQL through Vercel | Decided. Database provider to be confirmed (Section 14). |

### 8.3 Payment Flow

1. Customer selects "Pay deposit" on an ACCEPTED order.
2. Server creates a Payment record with status PENDING, a unique reference, and an amount calculated on the server.
3. Server calls Paystack's initialise endpoint and returns the checkout URL.
4. Customer pays on Paystack's hosted page.
5. Paystack sends a signed webhook. The server verifies the signature.
6. Server calls Paystack's verify endpoint with the reference, then checks that the amount and currency match.
7. If everything matches, Payment becomes SUCCESSFUL and the order's payment state updates. The handler is idempotent, so repeated webhooks have no effect.
8. The customer's return page reads status from the database, not from URL parameters.

A scheduled job re-checks PENDING payments older than 15 minutes. This catches missed webhooks. The schedule depends on the Vercel plan (see Section 14).

### 8.4 Order State Machine

```
SUBMITTED --accept--> ACCEPTED --start work--> IN_PROGRESS --ready--> READY_FOR_COLLECTION --balance paid, fitted--> COMPLETED
    |                    |
    |--decline--> DECLINED
    |--cancel (customer, no payment)--> CANCELLED
    |                    |--cancel (customer, before IN_PROGRESS: no refund if no payment; full refund if deposit paid)--> CANCELLED
    |                    |--cancel (tailor, reason required; rule open)--> CANCELLED
```

Payment and cancellation rules that sit on top of the state machine:

- **Deposit** is payable when status is ACCEPTED and no deposit has succeeded.
- **Start work (IN_PROGRESS)** requires a successful deposit.
- **Customer cancellation:** A customer may cancel an ACCEPTED order before it enters IN_PROGRESS. If no successful payment exists, the order is cancelled without a refund. If a successful deposit exists, the customer is entitled to a full refund of the amount paid, processed manually according to the approved refund procedure. Once an order enters IN_PROGRESS, customer-initiated cancellation is no longer allowed.
- **Balance** is payable when status is READY_FOR_COLLECTION and the deposit has succeeded.
- **COMPLETED** requires both: 1) a verified balance payment (status SUCCESSFUL confirmed server-side), and 2) a recorded collection and fitting by the tailor with outcome SATISFACTORY in the dedicated `Fitting` model. A fitting marked ALTERATIONS_REQUIRED does not satisfy completion.
- **Alterations:** When a fitting records ALTERATIONS_REQUIRED, an order cannot be COMPLETED until alterations are made and a subsequent fitting is recorded as SATISFACTORY. The specific alteration workflow (how alteration stages are tracked, order status transitions, and customer notifications) is OPEN (Section 14 Q14).
- **Refunds** after cancellation are full refunds of the amount paid, processed manually in v1.

### 8.5 Prisma Data Model

```prisma
generator client {
  provider = "prisma-client-js"
}

// Connection strings come from the chosen PostgreSQL host.
// A pooled connection string is used at runtime through Prisma's adapter for that host.
// A direct connection string is used by the Prisma CLI for migrations, configured in prisma.config.ts.
datasource db {
  provider = "postgresql"
}

enum Role {
  CUSTOMER
  TAILOR
}

enum ActorType {
  USER
  SYSTEM
}

enum OrderStatus {
  SUBMITTED
  ACCEPTED
  DECLINED
  IN_PROGRESS
  READY_FOR_COLLECTION
  COMPLETED
  CANCELLED
}

enum FittingOutcome {
  SATISFACTORY
  ALTERATIONS_REQUIRED
}

enum PaymentType {
  DEPOSIT
  BALANCE
}

enum PaymentStatus {
  PENDING
  SUCCESSFUL
  FAILED
  REFUNDED
}

enum DocStatus {
  DRAFT
  APPROVED
}

// v1 is one shop per deployment. The table is kept so every record is scoped.
model Business {
  id        String   @id @default(cuid())
  name      String
  phone     String?
  address   String?
  createdAt DateTime @default(now())

  users     User[]
  orders    Order[]
  documents BusinessDocument[]
  chunks    KnowledgeChunk[]
}

model User {
  id                String             @id @default(cuid())
  email             String             @unique
  passwordHash      String?            // null for Google-only accounts
  googleSubject     String?            @unique
  emailVerifiedAt   DateTime?          // required before a customer can order
  fullName          String
  phone             String?
  role              Role
  businessId        String
  createdAt         DateTime           @default(now())

  business          Business           @relation(fields: [businessId], references: [id])
  measurements      Measurement[]
  customerOrders    Order[]            @relation("CustomerOrders")
  statusEvents      OrderStatusEvent[]
  recordedFittings  Fitting[]          @relation("RecordedFittings")
  assistantMessages AssistantMessage[]
}

model Measurement {
  id         String   @id @default(cuid())
  customerId String
  label      String
  values     Json     // e.g. { "chest": 96, "waist": 82, "hip": 100 } in cm
  takenAt    DateTime @default(now())
  updatedAt  DateTime @updatedAt

  customer   User     @relation(fields: [customerId], references: [id], onDelete: Cascade)
  orders     Order[]
}

model Order {
  id                   String             @id @default(cuid())
  businessId           String
  customerId           String
  measurementId        String?
  garmentType          String
  description          String
  status               OrderStatus        @default(SUBMITTED)
  measurementSnapshot  Json               // copied at submission
  quotedAmount         Int?               // minor units (kobo), set on acceptance
  currency             String             @default("NGN")
  proposedCompletionAt DateTime?
  declineReason        String?
  cancelReason         String?
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt

  business             Business           @relation(fields: [businessId], references: [id])
  customer             User               @relation("CustomerOrders", fields: [customerId], references: [id])
  measurement          Measurement?       @relation(fields: [measurementId], references: [id], onDelete: SetNull)
  statusEvents         OrderStatusEvent[]
  payments             Payment[]
  fittings             Fitting[]

  @@index([businessId, status])
  @@index([customerId])
}

model OrderStatusEvent {
  id          String       @id @default(cuid())
  orderId     String
  actorType   ActorType    @default(USER)
  actorId     String?      // required for USER events; MUST be null for SYSTEM events
  fromStatus  OrderStatus?
  toStatus    OrderStatus
  note        String?      // stores user notes or system origin (e.g. Paystack webhook event ID)
  createdAt   DateTime     @default(now())

  order       Order        @relation(fields: [orderId], references: [id], onDelete: Cascade)
  actor       User?        @relation(fields: [actorId], references: [id])

  // Application validation & database CHECK constraint enforce:
  // (actorType = 'USER' AND actorId IS NOT NULL) OR (actorType = 'SYSTEM' AND actorId IS NULL)

  @@index([orderId])
  @@index([actorId])
}

model Fitting {
  id          String         @id @default(cuid())
  orderId     String
  recordedBy  String         // User.id of the tailor who recorded the fitting
  outcome     FittingOutcome
  notes       String?
  fittedAt    DateTime       // date and time the fitting took place
  createdAt   DateTime       @default(now())

  order       Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  recorder    User           @relation("RecordedFittings", fields: [recordedBy], references: [id])

  @@index([orderId])
  @@index([recordedBy])
}

model Payment {
  id                String        @id @default(cuid())
  orderId           String
  type              PaymentType
  amount            Int           // minor units
  currency          String        @default("NGN")
  provider          String        @default("paystack")
  providerReference String        @unique
  providerTxId      String?
  status            PaymentStatus @default(PENDING)
  paidAt            DateTime?
  refundedAt        DateTime?
  createdAt         DateTime      @default(now())

  order             Order         @relation(fields: [orderId], references: [id])

  @@index([orderId, type, status])
}

model BusinessDocument {
  id          String    @id @default(cuid())
  businessId  String
  title       String
  content     String
  status      DocStatus @default(DRAFT)
  approvedAt  DateTime?
  updatedAt   DateTime  @updatedAt

  business    Business         @relation(fields: [businessId], references: [id])
  chunks      KnowledgeChunk[]
}

model KnowledgeChunk {
  id         String                 @id @default(cuid())
  documentId String
  businessId String
  chunkIndex Int
  content    String
  embedding  Unsupported("vector")? // Exact dimension matches confirmed Gemini embedding model configuration (OPEN, Q13)

  document   BusinessDocument       @relation(fields: [documentId], references: [id], onDelete: Cascade)
  business   Business               @relation(fields: [businessId], references: [id])

  @@unique([documentId, chunkIndex])
  @@index([businessId])
}

model AssistantMessage {
  id             String   @id @default(cuid())
  userId         String
  question       String
  answer         String
  sourceChunkIds String[]
  grounded       Boolean
  createdAt      DateTime @default(now())

  user           User     @relation(fields: [userId], references: [id])
}
```

**Modelling notes:**

- v1 serves one shop, so `Business` holds one row. Every record is still scoped by `businessId`.
- Only one SUCCESSFUL payment per order and type is allowed. This is enforced in the service layer inside a transaction, because a failed attempt must be allowed to retry.
- `Order.measurementSnapshot` keeps the measurements used for each order, so later changes to a customer's record do not alter an order.
- Monetary values are stored as integers in minor units (kobo) to avoid rounding errors.
- Google-only accounts have no `passwordHash`. Email and password accounts stay unverified until `emailVerifiedAt` is set.
- `OrderStatusEvent.actorType` distinguishes human-initiated actions (`USER`, requiring a valid `actorId`) from automated and third-party actions (`SYSTEM`, requiring `actorId` to be null). System event triggers (e.g. Paystack webhook event ID) are recorded in `note`.
- Customer account deletion does not cascade to `Order`, `Payment`, or `OrderStatusEvent` records. Personal profile data is anonymised while preserving primary keys to maintain referential integrity, financial audit trails, and append-only event logs.
- `Fitting` tracks individual fitting sessions per order with outcomes `SATISFACTORY` or `ALTERATIONS_REQUIRED`. `COMPLETED` requires a verified balance payment and a fitting outcome of `SATISFACTORY`. Alteration workflows are OPEN.
- The `KnowledgeChunk.embedding` column dimension must match the confirmed Google Gemini embedding model output dimension (OPEN, Q13). Pre-storage dimension validation is enforced.

---

## 9. Vector Database Architecture and Design

### 9.1 Purpose

The vector store holds embeddings of tailor-approved business documents. It lets the FAQ assistant find the passages relevant to a question. It stores no customer data, orders, or payments.

### 9.2 Architecture

- **Engine:** PostgreSQL with the `pgvector` extension, in the same database as the application data. One database means one set of backups and one access-control model.
- **Embeddings:** Google Gemini embedding model on the free tier (model and dimension OPEN, see Section 14 Q13; candidate models: `gemini-embedding-001` with native dimension 3072 and Matryoshka output_dimensionality of 1536 or 768, or `text-embedding-004` with native dimension 768). Document chunks are indexed with `task_type="RETRIEVAL_DOCUMENT"`, and user questions are embedded with `task_type="RETRIEVAL_QUERY"`. The PostgreSQL `vector` column must match the verified output dimension. The application must validate embedding vector dimensions before storage. Changing the model or dimension requires re-embedding all approved documents and a schema migration. Zero-padding or silent truncation of vectors is strictly prohibited.
- **Index:** HNSW index on the `embedding` column, using cosine distance. HNSW is suitable at this scale and does not need periodic rebuilding.
- **Scale assumption:** The shop has tens to low hundreds of documents, producing a few thousand chunks at most. Performance is not a constraint at this volume.

### 9.3 Chunking Strategy

- Split by heading first, then by paragraph.
- Target 300 to 500 tokens per chunk, with 50 tokens of overlap.
- Each chunk keeps its document title so the assistant can cite it.
- Documents are re-chunked on every approval. Old chunks are deleted in the same transaction.

### 9.4 Indexing Lifecycle

| Event | Action |
|---|---|
| Tailor approves a document | Chunk, embed, and write chunks. Delete old chunks for that document. |
| Tailor edits an approved document | Document returns to DRAFT. Its chunks are removed from search immediately. |
| Tailor deletes a document | Cascade delete removes its chunks. |
| Embedding model changes | Re-embed all approved documents using the new compatible configuration. Vector dimension change requires a migration before searches can be performed. |

Only chunks whose parent document is APPROVED are eligible for retrieval. The query filters on both `businessId` and document status.

### 9.5 Retrieval

- Return the top 4 chunks by cosine similarity.
- Discard chunks below a similarity threshold. The starting threshold is 0.75. Similarity scores differ between embedding models, so the threshold must be re-tuned for the Gemini model during evaluation (Section 7.4).
- If no chunk passes, the assistant declines (FR-62).

### 9.6 Security

- Every query includes a `businessId` filter taken from the authenticated session, never from the request body.
- Google Gemini receives document text, retrieved chunks, and questions only, for embeddings and answers. No customer identifiers are sent. The privacy notice discloses this (FR-73). On the free tier, Google may use this content to improve its products, and human reviewers may read it (Q13).

---

## 10. Vector Database Model

### 10.1 SQL Definition

```sql
CREATE EXTENSION IF NOT EXISTS vector;

-- Created by Prisma migration for KnowledgeChunk, then extended with:
CREATE INDEX IF NOT EXISTS knowledge_chunk_embedding_hnsw
  ON "KnowledgeChunk"
  USING hnsw (embedding vector_cosine_ops);
```

### 10.2 Record Shape

| Field | Type | Notes |
|---|---|---|
| id | text (cuid) | Primary key |
| documentId | text | Parent BusinessDocument, cascade delete |
| businessId | text | Denormalised for filtering |
| chunkIndex | integer | Position within the document; unique per document |
| content | text | Chunk text, including the document title as a prefix |
| embedding | vector(dim) | Exact dimension matches confirmed Gemini embedding model configuration (OPEN, Q13; candidate dimensions: 768, 1536, 3072). Validated pre-storage. |

### 10.3 Retrieval Query (Pseudocode)

```sql
SELECT c.id, c.content, d.title, 1 - (c.embedding <=> $1) AS similarity
FROM "KnowledgeChunk" c
JOIN "BusinessDocument" d ON d.id = c."documentId"
WHERE c."businessId" = $2
  AND d.status = 'APPROVED'
ORDER BY c.embedding <=> $1
LIMIT 4;
```

`$1` is the question embedding. `$2` is the business ID from the session.

---

## 11. Business Model

**Status: Undecided.** The brief does not specify how Tayhlor earns revenue. Options:

| Option | How it works | Trade-off |
|---|---|---|
| Monthly subscription for the shop | Fixed fee for access | Predictable revenue; requires proof of value before the tailor pays |
| Per-transaction fee | Small percentage on each deposit and balance | Aligns with usage; requires trust in the payment flow |
| One-time setup fee | Fee for onboarding and catalogue setup | Easy to sell; no ongoing revenue |
| No revenue (bootcamp scope) | Build as a portfolio project | No commercial risk; no monetisation work needed |

**Working assumption:** Payment-provider fees are charged to the shop. Tayhlor charges nothing in v1 unless the owner decides otherwise.

**Decision needed before pilot.**

---

## 12. Success Metrics

Targets marked "proposed" should be confirmed in a pilot. Set baselines before launch.

| Metric | Definition | Target | Source |
|---|---|---|---|
| Decision time | Median time from SUBMITTED to ACCEPTED or DECLINED | Under 24 hours (proposed) | Order events |
| Deposit conversion | Share of accepted orders with a successful deposit within 48 hours | 80% (proposed) | Payments |
| Status enquiries | Customer messages asking for order status, per week | 50% reduction versus pilot baseline | Shop message count |
| Payment accuracy | Successful payments matched to a verified Paystack transaction | 100% | Reconciliation job |
| Data isolation | Cross-customer access incidents | 0 | Automated tests and logs |
| Grounded answers | FAQ answers that cite an approved source or decline | 100% | Evaluation set and weekly sample |
| Assistant usefulness | Share of questions answered from a source | Set after pilot baseline | AssistantMessage |
| Repeat usage | Customers placing a second order within 90 days | Set after pilot baseline | Orders |

---

## 13. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Missed or duplicate payment webhooks leave orders in the wrong state | Medium | High | Signature checks, idempotent handlers, server-side verify call, scheduled reconciliation of PENDING payments |
| Paystack has an outage or no second provider exists | Low to medium | High | Show payment status clearly; keep a provider adapter so Flutterwave can be added after the pilot; the tailor can record a manual payment (FR-45) if needed |
| Paystack live-account approval takes longer than planned | Medium | Medium | Paystack test credentials must remain active throughout development, integration testing, and pre-launch verification. Production credentials may only be configured after the required payment tests pass and the owner explicitly approves the production launch. |
| FAQ assistant states unverified information | Medium | High | Retrieval-only answers, decline threshold, source citation, evaluation before each release |
| Customer data exposed to another customer | Low | Critical | Server-side access checks on every query, automated tests, row filtering by customer ID |
| Test and live data mixed in one database | High (accepted risk in v1) | Medium | The v1 application uses one PostgreSQL database for development, test, preview, and production activity. Mandatory safeguards: 1) Test records must be explicitly identifiable with a recordEnvironment marker that propagates to all related records (orders, payments, audit events). 2) Test operations must not modify, delete, or impersonate real customer records. 3) Test payment credentials must not be used to initiate transactions against real customer payment records. 4) Test data must not be presented as genuine customer activity. 5) Run migrations manually and carefully. |
| Manual refunds are slow and customers chase them | Medium | Medium | Log refund requests with a target timeframe (see Open Questions); send a refund email (FR-51) |
| Tailors do not adopt the workflow | Medium | High | Pilot with one shop, run onboarding sessions, keep tailor actions to a few taps |
| Dispute over when the balance is due | Low | Medium | State balance terms clearly on each order and in the FAQ: balance after the garment is ready and collected for fitting |
| Scope exceeds the bootcamp timeline | High | High | Build P0 items first; defer P1 and P2 |
| Personal data handled without a clear policy | Medium | High | Category-based retention/deletion policy; anonymise personal data upon request while preserving statutory financial/audit records and relational integrity; handle backup expiration and restore re-application via tombstone logs; specific retention periods open for legal review (Q8) |
| Free tier terms let Google use submitted content, and free tier requests are rate limited | Medium | Medium | Disclose free tier use in the privacy notice (FR-73); decide the tier before the pilot (Q13); retry rate-limited requests during indexing |

---

## 14. Open Questions

These must be answered before build or pilot. Each has a working assumption that stays in effect until the owner decides otherwise.

| # | Question | Working Assumption |
|---|---|---|
| 1 | Is the balance paid online through Paystack, recorded manually by the tailor, or both? | Online, via Paystack, with manual recording as a fallback (FR-45, P2) |
| 2 | Can the tailor cancel an accepted order, and how is a paid deposit refunded in that case? | Tailor cancels with a reason. Full refund processed manually. Customer cancellation after payment is already decided: full refund. |
| 3 | Can a customer cancel after work has started (IN_PROGRESS)? | No. Cancellation is allowed only before work starts. |
| 4 | What is the refund timeframe for manual refunds? | Within 7 days of the cancellation. |
| 5 | Which Gemini model writes FAQ answers? | Google Gemini on the same free tier as embeddings (Q13). The specific model is confirmed at build time against the requirements: low latency (FR-60) and support for system instructions. Free tier terms in Q13 apply to answer generation. |
| 6 | Which authentication library or approach is used? | Auth.js with email and password and Google, plus a verification step owned by the app. |
| 7 | Which measurements are captured for each garment type? | Standard set: chest, waist, hip, shoulder, sleeve, inseam, length |
| 8 | How long is personal data kept, and how are deletion requests handled? | Category-based retention and deletion policy adopted: customer profile data is anonymised upon verified request when all orders are terminal; financial and order records are preserved for statutory compliance with direct personal identifiers minimised; standalone measurements are deleted while order snapshots are retained; append-only audit events are preserved with anonymised actor references; backups expire on schedule and database restores re-apply deletions from a tombstone log. Specific statutory retention periods remain OPEN pending owner approval and legal review under applicable Nigerian law (NDPA 2023, CAMA). |
| 9 | How often do scheduled jobs run, given the Vercel plan? | Every 15 minutes if the plan allows it, otherwise hourly. |
| 10 | Is delivery of finished garments needed in v1? | No. Collection for fitting only. |
| 11 | What is the business model? | Undecided. Working assumption: bootcamp portfolio scope with no revenue. |
| 12 | Which PostgreSQL provider sits behind Vercel? | Undecided. Any PostgreSQL offering from Vercel's Marketplace that supports pgvector is a candidate. The choice sets the exact connection variable names and the Prisma adapter. |
| 13 | Which Gemini embedding model and output dimension are used, and should the pilot stay on the free tier? | OPEN. Free tier for the build. Verified candidates from Google documentation: 1) `gemini-embedding-001` (default 3072 dimensions, supports Matryoshka output_dimensionality of 1536 or 768); 2) `text-embedding-004` (native 768 dimensions). Document indexing requires `task_type="RETRIEVAL_DOCUMENT"` and queries require `task_type="RETRIEVAL_QUERY"`. The previous 1536 assumption carried over from OpenAI is deprecated; the exact Gemini model, configured output dimension, and matching pgvector column size must be chosen by the owner before finalising migration or storing vectors. Moving to the paid tier before a real-customer pilot remains open. |
| 14 | How is alteration work initiated, tracked, and transitioned after an ALTERATIONS_REQUIRED fitting? | OPEN. The `Fitting` model records multiple fittings with outcomes SATISFACTORY or ALTERATIONS_REQUIRED. An outcome of ALTERATIONS_REQUIRED blocks order completion until a subsequent fitting is SATISFACTORY. The internal workflow for tracking alteration stages, whether order status remains READY_FOR_COLLECTION or loops, and customer notifications during alterations remain open for owner decision. |

**Decided since v0.1 (for reference):** single shop, not multi-tenant (formerly Q6); Paystack only, Flutterwave after the pilot (formerly Q8); currency NGN (formerly Q7); PostgreSQL hosted through Vercel (formerly Q10); the specific provider is open (see Q12); deposit required before work starts and balance required before COMPLETED (formerly Q3 and Q4); tailor sets the exact quoted total (formerly Q2); email for notifications (formerly Q12); tailor is the admin who writes and approves FAQ documents (formerly Q16); no reference images in v1 (formerly Q14); Google Gemini free tier for embeddings, replacing OpenAI text-embedding-3-small (v0.4; model and dimension open, see Q13); Google Gemini free tier for FAQ answers (v0.4; model open, see Q5); email verification required; Google sign-in included; dedicated `Fitting` model with outcomes SATISFACTORY / ALTERATIONS_REQUIRED before COMPLETED; `actorType` enum (USER, SYSTEM) for audit event attribution; category-based data retention and deletion policy.

---

## Document Control

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | 29 October 2026 | Cecil Ihezie | First draft from the refined product idea and stack decisions |
| 0.3 | 30 October 2026 | Cecil Ihezie | Single shop, Paystack only, PostgreSQL through Vercel with pooled and direct connection strings, one database with manual migrations, email verification and Google sign-in, deposit and balance timing, full refund on cancellation after payment, OpenAI embeddings, Resend email, refreshed open questions |
| 0.4 | 30 October 2026 | Cecil Ihezie | Embeddings changed from OpenAI text-embedding-3-small to Google Gemini free tier. Updated header, FR-73, Sections 7.3, 8.1, 8.2, 8.5, 9.2, 9.5, 9.6, 10.2, 13, 14 (Q5, new Q13) and the decided list. Gemini chosen for FAQ answers (Q5). Dimension kept at 1536 as a working assumption. |
| 0.5 | 31 October 2026 | Cecil Ihezie | Resolved cross-examination issues 7-10: actorType enum (USER/SYSTEM) and webhook attribution; category-based retention, deletion and backup policy; verified Gemini embedding models and task types with dimension OPEN; dedicated Fitting model and completion criteria with alteration workflow OPEN. |
