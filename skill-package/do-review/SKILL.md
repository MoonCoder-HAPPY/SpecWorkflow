---
name: do-review
description: >-
  Run final delivery review after implementation to decide whether the current
  requirement is truly complete and shippable. Use when the user invokes
  /do-review or $do-review, asks for final acceptance review, delivery readiness review,
  verification after spec-do, ship/no-ship judgment, or review against original
  requirements, specs, amendments, repair specs, tickets, implementation
  records, and code. Uses internal subagent review coordination when useful
  while internalizing code quality review, clarification, and repair-spec
  handoff behavior. Does not expand scope or fix code.
---

# Do Review

Use this skill as stage 4 of the spec-driven delivery workflow. The goal is to decide whether the implemented requirement is actually complete and safe to ship. This stage reviews; it does not implement fixes or expand the feature.

This skill uses built-in review behavior plus internal subagent coordination when independent review axes benefit from isolation. Small or tightly scoped reviews may run locally with explicit axis separation. All review, clarification, and repair handoff behavior needed by this stage is internalized here. Do not invoke separate review, clarification, spec-planning, setup, orchestration skills, external coordination runtimes, or external orchestration commands, even if the user casually names them; their semantics must be handled by this skill. This does not override platform-required skills, tool-control skills, or non-duplicative user-requested skills.

## Hard Gates

- Write all user-facing review plans, questions, findings, reports, and ship decisions in the language of the latest substantive user request; keep code identifiers, paths, API names, skill names, commit refs, and command output unchanged.
- Do not add features, change scope, or fix code in this stage.
- Do not modify production code, tests, migrations, configs, generated artifacts, dependency files, lockfiles, snapshots, or formatting-only files during final review.
- You may write non-production review artifacts such as `.spec-workflow/<feature-slug>/review-report.md` when durable handoff is needed. In Goal Mode, you may also update only the Goal Mode runtime ledger fields in `.spec-workflow/<feature-slug>/implementation-report.md`, such as reserved cycle, completed cycles, remaining budget, next automatic stage, and pause reason.
- Treat original requirements, `to-grill` conclusions, `to-spec` specs/tickets/amendments, `fix-review` repair specs/tickets, `spec-do` implementation reports, and relevant code as review inputs.
- Read Goal Mode authorization from the current spec and latest applicable amendment when present. Read `implementation-report.md` only for runtime ledger state such as cycle counts, validation status, child-agent state, and next automatic stage. Goal Mode applies only to the current spec version that explicitly enabled it.
- Consume git entry decisions, dirty-worktree baselines, implementation fixed points, commit hashes, and auto-commit decisions from workflow artifacts when present. Use them to define the review diff and to separate implementation changes from pre-existing user work.
- Respect `Authority: external-tracker-only` markers in local artifacts. When present, read the named tracker item as the authoritative spec/review source and Goal Mode authorization source before relying on local `.spec-workflow` files.
- If a business expectation, interaction rule, or acceptance criterion is unclear, use the built-in grilling gate: ask exactly one focused decision question with a recommended answer and wait. Do not reinterpret the requirement silently.
- If a fix is needed, record the finding and recommend the next stage, `fix-review`, to produce a repair spec. Outside Goal Mode, concrete low-risk evidence-backed findings that need only an obvious direct edit and do not change product behavior, API/data contracts, permissions, acceptance criteria, testing seams, or cross-module design may be routed to direct implementation instead of forcing `fix-review`. In Goal Mode, must-fix findings must not bypass `fix-review` unless the user explicitly interrupts the automatic loop and authorizes direct repair. Do not call another spec-planning skill from here.
- Do not accept fake responses, mocked success flows, hard-coded business results, UI-only closure for backend behavior, TODO pseudo-completion, silent errors, or tests that bypass real business logic.
- Do not create commits, amend commits, create branches, switch branches, stash, reset, or clean the worktree during this review stage. Report any needed git operation as a recommendation for the user or the next implementation stage.
- Run side-effectful verification only in local, test, staging, or otherwise isolated environments with test accounts and disposable or rollback-safe data. In production or unknown environments, perform only read-only checks and report blocked verification or residual risk.
- Do not click or call destructive/high-risk actions such as delete, payment, publish, irreversible migration, user notification, permission escalation, or external write unless the environment is isolated and the action is explicitly safe or reversible.
- Before ending, wait for every review child agent started by this skill. If a child agent is stuck or silent for a long time, use the built-in stalled-child policy below before exiting.

