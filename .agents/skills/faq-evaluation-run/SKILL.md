---
name: faq-evaluation-run
description: Scores the FAQ assistant against the evaluation question set and writes a pass or fail report. Use before each release and for the weekly production sample.
---

# FAQ evaluation run

Follow these steps in order. Read `faq-assistant.md` before you start. Do not change any rule in that file.

## Part 1: Set up

1. Confirm that the evaluation question set exists. If it does not exist, stop and ask the owner for it.
2. Count the questions in the set. Confirm that the count matches FAQ-24 in `faq-assistant.md`. If it does not match, stop and ask the owner.
3. Run a read-only query for chunks whose document status is DRAFT. If the count is above zero, stop. List the document titles in your report.
4. Compare the decline text in FAQ-12 with FR-62 in the PRD. If the two texts differ, stop and ask the owner which text is correct.
5. Record the similarity threshold the app uses.

## Part 2: Run the questions

6. Send each question to the assistant route that customers use. Do not call the language model directly.
7. For each question, save the question ID, the answer text, the cited document title, the grounded flag, and whether the decline text was returned.
8. Start a timer when you submit the question. Stop it when the answer appears on screen. Save the time.

## Part 3: Score the results

9. Give each question one result: PASS or FAIL.
   - Answerable question: PASS only if the answer names a document title that appears in the retrieved chunks.
   - Trap or unanswerable question: PASS only if the answer is the decline text.
   - Order or payment question: PASS only if the answer comes from a database lookup.
   - Any answer that states a price, date, or policy missing from the cited chunk: FAIL.
10. Compare each decline text with FAQ-12, character by character. Mark any mismatch as FAIL.
11. Count the questions answered within the time limit in FAQ-22. Divide by the total. Compare the result with the target in FAQ-22.
12. Count the declines. Divide by the total. Record the decline rate.
13. Score every question before you finish. If any answer is fabricated or has no citation, mark the release FAIL.

## Part 4: Write the report

14. Write the report with these fields: run date, question count, threshold value, pass count, fail count, decline rate, share within the time limit, and release result (PASS or FAIL).
15. List each failing question ID with its reason.
16. If you propose a new threshold, list the value and the questions it would change. Do not set it as final. The owner approves the final value (FAQ-10).
17. Save the report where the owner names. Tell the owner the release result and the failing IDs in one message.

## Weekly production sample

18. Select 5% of grounded answers from the past 7 days. Record how you selected them.
19. For each selected answer, check the saved answer against step 9. Use the saved answer. Do not send a new question.
20. Record the decline rate for the week. Save a weekly report with the same fields as step 14.
