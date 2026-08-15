---
name: to-grill
description: >-
  Conduct a no-code requirement research and clarification stage before spec,
  ticketing, or implementation. Use when the user invokes /to-grill or $to-grill,
  asks to explore requirements, clarify product scope, stress-test a feature
  idea, says not to write code yet, or the request is ambiguous, risky,
  cross-module, product-facing, or likely to need alignment. Do not use the full
  workflow for simple, concrete edits such as minor copy/style tweaks or obvious
  one-file adjustments; route those to direct implementation instead. Built-in
  grilling behavior: ask one decision question at a time, investigate
  discoverable facts yourself, expose ambiguity and risk, and block to-spec,
  ticketing, and implementation until key questions are closed or explicitly
  deferred.
---

# To Grill

Use this skill as the first stage of a spec-driven delivery workflow. The goal is to turn a fuzzy request into a shared, decision-ready requirement summary without writing code or designing an implementation prematurely.

This skill internalizes the behavior that would otherwise be provided by a separate grilling/interview skill. Do not invoke another skill for requirement grilling. Use the process below directly.

## Fast-Path Triage

Before starting the full requirement research workflow, decide whether the request is actually simple enough to handle directly.

Use the direct-edit fast path when all are true:

- The user asks for a concrete, low-risk adjustment.
- The desired behavior is obvious from the request or discoverable from local context.
- The change appears narrow, usually one small UI/style/copy/config/test adjustment.
- No new business rule, data semantics, permission boundary, API contract, migration, rollout, or cross-module design decision is required.
- Acceptance can be verified with a small focused check.

Examples: make a font larger, change a label, adjust spacing, rename visible copy, fix an obvious typo, update a small threshold already defined by context.

When the fast path applies, exit this requirement-research workflow: do not create `.spec-workflow/<feature-slug>/requirements.md`, do not produce a full requirement research conclusion, and do not force `to-spec`. State briefly that the request does not need the formal spec-driven delivery workflow and recommend direct implementation.

Do not write code inside `to-grill`. If the user explicitly invoked `/to-grill` or `$to-grill`, or said not to write code yet, wait for the user to confirm direct implementation before editing. If `to-grill` triggered only because the request initially looked ambiguous, the agent may terminate this skill and handle the request through the normal direct-implementation path when no no-code instruction remains.

Use the full `to-grill` workflow when the request is ambiguous, product-facing, risky, cross-module, data/security-sensitive, or when the user explicitly asks for the full workflow despite the fast-path recommendation.

## Workflow Git Entry Gate

Run this gate only after fast-path triage decides the full workflow should continue. Do not run it for direct-edit fast paths.

Before writing the requirement artifact:

- If the project is not a git repo, state that no git baseline is available and continue. Record `Git entry: not a git repo` in `requirements.md`.
- If the project is a git repo, record the current branch, `HEAD`, and `git status --porcelain=v1 -uall`.
- Ask the user whether this workflow should continue on the current branch, continue on a new branch, or pause for manual branch handling. Provide explicit options, include your recommendation, and wait for the user's explicit choice.
- Do not create, switch, checkout, stash, reset, or commit until the user explicitly confirms that operation.
- If the worktree is dirty before the branch decision, list the dirty files and explain that switching branches may carry or block those changes. Ask whether to commit an exact reviewed scope first, continue while recording the dirty baseline, or pause for manual cleanup using explicit options.
- If the user chooses to commit first, ask for confirmation of the exact files or scope before committing. Never include unrelated dirty files by default.
- For any pre-workflow commit, show the exact proposed file list first. Exclude unresolved conflicts, unrelated files, local secrets, generated build output, dependency cache files, temporary/debug artifacts, and files with unknown purpose. Run only the validation that is appropriate and available for those pre-existing changes; if validation is unavailable, unknown, or failing, report that status and commit only after the user explicitly accepts it.
- If the user chooses to continue with dirty files, preserve the dirty baseline exactly as the pre-workflow baseline and label it as pre-existing user work.
- If the user chooses a new branch, create or switch to it only after the dirty-worktree handling decision is closed.

