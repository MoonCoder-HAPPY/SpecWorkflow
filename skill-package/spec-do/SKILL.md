---
name: spec-do
description: >-
  Orchestrate and implement work from an approved spec or ready-for-agent
  tickets. Use when the user invokes /spec-do or $spec-do, asks to implement the current
  spec, execute a spec/ticket plan, execute amended specs, execute fix-review
  repair specs or repair tickets, coordinate internal subagent parallelism, or
  move from to-spec/fix-review artifacts into code. Internalizes implementation,
  test-first validation, integration checking, commit, child-agent coordination,
  and implementation-report behavior.
---

# Spec Do

Use this skill as stage 3 of the spec-driven delivery workflow, and also as the repair implementation pass after `fix-review`. Turn persisted `to-spec` spec/ticket artifacts, amended spec artifacts, or `fix-review` repair-spec/repair-ticket artifacts into working code through a controlled implementation process.

This skill uses built-in implementation behavior plus internal subagent coordination when parallel work is useful and safe. A small local serial implementation is the expected fast path when child agents would add ceremony or risk. All behavior needed for implementation, clarification gates, test-first validation, integration checking, child-agent coordination, and implementation self-review is internalized here. Do not invoke separate implementation, clarification, testing, review, setup, or orchestration skills for this stage, even if the user casually names them; their semantics must be handled by this skill. This does not override platform-required skills, tool-control skills, or non-duplicative user-requested skills.

## Hard Gates

- Write all user-facing plans, questions, reports, summaries, and handoff notes in the language of the latest substantive user request; keep code identifiers, paths, API names, skill names, commit refs, and command output unchanged.
- Treat the persisted `to-spec` spec/ticket files or `fix-review` repair-spec/repair-ticket files as authoritative unless the user explicitly designates another source.
- Read the spec, relevant ticket files, current project guidance, and affected code before changing files.
- Read the current spec's Goal Mode metadata before deciding whether to auto-continue after implementation. Goal Mode applies only to the current spec or current amendment that explicitly enabled it.
- Do not expand scope beyond the approved spec or ticket. Record out-of-scope discoveries as follow-up work.
- Do not invent missing business rules, data semantics, permission behavior, acceptance criteria, migration strategy, rollback behavior, or external service contracts.
- If a required product or business decision is missing, use the built-in grilling gate: ask exactly one focused question with a recommended answer, explain the impact, and wait for the user before implementing that branch.
- If the spec conflicts with current code, pause the affected branch, name the conflict, and decide whether the spec needs adjustment or the code needs repair. Ask the user only when the decision is product/business-facing.
- Do not fake implementation, mock a success path as the real path, hard-code business results, create UI-only closure for backend behavior, leave TODO pseudo-completion, silently swallow errors, or bypass real logic only to satisfy tests.
- Before implementation, decide whether the approved work should run as local serial implementation or use internal subagents. Do not ask the user to choose an execution mode merely for process.
- Use local serial implementation for simple, concrete, low-risk changes, tightly coupled edits, same-file changes, unstable contracts, product decisions, or any task where child agents would add coordination overhead without reducing risk.
- Use internal subagents only when the task can be split into meaningful independent slices with non-overlapping write scopes, stable contracts, clear dependencies, and independently verifiable outputs.
- If internal subagent tooling is unavailable, continue with local serial implementation when the task is small enough or can be safely serialized. If the task truly requires parallel child work, pause and report the blocker.
- Do not invoke external orchestration skills, external coordination runtimes, or external orchestration commands for implementation coordination.
- You may update non-production workflow artifacts under `.spec-workflow/<feature-slug>/`, such as ticket statuses and `implementation-report.md`, as part of durable handoff.
- Before ending, wait for every child agent started by this skill. If a child agent is stuck or silent for a long time, use the built-in stalled-child policy below before exiting.

## Inputs

Prefer inputs in this order:

0. An explicit external issue tracker item when the user, project guidance, or local artifact marker says `Authority: external-tracker-only`.
1. A specific repair ticket file under `.spec-workflow/<feature-slug>/repair-issues/`.
2. A specific ticket file under `.spec-workflow/<feature-slug>/issues/`.
3. A specific repair spec file under `.spec-workflow/<feature-slug>/repair-spec.md`.
4. A specific spec file under `.spec-workflow/<feature-slug>/spec.md`.
5. The current conversation if it includes the full approved spec or repair spec.
6. An explicit external issue tracker item when it is authoritative but not the only source of truth.