## Inputs

Gather review inputs before planning tasks:

- Original user goal and non-goals.
- `.spec-workflow/<feature-slug>/requirements.md` when present.
- `.spec-workflow/<feature-slug>/spec.md` and `.spec-workflow/<feature-slug>/issues/` when present.
- `.spec-workflow/<feature-slug>/amendments/` when present and relevant to the implemented work.
- `.spec-workflow/<feature-slug>/repair-spec.md` and `.spec-workflow/<feature-slug>/repair-issues/` when reviewing a repair pass.
- `.spec-workflow/<feature-slug>/implementation-report.md` when present.
- Relevant `.spec-workflow/<feature-slug>/implementation-reports/` entries when historical implementation context affects the review target.
- `spec-do` implementation report, if present in the conversation or artifacts.
- Initial dirty-worktree baseline from `implementation-report.md`, when available.
- Relevant commits, diff, branch, PR, or changed files.
- Project guidance such as `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/`, ADRs, issue tracker docs, coding standards, and existing test conventions.
- Relevant frontend pages/components/routes, backend API/controller/facade/service/repository/mapper paths, database migrations, permissions, security, audit, observability, and docs.

If the review target is unclear, ask one focused clarification question before starting review.

When `.spec-workflow/<feature-slug>/amendments/` exists, scan every amendment record's header or metadata fields for affected spec sections, affected tickets, dependency changes, testing decision changes, and implementation status impact before deciding relevance. Then fully read amendment records that affect the reviewed spec, ticket, repair pass, dependencies, acceptance criteria, testing seams, or implementation status.

## Goal Mode Review Handoff

When Goal Mode is enabled for the current spec only:

- Determine authorization only from the current authoritative `spec.md` plus the latest applicable amendment record, or the authoritative tracker spec/amendment when `Authority: external-tracker-only` applies. Use `implementation-report.md` only as the runtime ledger for current cycle number, reserved next cycle, remaining budget, validation state, child-agent state, and next automatic stage.
- If review-report, implementation-report, spec, amendment, or tracker metadata disagree, honor the current authoritative spec source and latest amendment authorization, record the mismatch in `review-report.md`, and pause unless the safe interpretation is clearly to disable Goal Mode.
- If a later amendment exists without a fresh user-confirmed Goal Mode decision for that amendment, do not auto-continue. Pause and ask the user to choose Goal Mode for the amended spec.
- If `Authority: external-tracker-only` applies and the tracker does not expose a readable, current, user-confirmed Goal Mode authorization anchor for the current spec version, do not auto-continue. Treat Goal Mode as disabled or paused until the user chooses again.
- Apply the ledger state transition in this exact order before choosing the next automatic stage:
  1. Detect pause conditions first. If the review is blocked, unstable, has unresolved child-agent ownership, has blocked validation, has unclear diff boundary, or any finding requires product/business decisions, scope expansion beyond the current spec, destructive verification, unsafe git operations, or risk acceptance, pause and do not mark any reserved repair cycle completed or decrement budget.
  2. If this is the follow-up review after a reserved repair cycle and no pause condition is active, write the review report, then update `implementation-report.md` by marking that exact reserved cycle ID completed, decrementing remaining repair cycles exactly once, recording the review report path, and clearing the reservation. Never reserve a new cycle before this completion/decrement step.
  3. After any required completion/decrement step, evaluate the review outcome using the updated remaining budget.
  4. If review classification is `complete` and Ship Decision is `can ship`, stop the automatic loop and report that the current spec goal is satisfied.
  5. If must-fix issues remain and the updated ledger shows remaining repair cycle budget for the current authorization anchor, reserve the next repair cycle in `implementation-report.md`, write or update the review report with that reservation, then continue to `fix-review` automatically.
  6. If must-fix issues remain but the updated repair cycle budget is exhausted, pause and ask the user whether to extend Goal Mode for this same spec, accept the remaining risk, or stop.