Record the gate result in `.spec-workflow/<feature-slug>/requirements.md`:

- Git repository path.
- Branch decision: current branch or new branch name.
- Starting branch and `HEAD`.
- Dirty-worktree decision: committed first, continued with dirty baseline, paused, or not dirty.
- Dirty files present before workflow work began.
- Any commit hash created by this gate, when the user explicitly approved a pre-workflow commit.

## Hard Gates

- Do not write code.
- Do not create an implementation plan in this stage; only clarify requirements and recommend the next stage.
- Do not enter spec, ticketing, or implementation while unresolved key questions remain.
- Do not invent critical business rules, data semantics, permissions, acceptance criteria, or interaction behavior.
- Write all user-facing questions, summaries, recommendations, artifact content, and final conclusions in the language of the latest substantive user request; keep code identifiers, paths, API names, and skill names unchanged.
- If a fact can be discovered from the environment, repo, docs, logs, configs, APIs, or tools, investigate it instead of asking the user.
- If a decision belongs to the user or product owner, ask the user and wait for the answer.
- Ask one question at a time. Do not batch multiple questions into one large questionnaire.
- For every decision question, include your recommended answer and the reason.
- For every user-owned decision, provide 2-4 explicit options. Each option must have a short label and one-line consequence/tradeoff. Do not ask open-ended confirmation questions such as "Do you confirm?", "Is this OK?", or "Yes/no?" when more than one reasonable path exists.
- If you recommend one option, mark it as recommended, but still show the alternatives. The user must be able to answer by selecting an option label or by writing a custom answer.
- Continue until each key question is closed, or explicitly marked as "not solved this round", "deferred", or "user accepts risk".
- Record every unconfirmed critical item as a pending alignment issue until it is closed, deferred, out of scope, or accepted as risk.

## Initial Pass

Start by restating the understood goal in your own words. Separate what is already clear from what is vague.

Then inspect the requirement across these dimensions:

- User: who uses this capability.
- Scenario: when and where the user uses it.
- Pain: what current problem it solves.
- Success: what measurable or observable result means it worked.
- Scope: what is included.
- Non-goals: what is intentionally excluded.
- Data source: where data comes from.
- Data semantics: definitions, filters, ownership, freshness, and consistency expectations.
- Permissions, security, and audit requirements.
- Frontend/backend interaction constraints.
- Compatibility with old data or old workflows.
- Exception paths, retries, rollback, and idempotency.
- Observability: analytics, logs, alerts, diagnostics, and operational visibility.

Use repo-specific vocabulary when available. Read local context docs such as `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/`, `.spec-workflow/`, issue files, or ADRs when they are relevant.

## Built-In Grilling Loop

Trigger the grilling loop whenever any of these conditions appear:

- Goal is unclear.
- User scenario is unclear.
- Business rule is unclear.
- Data path or data semantics are unclear.
- Permission boundary is unclear.
- Acceptance criteria are unclear.
- Scope is too large or boundary is vague.
- Requirements conflict with each other.
- Implementation path depends on an unconfirmed external condition.
- Product or technical risk exists without a decision.
- You are about to fill a gap using "should be", "probably", "usually", or "I guess".

When grilling:

1. Choose the highest-leverage unresolved decision.
2. Ask exactly one question.
3. Present 2-4 concrete options, with one marked as recommended when you have enough context.
4. Explain the impact of the recommended answer and any important tradeoff in the alternatives.
5. Wait for the user before asking the next question or moving on.

Walk the decision tree one branch at a time. Resolve prerequisite decisions before dependent decisions, and do not act as though a branch is settled until the user, repo, or authoritative documentation has closed it.

After the user answers, re-check the requirement. If anything remains unclear, inconsistent, incomplete, or newly dependent on another decision, repeat the loop.

## Question Style