When a spec references tickets, read the ticket being implemented and all blockers that define its context. When implementing the full spec, read all ticket files if they exist.

If any selected input carries `Authority: external-tracker-only`, read executable status, blockers, dependencies, reopened decisions, override decisions, current acceptance criteria, and Goal Mode authorization from the named tracker item before creating the DAG. Treat local `.spec-workflow` spec, amendment, ticket, and Goal Mode metadata as cache metadata only; do not let stale local `Status`, `Blocked by`, dependency, acceptance, or Goal Mode fields override the tracker.

Before creating the DAG, parse each local ticket's `Status`. Tickets marked `ready-for-agent` are executable. Tickets marked `in-progress` are resumable only when continuing prior work after reading `implementation-report.md`, confirming no live child agent still owns the ticket, reconciling changed files against the dirty-worktree baseline, and reporting the resumed owner. Treat any other active status as executable only with explicit user approval in the current request. Do not implement tickets marked `superseded`, `cancelled`, `deferred`, `done`, or `blocked` unless the user explicitly reopens or overrides that status in the current request. When implementing the full spec, include only executable or safely resumable tickets in the DAG and list skipped tickets with their status.

When continuing prior implementation work, read `.spec-workflow/<feature-slug>/implementation-report.md` when present to recover the latest coordination structure, fixed point, completed tickets, in-progress tickets, blocked tickets, changed files, validation results, child-agent ownership, and remaining risks. Present the recovered coordination state before changing files. Read relevant files under `.spec-workflow/<feature-slug>/implementation-reports/` only when historical pass context affects the current ticket, repair pass, conflict, or regression risk.

When `.spec-workflow/<feature-slug>/amendments/` exists, treat `spec.md` and `issues/` as the latest canonical implementation inputs. Before deciding relevance, scan every amendment record's header or metadata fields for affected spec sections, affected tickets, dependency changes, testing decision changes, and implementation status impact. Then fully read the amendment records that affect the target spec, target ticket, dependencies, acceptance criteria, testing seams, or implementation status. If an amendment says implementation must pause, redo a ticket, or start a new pass, honor that instruction before changing files.

When implementing a repair pass from `fix-review`, read the `repair-spec.md`, the target repair ticket when present, every blocking repair ticket that defines context, and the original `spec.md` or `issues/` files when they exist in the same feature directory. The repair artifacts narrow the implementation scope; the original spec and tickets provide background, not permission to expand scope beyond the repair plan.

When `.spec-workflow/<feature-slug>/repair-specs/` exists, scan the append-only repair pass records for historical repair decisions, accepted risks, superseded repair scope, and prior repair context before implementing the current repair spec or repair ticket. Fully read only the repair pass records that affect the current repair target, dependencies, acceptance criteria, testing seams, or implementation status.

Also read relevant project guidance such as `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/`, ADRs, existing specs, or issue files when they affect implementation.

## Goal Mode Scope

Goal Mode can only be activated by metadata in the current authoritative spec source and latest applicable amendment. When `Authority: external-tracker-only` applies, the current authoritative spec source is the tracker item and local `.spec-workflow` artifacts are non-authoritative cache. Never carry Goal Mode across specs, feature directories, issues, repair plans for a different spec, or future amendments.

Use these precedence rules:

- Authorization source: the current authoritative `spec.md` plus the latest applicable amendment record, or the authoritative tracker spec/amendment when `Authority: external-tracker-only` applies. These are the only sources that can enable, disable, narrow, or broaden Goal Mode.
- Runtime ledger: `implementation-report.md` and append-only `implementation-reports/` record current cycle number, remaining budget, next automatic stage, validation state, child-agent state, and pause reason. They do not authorize Goal Mode by themselves.
- If authorization metadata and runtime ledger disagree, honor the current spec or latest applicable amendment, record the mismatch, and pause unless the safe interpretation is clearly to disable Goal Mode.
- If a later amendment exists without a fresh user-confirmed Goal Mode decision for that amendment, treat Goal Mode as disabled or paused until the user chooses again.
- If `Authority: external-tracker-only` applies and the tracker does not expose a readable, current, user-confirmed Goal Mode authorization anchor for the current spec version, treat Goal Mode as disabled or paused until the user chooses again.