When Goal Mode is disabled or absent, recommend `fix-review` or direct implementation as appropriate, but do not enter the next stage automatically.

## Stable Review Gate

Before starting final review tasks, confirm the implementation state is stable enough to review:

- If `implementation-report.md` or ticket files show live child-agent ownership, in-progress implementation tasks, unresolved merge/integration work, unrecovered partial child output, missing final aggregation, or blocked validation required by the spec, do not perform a normal final review.
- Ask the user whether to pause for `spec-do` to finish, run a clearly labeled partial review, or classify the delivery as `incomplete` based on the unfinished implementation state.
- A partial review must label its scope, exclude unmerged child work unless explicitly included as evidence, and must not produce `can ship`.
- If reviewing a committed implementation, resolve the fixed point and review target commit before starting review. If reviewing uncommitted implementation, compare against the recorded dirty-worktree baseline and identify which dirty files belong to the implementation pass.
- If the fixed point, target diff, or ownership state cannot be established, ask one focused clarification question before dispatching review child agents or writing review artifacts.

## Review Coordination

Choose the narrowest coordination structure that can review the delivery accurately:

- Local axis-separated review: the main agent performs the review locally, keeping Standards, Spec, acceptance, frontend/backend, and risk axes separate in the report.
- Internal review child agents: the main agent starts one or more child agents for independent read-only review axes, then aggregates findings and owns the final ship decision.

Use internal review child agents when the review is broad, cross-module, high-risk, or benefits from independent Standards and Spec passes. Use local axis-separated review when the change is small, child-agent tooling is unavailable, or the review requires tightly coupled context that would be risky to split.

The main agent must remain the reviewer of record:

- Define each child review task with prompt, input context, allowed read scope, forbidden write scope, expected evidence, pass criteria, and completion report.
- Prohibit child agents from modifying production code, committed test directories, migration directories, config directories, generated-build/generated-code directories, dependency directories, lockfile locations, snapshots, formatting-only files, or any production artifact.
- Track every child-agent ID, status, output, evidence, blocker, and recovery attempt in the review report when artifacts are written.
- Aggregate results after every review task completes. Do not only forward child-agent findings.
- If no child agents are started, report that local axis separation was used.

## Child Agent Recovery Policy

Apply this policy to every review child task started by this skill.

- If a review child agent stops because of an API call error, model service interruption, network timeout, transient tool transport failure, or context delivery interruption, do not immediately treat the review task as failed.
- First send a continuation instruction to the same child agent in the user's language, equivalent to: `Please continue from the interruption. Do not restart completed work. First summarize what is already done and what remains, then continue.`
- Localize the continuation instruction to the latest substantive user request language. For Chinese users, send the Chinese equivalent of "please continue from the interruption; do not restart completed work; first summarize what is already done and what remains, then continue."
- Allow at most two recovery attempts for the same review task after transient infrastructure failures.
- Record each recovery attempt, failure reason, continuation message, and resumed status in the review report when review artifacts are written.
- Do not use this recovery policy for real review findings or real task failures such as permission denial, missing files, invalid commands, failed verification, unavailable test environment, spec ambiguity, destructive-action safety blocks, or evidence that a child attempted writes outside its read-only review scope. Handle those as findings, blockers, or decision gates.
- If the same review task cannot recover after the allowed attempts, mark it unrecoverable, preserve its partial output, and choose the smallest safe next action: start a replacement review child with the recovered context, perform that review axis locally if it is small enough and allowed, accept an explicitly documented review gap, or pause and report the blocker.
- Before final reporting, wait for every recovered or replacement review child agent.

## Stalled Child Policy

Use this policy when a review child agent is silent, appears stuck, or has not produced useful progress for a long time without a clear transient API/tool interruption:

- Treat `30 minutes` without meaningful output or status change as stalled unless project guidance sets a stricter limit.
- Before stopping a stalled child, inspect any available status, output snapshot, partial findings, and last reported review axis.
- Send one continuation instruction to the same child in the user's language, equivalent to: `Please continue. First summarize your current state, any completed review work, any blockers, and the remaining plan.`
- If the child resumes, keep coordinating it and record the stall and recovery in the review report when artifacts are written.
- If the child remains stalled after the continuation window, stop, close, or kill only that child using the current environment's supported child-agent control. Do not kill unrelated terminals, processes, or agents.
- Preserve and record the partial output, evidence gathered, review axis, and remaining scope.
- Mark the child task `unrecoverable-stalled`, then choose the smallest safe next action: start a replacement child with the recovered context, perform that axis locally if small enough, accept an explicitly documented review gap, or pause and report the blocker.
- Before final reporting, wait for every replacement child and close completed child agents when they are no longer needed.