Make questions concrete and decision-oriented. A good question is a small decision menu, not a bare confirmation prompt.

Prefer:

```text
Which retry scope should this round use?

A. Admin-triggered manual retry (Recommended) - keeps the scope small and avoids idempotency/backoff design in this round.
B. Automatic retry - better recovery, but requires idempotency, retry limits, backoff, and observability decisions.
C. No retry in this round - fastest delivery, but failed jobs need external/manual handling.
```

Avoid yes/no confirmations that hide the alternatives:

```text
I recommend supporting only admin-triggered manual retry in this round. Do you confirm this scope?
```

Also avoid broad questionnaires like:

```text
Please describe the user, scenario, permissions, data, acceptance criteria, and exception cases.
```

If the user's answer reveals a new risk, name it and ask the next single question. If the user explicitly accepts a risk or defers it, record that status and stop reopening it unless later answers conflict.

## Closure Rules

A question is closed only when one of these is true:

- The user gives a concrete decision.
- The repo or authoritative documentation gives a concrete fact.
- The user says it is out of scope for this round.
- The user says it will be handled later.
- The user explicitly accepts the risk.

Keep a visible running list of pending alignment issues and closed issues. Do not output a final requirement research conclusion until no blocking open issue remains.

## Artifact Storage

Persist this stage's final conclusion in the current project by default:

```text
.spec-workflow/<feature-slug>/requirements.md
```

Use these rules:

- Resolve the project root before writing: use the user-provided artifact path first; otherwise reuse an existing applicable `.spec-workflow/` directory; otherwise use the nearest git root; otherwise use the directory containing project guidance such as `AGENTS.md`; if the root cannot be determined uniquely, ask one focused question.
- Generate `<feature-slug>` from the requirement title or goal using lowercase kebab-case.
- If the user provides an explicit non-production artifact directory, use that directory instead of `.spec-workflow/<feature-slug>/`.
- Do not write workflow artifacts into production code, committed test directories, migration directories, config directories, generated-build/generated-code directories, dependency directories, lockfile locations, snapshots, or formatting-only files. If the user requests such a target, ask for a non-production artifact location.
- Write the final requirement research conclusion to `requirements.md`.
- If the target file already exists, read it first and update intentionally instead of blindly overwriting.
- The final response must list the requirement artifact path written.

All durable workflow artifacts for the same requirement must stay under the same `.spec-workflow/<feature-slug>/` directory unless the user explicitly chooses another non-production artifact directory. Later stages should reuse this directory for specs, tickets, amendments, implementation reports, review reports, repair plans, verification evidence, debug notes, and research notes that belong to this requirement.

Use this `requirements.md` file as the authoritative input for `to-spec`.

## Final Output

Only after all key questions are closed, output a requirement research conclusion in the user's language with these sections:

- Background
- Goal
- Non-goals
- User flow
- Functional scope
- Business rules
- Data semantics
- Permission, security, and audit requirements
- Exception and boundary scenarios
- Risks
- Closed questions
- Explicitly deferred or out-of-scope items
- Recommended next step

For the next step, recommend entering `to-spec` only when the requirement is ready for a formal implementation spec. If the requirement remains intentionally incomplete, say exactly which unresolved items are deferred or accepted as risk. Include the persisted `requirements.md` path in the final response.

## Relationship To Later Skills

This skill is stage 1 of the five-stage spec-driven delivery chain. The package also includes auxiliary skills for bug diagnosis and source research; use those only when their triggers match the task.

1. `to-grill`: clarify requirements and close product/technical uncertainty.
2. `to-spec`: turn closed requirements into an implementation-ready spec.
3. `spec-do`: coordinate and implement from the spec.
4. `do-review`: run final delivery review without expanding scope.
5. `fix-review`: turn review findings into a repair spec.

Later stages must use this stage's persisted requirement research conclusion as their input. When the full spec-driven delivery workflow is in use, output and persist the conclusion after all key questions are closed; do not end with only interview notes.