When Goal Mode is enabled for the current spec:

- Continue from this implementation pass into `do-review` when implementation and validation reach a stable reviewable state.
- If `do-review` returns must-fix findings and the repair cycle limit has not been reached, continue into `fix-review`, then return to `spec-do` for the generated repair spec or repair tickets.
- Stop the loop when `do-review` classifies the delivery as `complete` and Ship Decision is `can ship`, or when the explicit goal target recorded in the spec is satisfied.
- Treat `implementation-report.md` as the canonical repair-cycle ledger for the current spec version. Initialize it from the authorized maximum repair cycles when the first Goal Mode implementation pass starts.
- `spec-do` must not decrement repair cycles merely because a repair implementation ran. It records repair implementation status, validation results, and the current reserved cycle ID from the ledger.
- `do-review` owns repair-cycle reservation and completion: reserve the next cycle immediately before it auto-enters `fix-review`; mark that reserved cycle completed and decrement remaining budget only after the follow-up repair `do-review` report is written.
- Record the current cycle number, reserved cycle ID when present, completed cycles, remaining cycle budget, next automatic stage, and source authorization anchor in `implementation-report.md`.

Even in Goal Mode, pause and ask the user before continuing when any required pause condition recorded in the spec occurs, including product/business ambiguity, scope expansion, unsafe git operation, unclassified dirty files, failed validation requiring risk acceptance, destructive or production-impacting verification, unrecoverable child-agent failure, or exhausted repair cycle budget.

When Goal Mode is disabled or absent, finish with the normal final implementation report and recommend the next stage instead of entering it automatically.

## Coordination Choice

After reading the spec inputs and before producing the executable DAG, choose the narrowest coordination structure that can complete the work safely:

1. Local serial implementation: the main agent implements the work directly with no child agents.
2. Internal subagents: the main agent coordinates parallel or semi-parallel child work and remains responsible for integration, conflict control, validation, and final reporting.

Prefer local serial implementation when the task is simple, one-file, tightly coupled, uncertain, or likely to involve product decisions. Prefer internal subagents only when parallelism materially reduces risk or time and the work can be split without overlapping writes or unstable contracts.

State the chosen coordination structure, the reason, and whether any child agents will be started. Ask the user only when the choice changes product/business behavior, creates safety risk, or cannot be made from the available context.

## Workflow Git Baseline Check

Before changing files, consume the git entry metadata from the authoritative `requirements.md`, `spec.md`, amendment record, repair spec, or repair ticket when it exists.

- If the project is not a git repo, state that no git baseline can be checked and continue.
- If no prior git entry metadata exists, create a local implementation baseline by recording the current branch, `HEAD`, and `git status --porcelain=v1 -uall`; then continue with the Implementation Commit Gate.
- If prior git entry metadata exists, compare the current repo path, branch, `HEAD`, and dirty-worktree state against the recorded workflow entry decision.
- If the user chose a specific current branch or new branch in `to-grill` or `to-spec`, stop before implementation when the current branch differs. Ask whether to switch to the recorded branch, continue on the current branch, or pause.
- If the recorded starting `HEAD` differs from the current `HEAD`, classify the difference as expected prior implementation work, user-approved branch movement, or unknown drift. Continue only when the current request or artifacts make the movement safe; otherwise ask one focused question.
- If new dirty files appeared after the recorded dirty baseline, list them separately from pre-existing dirty files and ask whether to include them as intentional context, leave them unrelated and excluded, commit/stash/clean manually, or pause.
- Do not switch branches, stash, reset, clean, or commit during this baseline check unless the user explicitly confirms that exact operation.
- Record the baseline check result in `implementation-report.md`, including prior metadata source, current branch and `HEAD`, mismatch decisions, new dirty files, and whether implementation proceeded.

## Implementation Commit Gate

After the coordination structure is chosen and before changing production, test, migration, config, generated, dependency, or committed workflow artifact files beyond the baseline/commit-gate records, ask whether this implementation pass may automatically create a git commit after successful completion.

This is separate from the workflow git entry gate in `to-grill` or `to-spec`:

