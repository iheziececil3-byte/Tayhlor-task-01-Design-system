# Tayhlor: Project Scaffolding and Foundation Setup

## Role

Act as a senior software engineer and product designer with at least seven years of professional experience building, structuring, and delivering production-quality software products.

Your responsibility is to scaffold the Tayhlor project from the ground up. Establish a clean, maintainable project structure and the technical and visual foundation on which the product will eventually be built.

You are responsible for the project skeleton, not the implementation of the complete product.

## 1. Context and Design System Review

Before writing, modifying, or generating any code:

1. Inspect the existing workspace and file tree.
2. Identify and read all project context files, including the PRD, AGENTS.md, rules files, skills files, and any other relevant project documentation.
3. Identify and read all design system files, including branding specifications, design tokens, component guidelines, and other available design references.
4. Read relevant referenced files where necessary to understand the instructions fully.
5. Do not skip files simply because their names or contents appear repetitive. Identify their purpose and determine which instructions apply.

If a referenced file is missing, inaccessible, incomplete, or unclear, report it rather than pretending it was reviewed.

## 2. Understanding and Approval Gate

After reviewing the available documentation, stop and present a structured summary of your understanding.

The summary must cover:

- **Product understanding:** What Tayhlor is, the problem it addresses, and its intended users.
- **Technical direction:** The documented technology stack, architecture, and relevant technical requirements.
- **Project structure:** The structure and foundation that need to be established.
- **Design direction:** The documented design system, visual principles, and available design tokens.
- **Project constraints:** The important requirements, restrictions, and implementation boundaries.
- **Scaffolding scope:** What you intend to build now and what must remain unimplemented.
- **Conflicts and gaps:** Any contradictions, missing information, or unresolved decisions found in the documentation.

Do not begin implementation at this stage.

Wait for my explicit approval before proceeding. If the documentation contains conflicting instructions, ask me to resolve them rather than choosing one yourself.

## 3. Source of Truth

Treat the existing project context files and design system documentation as the authoritative sources of truth.

- Do not invent product requirements, technical decisions, business rules, or design specifications.
- Do not override documented decisions with personal preferences or general industry conventions.
- Do not silently resolve contradictions between files.
- When information is missing or ambiguous, identify the gap and ask for clarification when it affects implementation.
- Distinguish documented decisions from assumptions and recommendations.
- Follow the applicable instructions in AGENTS.md, rules files, and skills files.

## 4. Scaffolding Scope

After receiving approval, establish only the project setup and a minimal home screen.

The objective is to create the skeleton and foundation of Tayhlor so that the project has a clear structure and can start and run successfully.

This includes:

- Establishing the project using the documented technology stack.
- Creating the necessary initial folder and file structure.
- Configuring the required development environment and project tooling.
- Establishing the initial application entry points and layout.
- Setting up the documented styling and design token foundation.
- Creating a minimal home screen that demonstrates the initial visual direction and confirms that the application renders successfully.
- Adding only the configuration and supporting files necessary for the scaffold.

**Do not implement the complete Tayhlor product or functional product features.**

Do not build authentication, customer management, measurement management, order management, payment processing, order tracking, the FAQ assistant, or other product functionality during this task.

Do not create unnecessary placeholder features, mock workflows, speculative components, or infrastructure that is not required for the approved scaffold.

If a setup decision could introduce significant architectural consequences or require an undocumented assumption, stop and seek clarification.

## 5. Design System Compliance

Use the existing Tayhlor design system as the authority for the visual foundation.

- Use documented design tokens for colors, typography, spacing, sizing, borders, radii, shadows, and other applicable styling values.
- Do not introduce arbitrary hardcoded styling values when an applicable design token exists.
- Do not invent new tokens or silently modify existing ones.
- If a required token or design specification is missing, report the gap and request clarification where necessary.
- Do not introduce a different visual language or design system.

The minimal home screen must demonstrate the documented design direction without expanding into a complete user interface.