## Review Scope

First confirm the review scope:

- Original goal.
- Non-goals.
- Affected modules.
- Key user paths.
- Backend interfaces, services, repositories, mappers, persistence paths, migrations, and config.
- Frontend pages, components, forms, routes, interaction paths, and state handling.
- Permissions, security, and audit requirements.
- Error handling and boundary scenarios.
- Testing and verification expectations.
- Documentation or artifact synchronization.

Name anything explicitly out of scope so findings do not become scope expansion.

## Review DAG

Before starting child review work or performing local axis-separated review, output a review DAG with each task's:

- Task ID and name.
- Review target.
- Input context.
- Verification method.
- Code modification allowed: must always be `no`.
- Expected output.
- Dependencies.
- Pass criteria.
- Failure escalation path.

Do not assume fixed specialist child agents exist. Define each review task by prompt, context, allowed read scope, forbidden write scope, expected evidence, and completion signal.

Useful review tasks include:

- Functional acceptance review.
- Backend API behavior verification.
- Database, migration, persistence, mapper, and repository verification.
- Frontend real-interaction testing.
- Permission, security, audit, and exceptional-flow verification.
- Documentation and artifact consistency review.
- Built-in code review: Standards axis.
- Built-in code review: Spec axis.
- Final risk and ship-decision aggregation.

## Frontend Review

If the feature has frontend behavior, perform real page interaction testing. Do not rely only on code reading, static DOM inspection, or synthetic `div.click()` style calls.

Use Playwright, browser automation, MCP browser tools, the project E2E framework, or another real user-interaction mechanism. When applicable, cover at least:

- Page open and initial render.
- Button clicks.
- Form input, validation, and submission.
- Loading, error, empty, success, and partial states.
- Dialogs, confirmations, toasts, and feedback.
- Route transitions.
- Refresh and back navigation.
- API failure error display.
- High-risk action confirmation.

If real interaction testing cannot be performed, report the exact blocker and residual risk. Do not mark frontend review complete based only on source reading.

## Backend Review

If backend behavior changed, confirm:

- API request/response behavior against the spec.
- Controller, facade, service, repository, mapper, and persistence path alignment against the spec.
- Database migrations and old data compatibility against the spec.
- Permission, security, and audit behavior against the spec.
- Error handling, retries, idempotency, rollback, and diagnostic visibility against the spec when relevant.
- No fake response, mocked business success flow, hard-coded business result, TODO pseudo-completion, or swallowed error.

If backend code, resources, config, migrations, or dependencies changed, confirm before review that the backend was restarted and service availability was verified. If restart status is missing, report it as a review finding or blocker.

## Built-In Code Review

Run implementation review against a fixed point and the originating spec. This internalizes the code quality review behavior required by this stage.

Establish the review diff:

- Use the user-provided fixed point when available.
- Otherwise use the implementation fixed point or branch base from `spec-do` artifacts when available.
- Otherwise ask for the fixed point if the diff boundary is not discoverable.
- In git repos, resolve the fixed point with `git rev-parse <fixed-point>`.
- Prefer `git diff <fixed-point>...HEAD` and note `git log <fixed-point>..HEAD --oneline`.
- Confirm the diff is non-empty before claiming review occurred.

Identify the spec source in this order:

1. Explicit external tracker item when the user, project guidance, or local artifact marker says `Authority: external-tracker-only`.
2. Explicit spec or ticket path from the user or artifacts.
3. `.spec-workflow/<feature-slug>/repair-spec.md` and relevant `repair-issues/` when reviewing a repair pass.
4. `.spec-workflow/<feature-slug>/spec.md`, relevant ticket files, and amendment records that affect the implemented work.
5. Original user request, current conversation, and implementation report as a lightweight acceptance source for fast-path/direct implementations.
6. Issue references in commit messages when a documented tracker workflow exists.
7. Matching PRD/spec under `docs/`, `specs/`, or `.spec-workflow/`.
8. Ask the user if no source is found.