- The entry gate decides branch and dirty-worktree handling before the workflow starts.
- The implementation commit gate decides whether this implementation pass may commit its own completed changes.

Gate rules:

- If the project is not a git repo, state that automatic commit is unavailable and continue without commit behavior.
- Workflow artifact writes needed to record the baseline check, coordination choice, commit-gate question, and commit-gate answer may happen before this gate is answered. Do not treat those records as permission to change production, test, migration, config, generated, dependency, or unrelated workflow files.
- If the user says no, do not commit in this pass. Record the changed files, diff status, validation results, and remaining risks in `implementation-report.md`.
- If the user says yes, record `Auto-commit allowed: yes` in `implementation-report.md` before editing and commit only after implementation, integration, and agreed validation are complete.
- A prior project rule or user request to commit is not enough to skip this gate unless the current request explicitly grants automatic commit permission for this pass.
- If the current spec's Goal Mode metadata explicitly grants auto-commit for this spec, treat that as the current-pass commit permission only while implementing this spec or its in-scope repair passes. Do not reuse it for another spec, another branch, unrelated dirty files, failed validation, auto-push, or destructive git operations.
- Do not auto-push.
- Do not commit when validation failed unless the user explicitly approves a failed-state commit after seeing the failed validation summary.
- Do not commit unresolved conflicts, unrelated pre-existing dirty files, local secrets, generated build output, dependency cache files, or temporary verification artifacts.
- Before committing, show the exact files proposed for the commit and compare them against the initial dirty-worktree baseline. Include only files changed by this implementation pass plus relevant `.spec-workflow/<feature-slug>/` handoff artifacts.
- If child agents changed files, aggregate their outputs first, run the main-agent integration check, then make one scoped commit unless the user explicitly approved multiple commits.
- Use a commit message that references the spec, ticket, repair spec, or repair ticket and includes the validation summary and the winning debugging or implementation hypothesis when relevant.
- Record the commit hash in `implementation-report.md`, the append-only pass report, and completed ticket or repair-ticket files.

## Internal Subagent Coordination

Use this section only when the chosen coordination structure includes internal subagents.

Use the current environment's subagent tools directly. The main agent remains the coordinator and must:

- Define each internal subagent task with its prompt, context, allowed scope, forbidden scope, expected outputs, acceptance criteria, verification commands, dependency, and completion requirements.
- Start only tasks whose dependencies are satisfied and whose write scopes do not overlap.
- Track every internal subagent ID, status, output, changed files, verification result, and blocker.
- Wait for all internal subagents before final reporting.
- Close completed subagents when they are no longer needed.
- Resolve conflicts manually by pausing merges, identifying overlap, choosing merge order, and dispatching the smallest repair task needed.
- Keep a visible coordination ledger in the implementation report because the main agent is the source of truth for child-agent status.

Do not use internal subagents for tasks that require a single tightly coupled edit path, unstable contracts, same-file modifications, or product decisions. In those cases, run the task serially in the main agent or create a decision gate.

If the DAG contains no safe or useful child-agent tasks, implement serially in the main agent and report that no child agents were started. If internal subagent tooling is unavailable, use local serial implementation when safe; otherwise pause and report the blocker.

## Child Agent Recovery Policy

Apply this policy to every implementation, review, or verification child task started by this skill.

- If a child agent stops because of an API call error, model service interruption, network timeout, transient tool transport failure, or context delivery interruption, do not immediately treat the task as failed.
- First send a continuation instruction to the same child agent in the user's language, equivalent to: `Please continue from the interruption. Do not restart completed work. First summarize what is already done and what remains, then continue.`
- Localize the continuation instruction to the latest substantive user request language. For Chinese users, send the Chinese equivalent of "please continue from the interruption; do not restart completed work; first summarize what is already done and what remains, then continue."
- Allow at most two recovery attempts for the same child task after transient infrastructure failures.
- After each recovery attempt, record the attempt number, failure reason, continuation message, and resumed status in `implementation-report.md`.
- Do not use this recovery policy for real task failures such as permission denial, missing files, invalid commands, failing tests, merge conflicts, spec ambiguity, product decisions, or evidence that the child changed files outside its allowed scope. Handle those as blockers, conflicts, or decision gates.
- If the same child task cannot recover after the allowed attempts, mark it unrecoverable, preserve its partial output, and choose the smallest safe next action: spawn a replacement child with the recovered context, run the remaining work in the main agent, serialize the remaining DAG, or pause and report the blocker.
- Before final reporting, wait for every recovered or replacement child agent and close completed internal subagents when they are no longer needed.

