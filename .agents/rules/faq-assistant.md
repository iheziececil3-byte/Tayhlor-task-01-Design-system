---
trigger: model_decision
description: Enforce grounded FAQ assistant answering, approved document chunking and indexing, Gemini embedding pipelines, similarity thresholds, and strict decline responses when building, scaffolding, or modifying the AI assistant in Tayhlor.
alwaysApply: false
---

# FAQ assistant rules

One job: define how the FAQ assistant answers, declines, indexes documents, logs questions, and is tested.

Terms in this file:
- A chunk is a piece of an approved document.
- An embedding is a list of numbers that represents the meaning of a chunk or a question.
- A grounded answer names an approved document whose chunk was retrieved for the question.

## 1. Who and what

- FAQ-01: Only customers use the assistant. OPEN: whether signed-out visitors or unverified customers may use it.
  Why: PRD 4.2 lists the assistant for customers only. The PRD does not address visitors.
- FAQ-02: Answers come only from approved business documents.
  Why: PRD FR-61 and FR-64 require it.
- FAQ-03: Every answer names its source document.
  Why: PRD FR-61 requires it.
- FAQ-04: Order and payment questions are answered from database records only. The answer shows the stored status and the last-updated time. The language model MUST NOT write these answers. OPEN: how these questions are identified (FAQ-27).
  Why: PRD FR-63 requires it. The identification method is open, so the agent asks first.

## 2. The language model

- FAQ-05: The language model receives only the retrieved chunks, the question, and the fixed instructions in PRD 7.2. It answers only from the chunks and names the source document.
  Why: PRD 7.1 step 6 and 7.2 require it.
- FAQ-06: The language model MUST NOT receive customer identity, order records, or payment data.
  Why: PRD 7.2 and 9.6 require it.
- FAQ-07: The language model MUST NOT answer from general knowledge. It MUST NOT promise dates, prices, or refunds unless a source says so.
  Why: PRD 7.2 and Goal G3 forbid invented answers.
- FAQ-08: An answer is grounded only if it names a document title that appears in the retrieved chunks. An answer that is not grounded is replaced with the decline response (FAQ-12).
  Why: PRD 7.2 requires the replacement. This check makes "cites a source" testable.

## 3. Retrieval and declining

- FAQ-09: Retrieval returns the top 4 chunks by cosine similarity, filtered by business and by APPROVED status.
  Why: PRD 9.5 and 10.3 specify it.
- FAQ-10: Chunks below the similarity threshold are discarded. The starting threshold is 0.75. The agent re-tunes it for the Gemini model during evaluation. The owner approves the final value.
  Why: PRD 9.5 says scores differ between models.
- FAQ-11: If no chunk passes the threshold, return the decline response and do not call the language model.
  Why: PRD FR-62 and 7.1 step 5 require it.
- FAQ-12: The decline message is exactly: "I don't have a verified answer for that. Please ask the tailor directly." It is followed by the shop's contact details from the business record (REQ-10).
  Why: PRD FR-62 requires this wording. Copy it character for character.

## 4. Indexing

- FAQ-13: Only APPROVED documents produce chunks. DRAFT documents never do.
  Why: PRD FR-61, FR-64, and 9.4 require it.
- FAQ-14: Approving a document splits it into chunks, creates an embedding for each chunk, and writes them. Old chunks for that document are deleted in the same transaction.
  Why: PRD 7.1 step 2 and 9.3 require it.
- FAQ-15: Splitting is by heading, then by paragraph. Each chunk is 300 to 500 tokens with 50 tokens of overlap. Each chunk keeps its document title.
  Why: PRD 9.3 specifies it.
- FAQ-16: Editing an approved document returns it to DRAFT and removes its chunks at once.
  Why: PRD FR-64 and 9.4 require it.
- FAQ-17: Deleting a document removes its chunks.
  Why: PRD 9.4 requires it.
- FAQ-18: A change of embedding model or dimension requires re-embedding all approved documents using the new compatible configuration. The vector column size in PostgreSQL MUST match the verified model output dimension (DAT-08). Embeddings MUST use compatible task types: `task_type="RETRIEVAL_DOCUMENT"` for document chunks, and `task_type="RETRIEVAL_QUERY"` for user question searches. Embedding dimensions MUST be validated before storage; zero-padding or silent truncation of vectors is prohibited.
  Why: Resolves Issue 9; PRD 9.2, 9.4, and official Google Gemini API embedding requirements.
- FAQ-19: Rate-limited requests during indexing are retried. OPEN: the retry count and delay.
  Why: PRD Section 13 names rate limits as a risk. The PRD sets no retry limits.

## 5. Logging and models

- FAQ-20: Every question is logged with the answer, the source chunk IDs, and a grounded flag.
  Why: PRD 7.1 step 7 requires it for review.
- FAQ-21: Confirm exact Gemini model names against Google's model list before writing them in code. Do not guess a model name. Verified embedding candidates: `gemini-embedding-001` (default 3072 dimensions, supports MRL 1536 or 768) and `text-embedding-004` (native 768 dimensions). The specific model and configured dimension remain OPEN (PRD Q13) until approved by the owner.
  Why: PRD Q5 and Q13 leave specific model configurations open until approved by the owner.

## 6. Performance and testing

- FAQ-22: At least 95% of questions get an answer within 5 seconds, measured from submission to the displayed answer.
  Why: PRD FR-60 requires it.
- FAQ-23: Before each release, run the evaluation set. Target: 100% of answers cite an approved source or decline. Zero fabricated prices, dates, or policies.
  Why: PRD 7.4 requires it.
- FAQ-24: PROPOSED. The evaluation set has 50 questions covering answerable, unanswerable, and trap questions. OPEN: who writes it.
  Why: PRD 7.3 proposes the set and its three question types.
- FAQ-25: Each week, review a 5% sample of grounded answers. Track the decline rate.
  Why: PRD 7.4 requires it.

## 7. Open decisions

- FAQ-26: OPEN: the orchestration layer (Vercel AI SDK or a custom layer). Ask before choosing.
  Why: PRD 7.3 lists both as proposed.
- FAQ-27: OPEN: how order and payment questions are identified, and how other questions are classified.
  Why: PRD 7.1 step 3 requires a classification and does not say how it works.
- FAQ-28: OPEN: the upload format and size for documents.
  Why: PRD 7.1 step 1 covers uploads, but the PRD sets no format or size.