If no formal spec exists but a lightweight acceptance source exists, use it for the Spec axis and label it as lightweight. If no formal spec, original request, ticket, conversation acceptance source, or verifiable acceptance criterion exists, the Spec axis must report `no spec available`, completion must not be `complete`, and Ship Decision must not be `can ship`.

Identify standards sources such as `CODING_STANDARDS.md`, `CONTRIBUTING.md`, `AGENTS.md`, `CLAUDE.md`, ADRs, docs, and local conventions in touched areas. Do not invoke external setup skills. If tracker setup docs are missing, use explicit user-provided tracker instructions or local artifacts.

Keep review axes isolated:

- Standards axis: documented standards plus the smell baseline below.
- Spec axis: requirements missing or partial, behavior added beyond scope, behavior regression, architecture boundary issues, frontend/backend contract issues, data consistency issues, permission/security/audit issues, exceptional-flow issues, testing gaps, documentation inconsistency, maintainability risks tied to spec execution, and requirements implemented incorrectly.
- Do not merge, rerank, or let one axis mask the other.
- When using internal review child agents, start Standards and Spec as separate read-only review tasks when feasible. The Standards task prompt must include the standards-source list and the full smell baseline from this skill; the Spec task prompt must include the spec source or lightweight acceptance source. If reviewing locally, perform the axes separately and report that local isolation was used.

For Standards, repo standards override the smell baseline. Treat baseline smells as judgement calls, not hard violations. Skip anything already enforced by tooling.

Use this smell baseline:

- Mysterious Name: a function, variable, or type whose name does not reveal what it does or holds.
- Duplicated Code: the same logic shape appears in more than one hunk or file.
- Feature Envy: a method reaches into another object's data more than its own.
- Data Clumps: the same fields or params travel together repeatedly.
- Primitive Obsession: a primitive or string stands in for a domain concept that deserves a type.
- Repeated Switches: the same switch or if-cascade on the same type recurs.
- Shotgun Surgery: one logical change forces scattered edits across many files.
- Divergent Change: one file or module changes for several unrelated reasons.
- Speculative Generality: abstraction, parameters, or hooks are added for needs the spec does not have.
- Message Chains: long navigation makes the caller depend on object traversal details.
- Middle Man: a class or function mostly delegates onward.
- Refused Bequest: a subclass or implementer ignores or overrides most inherited behavior.

When recording findings, assign stable IDs such as `DR-001`, `DR-002`, and preserve those IDs in both `review-report.md` and the append-only review pass report. If a finding recurs from an earlier pass, reuse or reference the prior finding ID instead of creating an unrelated title-only reference.

When using frontend, backend, API, database, or E2E tooling, write temporary verification artifacts for this requirement only under `.spec-workflow/<feature-slug>/verification/`. Use system temp only for tool-mandated scratch files that are not useful as durable evidence. Report generated traces, screenshots, test-results, command logs, API captures, and cleanup status. Continue to prohibit updating committed snapshots or generated production artifacts during review.

## Review Artifact Storage

Persist the final review report in the current project by default when the full spec-driven delivery workflow is in use, when `.spec-workflow/` workflow artifacts already exist, or when durable handoff to `fix-review` is needed:

```text
.spec-workflow/<feature-slug>/review-report.md
.spec-workflow/<feature-slug>/review-reports/<NN>-<pass-slug>.md
.spec-workflow/<feature-slug>/verification/
```

Use these rules:

- Resolve the project root before writing: use the user-provided artifact path first; otherwise reuse an existing applicable `.spec-workflow/` directory; otherwise use the nearest git root; otherwise use the directory containing project guidance such as `AGENTS.md`; if the root cannot be determined uniquely, ask one focused question.
- Reuse the `.spec-workflow/<feature-slug>/` that contains the authoritative requirement, spec, repair spec, or implementation report.
- Do not write review artifacts into production code, committed test directories, migration directories, config directories, generated-build/generated-code directories, dependency directories, lockfile locations, snapshots, or formatting-only files.
- Always write an append-only pass report under `review-reports/` when `.spec-workflow/` workflow artifacts are in use.
- Also update `review-report.md` as the latest canonical review summary and pointer to the newest pass report.
- Number review pass reports from `01` in chronological order within `review-reports/`.
- Generate `<pass-slug>` from the reviewed spec, ticket, repair ticket, or review target using lowercase kebab-case.
- Write both reports with the final aggregated report, not only raw child-agent findings.
- Include artifact authority metadata in both reports: `Authority: external-tracker-only`, `Authority: local-scratch`, or `Authority: local-scratch-plus-tracker`; the source-of-truth tracker or artifact reference; local cache status; and the exact requirement, spec, amendment, repair, implementation, diff, and review sources read.
- If `review-report.md` already exists, read it first and update intentionally instead of blindly overwriting.
- The final response must list the latest review report path and append-only review pass report path written. If no files were written, state that the review was provided only in the response.

Store review-stage verification evidence under `verification/`, including screenshots, traces, test-results, API responses, database observations, command logs, and smoke-test evidence. Do not store durable review evidence outside the requirement's `.spec-workflow/<feature-slug>/` directory unless the user explicitly provides another non-production artifact directory.

Use this `review-report.md` as the durable input for `fix-review`.

## Finding Rules

Record findings with:

- Severity.
- Stable finding ID, such as `DR-001`.
- Title.
- Evidence: file, line, command output, screenshot, browser trace, API response, database observation, or quoted spec requirement.
- Reproduction or verification steps.
- Expected behavior.
- Actual behavior.
- Impact.
- Affected scope.
- Suggested handling path.

Findings must be concrete and evidence-backed. Do not report vague suspicion as a failure; list it as residual risk.

## Aggregation

After all review tasks complete, the main agent must aggregate results. Do not only forward one child task's conclusion.

If child results conflict:

- Identify the conflict.
- Compare evidence quality.
- Decide which conclusion is better supported.
- Preserve the weaker conclusion as residual risk when uncertainty remains.

Classify delivery completion:

- `complete`: all acceptance-critical paths pass and no must-fix finding remains.
- `mostly complete`: core paths pass but non-blocking issues or moderate risks remain.
- `incomplete`: acceptance-critical behavior is missing, broken, unverifiable, or unsafe.
- If no reviewable requirement source exists, classify as `incomplete`.

Ship Decision:

- `can ship`: no must-fix findings and residual risk is acceptable.
- `fix before ship`: one or more must-fix findings exist.
- `do not ship`: critical requirement, data, security, or operational risk makes delivery unsafe.
- Do not choose `can ship` when no reviewable requirement source exists, when real frontend interaction was required but not performed, or when backend restart/service availability was required but unverified.

## Final Output

End with a final review report in the user's language:

- Coordination structure used.
- Goal Mode status for this spec, whether the goal is satisfied, and the next automatic stage or pause reason when enabled.
- Actual review tasks executed.
- Whether built-in code review was used.
- Whether real frontend interaction testing was completed.
- Test and verification methods.
- Completion status: `complete`, `mostly complete`, or `incomplete`.
- Passed items.
- Failed items.
- Standards axis findings.
- Spec axis findings.
- Acceptance and ship-decision findings.
- Reproduction evidence.
- Must-fix items.
- Suggested follow-up items.
- Remaining risks.
- Ship Decision: `can ship`, `fix before ship`, or `do not ship`.
- Review report path written, when `.spec-workflow/` workflow artifacts are in use.
- Append-only review pass report path written, when `.spec-workflow/` workflow artifacts are in use.
- Whether to enter `fix-review`.

## Relationship To Other Skills

This skill is stage 4 of the five-stage spec-driven delivery chain. The package also includes auxiliary skills for bug diagnosis and source research; use those only when their triggers match the task.

1. `to-grill`: clarify requirements and close product/technical uncertainty.
2. `to-spec`: turn closed requirements into an implementation-ready spec and optional tickets.
3. `spec-do`: coordinate and implement from the spec or ticket.
4. `do-review`: run final delivery review without expanding scope or fixing code.
5. `fix-review`: turn review findings into a repair spec.

If this stage finds must-fix issues, recommend `fix-review` as the next stage.