## Stalled Child Policy

Use this policy when a child agent is silent, appears stuck, or has not produced useful progress for a long time without a clear transient API/tool interruption:

- Treat `30 minutes` without meaningful output or status change as stalled unless project guidance sets a stricter limit.
- Before stopping a stalled child, inspect any available status, terminal/output snapshot, partial files, and last reported phase.
- Send one continuation instruction to the same child in the user's language, equivalent to: `Please continue. First summarize your current state, any completed work, any blockers, and the remaining plan.`
- If the child resumes, keep coordinating it and record the stall and recovery in `implementation-report.md`.
- If the child remains stalled after the continuation window, stop, close, or kill only that child using the current environment's supported child-agent control. Do not kill unrelated terminals, processes, or agents.
- Preserve and record the partial output, changed files if any, suspected ownership state, and remaining scope.
- Mark the child task `unrecoverable-stalled` in the coordination ledger, then choose the smallest safe next action: start a replacement child with the recovered context, serialize the remaining work in the main agent, reduce scope to completed safe work, or pause and report the blocker.
- Before final reporting, wait for every replacement child and close completed child agents when they are no longer needed.

## Initial Implementation Analysis

Before drafting the execution DAG or changing files:

- Restate the implementation goal and non-goals from the spec.
- Identify affected modules, public interfaces, data paths, migrations, configs, generated artifacts, tests, docs, and operational surfaces.
- Identify file or module conflict risks, especially files likely to be touched by multiple agents.
- Identify key validation paths: typecheck, focused tests, integration tests, UI checks, migrations, service startup, smoke checks, and full suite expectations.
- Identify risk areas: permissions, security, audit, error visibility, idempotency, rollback, old data compatibility, concurrency, performance, and observability.
- Confirm whether the task is small enough for local serial implementation or large enough for parallel child agents.
- If the project is a git repo, record the implementation fixed point before editing, usually `HEAD`. Use it later for diff review, commit review, and final reporting.
- If the project is a git repo, record the initial `git status --porcelain`, current branch, and unrelated dirty files before editing. Preserve this dirty-worktree baseline in `implementation-report.md` so `do-review` can distinguish implementation changes from pre-existing user work.

## Implementation DAG

Produce an implementation DAG before delegating or implementing. Include each task with:

- Task ID and name.
- Goal.
- Input context: spec path, ticket path, blocker context, relevant docs, relevant modules, and verification seams.
- Allowed modification scope.
- Forbidden modification scope.
- Expected outputs.
- Dependencies.
- Acceptance criteria.
- Responsible role.
- Whether it needs code implementation.
- Whether it should use a child agent.
- Whether it can run in parallel.
- Merge or integration order.

Only mark tasks parallel when all are true:

- Write scopes do not overlap.
- Dependencies are clear and already satisfied.
- Contracts are stable enough for independent work.
- Outputs are independently verifiable.
- Merge order is explicit.

Set a serial dependency or decision gate when tasks may touch the same files/modules, depend on an unstable API contract, require migration ordering, or need a product decision.

Do not split work just for ceremony. For small tasks, state why parallel child work is unnecessary, then implement locally using the implementation rules below.

## Child Agent Boundaries

Do not assume fixed specialist child agents exist. Define each child task explicitly with:

- Prompt.
- Required context.
- Allowed files/modules.
- Forbidden files/modules.
- Expected artifacts or patch scope.
- Acceptance criteria.
- Verification commands.
- Dependency or blocker relationship.
- Completion signal required by the child-agent coordination ledger.

Useful slices may include API contract, backend behavior, database migration, frontend flow, test gaps, documentation updates, focused verification, and final integration check. Adapt the slices to the actual spec.

Use explicit handoff artifacts between tasks, such as API contract shape, migration result, service behavior, frontend integration point, test result, or review finding. Avoid multiple agents editing the same file or module at the same time.

## Built-In Implementation Rules