## 6. File Creation Plan

Before implementation, provide a proposed list of every file and folder you intend to create or modify.

For each proposed file, state:

- Its path and filename.
- Its purpose.
- Why it is necessary for the scaffold.

Identify any assumptions or unresolved decisions separately. Do not present assumptions as established project requirements.

Wait for approval of the proposed implementation plan before creating or modifying files.

## 7. Implementation and Verification

After approval:

1. Implement only the approved scaffold.
2. Keep the project structure clean, understandable, and maintainable.
3. Avoid unnecessary dependencies, files, abstractions, and configuration.
4. Follow the documented project conventions and applicable agent instructions.
5. Run the necessary checks to verify that the project starts and the minimal home screen renders successfully.
6. Report any checks that could not be completed and explain why.

Do not claim that the project runs successfully unless you have actually verified it.

## 8. Final Implementation Report

After implementation, provide:

- A summary of what was established.
- The complete list of files created and modified, with their purposes.
- Every assumption made, including any approved assumptions.
- Any decisions that remain unresolved.
- The commands and checks executed, including their results.
- Any deviations from the approved implementation plan, with explanations.
- Confirmation of whether the project starts and the minimal home screen renders successfully.

## 9. Self-Audit

Before presenting your final report, audit your work against every instruction in this prompt.

Explicitly verify:

- All available context and design system files were reviewed before implementation.
- The understanding summary was presented and approval was received before implementation.
- Documented project decisions were respected.
- Conflicts and missing information were not silently resolved.
- Design system tokens were used appropriately.
- Only the approved project setup and minimal home screen were implemented.
- No complete product features were introduced.
- Every created and modified file was reported.
- Every assumption was disclosed.
- The project startup and rendering checks were actually performed.

Identify any instruction that was not satisfied. Do not mark an incomplete requirement as completed.

## Definition of Success

The deliverable is a working project skeleton.

Success means:

- The documented technical foundation is established.
- The initial project structure exists.
- The design system foundation is in place.
- The minimal home screen renders.
- The application starts successfully.

**Success does not mean that Tayhlor's product features are implemented or functional.**

Stay within this boundary. Do not expand the task without my explicit approval.


My own scaffold prompt

You are a professional software engineer and designer with 7 experience. you have built many professional and standard product and you can comfortably raise a product from ground level to complete finishing.

Your task is to scaffold this project, take it from ground level and build the structure and foundation.

Everything you need to know about my tayhlor project is in file tree in our workspace, so therefore:

1. You must read all context files and design system files before writing any code.
2. Summarize its understanding and wait for my approval.
3. Treat those files as the only source of truth.
4. Ask rather than assume when two files disagree.
5. Use design system tokens with no hardcoded styling values.
6. Build only the project setup and a minimal home screen. Basically setup the foundation and lay the structure for our product. Not the entire product.
7. List every file you will create and every assumption it made. Then
8. Audit your own response against these instructions.

Your deliverable is the skeleton. Success = the structure exists and 
the project runs (starts up), NOT that features work yet.


The tightened version expands the original prompt by making its instructions more specific, structured, and enforceable. It adds a workspace inspection process to ensure the agent identifies and reads all relevant context and design system files, a structured understanding summary, and an explicit approval gate before implementation. It also clarifies how to handle missing information, conflicting instructions, and undocumented decisions so the agent does not make assumptions or invent requirements. The scaffolding scope is more precisely defined to prevent the agent from implementing actual product features, while the design system instructions are expanded to cover all relevant styling tokens and how to handle missing tokens. Additionally, it introduces a proposed file creation plan for approval before implementation, implementation verification, a detailed final report, and a self-audit checklist. These changes were made to remove ambiguity, prevent scope creep and unnecessary files, give the project owner greater control over implementation, and ensure the final deliverable is a properly structured, maintainable project skeleton that starts and runs successfully, rather than an incomplete attempt at building the full product.