Implement the work described by the spec or ticket using the implementation behavior internalized in this section. In the DAG and final report, still track which tasks required this built-in implementation behavior; this preserves the implementation audit dimension without invoking an external implementation skill.

Prefer test-driven development at the seams agreed in `to-spec` or in the `fix-review` repair spec's testing decisions.

Before writing any test:

- Write down the public seams under test.
- Confirm the seams with the user when the spec does not already contain an explicit testing-seam decision.
- Do not write tests at an unconfirmed seam.
- Use `CONTEXT.md`, ADRs, and project vocabulary so test names and interfaces match the domain.

When TDD is appropriate:

- Test behavior through public seams, not private implementation details.
- Use the pre-agreed seams from the spec; do not invent lower-level seams unless the spec is insufficient and the user confirms the change.
- Write one failing test first.
- Implement only enough code to pass that test.
- Repeat one vertical slice at a time.
- Keep refactoring separate from the red-green loop; refactor only when tests are green and the refactor is needed for the approved work.

Avoid weak tests:

- Do not assert tautologies where expected values are recomputed the same way as implementation.
- Use independent expected values from a known-good literal, a worked example, or the spec.
- Mock only at system boundaries: external APIs, time/randomness, file system when needed, and databases only when a test database is not the better choice.
- Do not mock system business logic, domain rules, permission decisions, validation rules, state transitions, or success-path behavior that belongs to the application under test.
- Do not mock your own classes, modules, internal collaborators, or anything you control.
- At mockable system boundaries, prefer dependency injection so external clients are passed in rather than created internally.
- Prefer SDK-style boundary interfaces with one specific operation per function over generic fetchers that require conditional mock logic.
- Do not write broad horizontal batches of tests for imagined behavior before implementing a vertical slice.
- Do not change tests to fit a wrong implementation unless the spec or user changes the expected behavior.

During implementation:

- Respect repo patterns, architecture, ADRs, lint rules, and existing helper APIs.
- Keep edits scoped to the approved task and affected ownership boundaries.
- Prefer existing public interfaces and testing seams.
- Run typechecking regularly when the project supports it.
- Run focused tests regularly, especially after each meaningful slice.
- Run the full relevant suite once near the end when feasible.
- If full-suite execution is impractical, run the highest-signal focused checks and explain the residual risk.
- Commit the completed implementation only when the Implementation Commit Gate for this pass explicitly allows it. Follow that gate even when project guidance normally expects commits.

Testing and verification file placement:

- Real regression, unit, integration, and E2E tests that should remain part of the project belong in the repo's existing test locations and naming conventions.
- Temporary verification outputs, traces, screenshots, logs, command captures, one-off harnesses, debug scripts, captured payloads, and disposable fixtures for this requirement belong under `.spec-workflow/<feature-slug>/verification/` or `.spec-workflow/<feature-slug>/debug/`.
- Do not write temporary verification or debug artifacts into production code, committed test directories, migration directories, config directories, generated-build/generated-code directories, dependency directories, lockfile locations, snapshots, or formatting-only files.
- If a temporary artifact must remain after completion because it is useful evidence, document its path, reason, and cleanup expectation in `implementation-report.md`.

## Workflow Artifact Updates

Persist implementation handoff artifacts in the same feature directory as the spec or repair spec:

```text
.spec-workflow/<feature-slug>/implementation-report.md
.spec-workflow/<feature-slug>/implementation-reports/<NN>-<pass-slug>.md
.spec-workflow/<feature-slug>/verification/
.spec-workflow/<feature-slug>/debug/
```

Use these rules:

- Resolve the project root before writing: use the user-provided artifact path first; otherwise reuse an existing applicable `.spec-workflow/` directory; otherwise use the nearest git root; otherwise use the directory containing project guidance such as `AGENTS.md`; if the root cannot be determined uniquely, ask one focused question.
- Reuse the `.spec-workflow/<feature-slug>/` that contains the authoritative `spec.md`, `issues/`, `repair-spec.md`, or `repair-issues/`.
- Always write an append-only pass report under `implementation-reports/` before final reporting when `.spec-workflow/` workflow artifacts are in use.
- Also update `implementation-report.md` as the latest canonical implementation summary and pointer to the newest pass report.
- Number pass reports from `01` in chronological order within `implementation-reports/`.
- Generate `<pass-slug>` from the implemented spec, ticket, repair ticket, or pass goal using lowercase kebab-case.
- If `implementation-report.md` already exists, read it first and update intentionally instead of blindly overwriting.
- If implementing a ticket under `issues/`, update that ticket's `Status` to `in-progress`, `done`, or `blocked` as the work proceeds.
- If implementing a repair ticket under `repair-issues/`, update that repair ticket's `Status` to `in-progress`, `done`, or `blocked` as the work proceeds.
- When blocking a ticket, record the blocker, the required decision or dependency, and the next allowed stage.
- When completing a ticket, record the implementation-report path, validation result, commit hash when available, and remaining risk in the ticket.
- Do not update production files only to reflect workflow status. Keep workflow state in `.spec-workflow/` or the user-designated external tracker.
- Store implementation-stage temporary verification evidence under `verification/`, including screenshots, traces, test-results, command logs, API captures, and smoke-test evidence.
- Store disposable debug helpers under `debug/`, including one-off scripts, harnesses, captured payloads, and temporary fixtures that are not intended to become project tests.
- Remove temporary artifacts when they are no longer useful. If kept, record why they remain and whether later cleanup is expected.

The implementation report must include:

- Latest canonical report path and append-only pass report path.
- Spec, ticket, repair spec, repair ticket, and amendment paths read.
- Artifact authority marker, including external tracker reference when `Authority: external-tracker-only`.
- Coordination structure chosen.
- Goal Mode status for this spec, current cycle number, remaining repair cycle budget, and next automatic stage when enabled.
- Implementation fixed point and current commit or diff status.
- Initial dirty-worktree baseline and unrelated pre-existing changes.
- Execution DAG and actual task status.
- Child agents started, with completion status.
- Ticket and repair-ticket status changes.
- Files or modules changed.
- Validation commands and results.
- Backend restart or service availability status, when relevant.
- Built-in review findings by Standards, Spec, and Scope axes.
- Blocked, deferred, and out-of-scope items.
- Remaining risks.

## Scope And Conflict Control

If implementation reveals work outside the current spec:

- Stop expanding that branch.
- Describe the discovery.
- Classify it as required-for-this-ticket, follow-up ticket, spec gap, or accepted risk.
- Continue only with the approved in-scope path.

If code and spec conflict:

- Pause the affected task.
- Cite the spec requirement and the observed code reality.
- Check whether an amendment record already resolves the conflict or changes the canonical requirement.
- Decide whether the implementation can adapt without changing product semantics.
- Use the built-in grilling gate when the choice changes product behavior, data semantics, permissions, rollout, or acceptance criteria. Ask one decision question with a recommendation and wait before expanding implementation.

If child agents conflict:

- Stop merging the conflicting outputs.
- Identify the overlapping files, modules, contracts, or assumptions.
- Choose a merge order or create a decision gate.
- Re-dispatch only the minimum repair task needed.

## Integration Check

After all local and child-agent implementation tasks complete, the main agent must perform a unified integration check across:

- Frontend/backend contract alignment.
- API behavior and error responses.
- Database migrations, entity/model mapping, repositories, and old data compatibility.
- UI loading, error, empty, partial, retry, and success states.
- Permissions, security, and audit behavior.
- Error diagnosability through logs, alerts, traces, or user-visible messages.
- Test coverage at the agreed seams.
- Documentation or artifact synchronization.
- New risks introduced by the implementation.

If backend code, resources, configuration, migrations, or dependencies changed, restart or start the backend using the repo's documented command and verify the service is available. If the repo does not document a restart command, discover the likely command from package scripts, compose files, process managers, or project guidance; if still unclear, report the uncertainty instead of inventing success.

Run an implementation self-check before final reporting:

- Establish the review diff from the recorded fixed point to the current work. In git repos, resolve the fixed point with `git rev-parse <fixed-point>` and stop the review if it does not resolve. Prefer `git diff <fixed-point>...HEAD` after commit; before commit, use the equivalent diff that captures all implementation changes from the fixed point.
- Use the initial dirty-worktree baseline from `implementation-report.md` to exclude or label unrelated pre-existing changes during the built-in review.
- Confirm the review diff is non-empty before claiming a review occurred. If there is no diff, report that no implementation diff was available for review.
- Note the commit list when commits exist.
- Identify the spec source in this order: an explicit external tracker item when the user, project guidance, or local artifact marker says `Authority: external-tracker-only`; a specific repair ticket or repair spec path supplied by the user or artifacts; a specific ticket or spec path supplied by the user or artifacts; canonical `.spec-workflow/<feature-slug>/repair-spec.md` and relevant `repair-issues/` when reviewing a repair pass; canonical `.spec-workflow/<feature-slug>/spec.md`, relevant `issues/`, and scanned amendment records that affect the implemented work; original request, current conversation, and lightweight acceptance notes for fast-path/direct implementations; issue references in commit messages when a documented tracker workflow exists; a matching PRD/spec under `docs/`, `specs/`, or `.spec-workflow/`; then ask the user if no source is found. If no spec exists, the Spec axis must explicitly say "no spec available".
- When `.spec-workflow/<feature-slug>/amendments/`, `repair-spec.md`, or `repair-issues/` exist and affect the implemented work, include them in the Spec axis source set instead of reviewing only the original `spec.md`.
- Identify standards sources: repo guidance such as `CODING_STANDARDS.md`, `CONTRIBUTING.md`, `AGENTS.md`, `CLAUDE.md`, ADRs, docs, or local conventions in the touched area.
- Do not invoke an external setup skill. If tracker setup docs are missing, use explicit user-provided tracker instructions or local spec artifacts; otherwise keep the review local.
- Standards axis: check the diff against documented repo standards and the smell baseline below. Repo standards override the smell baseline. Treat baseline smells as judgement calls, not hard violations. Skip anything already enforced by tooling.
- Spec axis: check whether the diff faithfully implements the originating spec or ticket, whether any requirement is missing or partial, whether behavior was added beyond scope, and whether any implemented requirement looks wrong.
- Scope axis: confirm no unapproved behavior was added.
- Keep Standards and Spec axes isolated. Use separate internal review child agents for the two axes when child-agent review is safe and available. If local review is the only safe option, perform the axes separately in sequence and report that isolation was local rather than child-agent-based.
- Aggregate Standards and Spec findings side by side. Do not merge, rerank, or pick a single overall winner across the axes.
- Fix clear implementation misses before final reporting when the fix is in scope and safe. If the finding requires new product scope or a changed requirement, record it as blocked or follow-up instead of expanding scope.

Use this smell baseline for the Standards axis:

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

This built-in review internalizes the implementation-stage code review expectation, but it is not a replacement for the later `do-review` stage. Use it to catch obvious implementation misses before handing off.

## Final Output

End with a final implementation report in the user's language:

- Coordination structure used.
- Parallel and serial task split.
- Actual child agents started.
- Which tasks required built-in implementation behavior, and whether they were completed locally or by child agents.
- Completion status for each task.
- Files or modules changed.
- Implemented capabilities.
- Validation commands and results.
- Implementation report path written, when `.spec-workflow/` workflow artifacts are in use.
- Append-only implementation pass report path written, when `.spec-workflow/` workflow artifacts are in use.
- Backend restart or service availability status, when relevant.
- Built-in review result, separated into Standards, Spec, and Scope axes.
- Commit hash, if committed.
- Unfinished or blocked work.
- Out-of-scope discoveries or follow-up tickets needed.
- Remaining risks.
- Whether the work is ready for the final `do-review` stage.
- If Goal Mode is enabled, whether the agent auto-entered `do-review`, paused for a required decision, or stopped because the goal was satisfied.

## Relationship To Other Skills

This skill is stage 3 of the five-stage spec-driven delivery chain. The package also includes auxiliary skills for bug diagnosis and source research; use those only when their triggers match the task.

1. `to-grill`: clarify requirements and close product/technical uncertainty.
2. `to-spec`: turn closed requirements into an implementation-ready spec and optional tickets.
3. `spec-do`: coordinate and implement from the spec or ticket.
4. `do-review`: run final delivery review without expanding scope.
5. `fix-review`: turn review findings into a repair spec.

Use the persisted `to-spec` artifacts or `fix-review` repair artifacts as input. After this stage completes, recommend `do-review` when the implementation is complete enough for final review.
