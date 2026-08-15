---
name: fix-review
description: >-
  Turn final do-review findings into a repair spec and optional repair tickets
  without changing code. Use when the user invokes /fix-review or $fix-review, asks to plan
  fixes after final review, wants must-fix findings organized for repair, or
  needs a spec that can drive the next repair implementation pass. Internalizes
  repair planning, clarification, and ticket-splitting behavior; produces
  repair execution guidance that later spec-do can implement serially or with
  internal subagents.
---

# Fix Review

Use this skill as stage 5 of the spec-driven delivery workflow. The goal is to convert final review findings into a complete, executable repair spec. This stage plans repairs; it does not modify code.

This skill internalizes the behavior needed for review repair planning, clarification, and repair ticket splitting. Do not invoke separate spec-planning, clarification, ticketing, implementation, setup, orchestration skills, external coordination runtimes, or external orchestration commands from this stage, even if the user casually names them; their semantics must be handled by this skill. Refer to `spec-do` only as the later execution stage after this planning stage completes. This does not override platform-required skills, tool-control skills, or non-duplicative user-requested skills.

## Hard Gates

- Do not write or modify production code, tests, migrations, configs, generated-build artifacts, generated-code artifacts, dependencies, lockfiles, snapshots, or formatting-only files.
- You may write non-production planning artifacts for this stage, such as `.spec-workflow/<feature-slug>/repair-spec.md` and `.spec-workflow/<feature-slug>/repair-issues/`, when artifact storage applies.
- Write all user-facing questions, repair specs, tickets, summaries, recommendations, artifact content, and final reports in the language of the latest substantive user request; keep code identifiers, paths, API names, skill names, commit refs, and command output unchanged.
- Base the repair plan on final `do-review` findings, evidence, original requirements, specs, tickets, implementation records, and relevant code context.
- Read Goal Mode authorization from the current spec and latest applicable amendment when present. Read `implementation-report.md` only for runtime repair-cycle ledger state, and read `review-report.md` only as evidence for findings and ship decision. Goal Mode applies only to the current spec version that explicitly enabled it.
- Do not create commits, amend commits, create branches, switch branches, stash, reset, or clean the worktree during this planning stage. Report any needed git operation as a recommendation for the user or the next `spec-do` implementation stage.
- Do not expand scope beyond fixing review findings and required regressions. Record unrelated discoveries as follow-up work.
- Do not invent business expectations, interaction rules, data definitions, calculation/reporting rules, data semantics, permission boundaries, compatibility strategy, acceptance criteria, or ship decisions.
- If a required decision is unclear, use the built-in grilling loop: ask exactly one decision question using the Decision Question Format below, include your recommended option, explain the impact, and wait before planning that branch.
- Continue grilling until each repair-critical ambiguity is closed, deferred, out of scope, or explicitly accepted as risk.
- If a finding lacks evidence, mark it as insufficiently evidenced and either investigate context or classify it as residual risk; do not plan speculative repairs as must-fix work.

## Decision Question Format

Use this format for every user-owned decision in this skill, including repair scope, evidence sufficiency, accepted risk, Goal Mode repair handoff, repair ticket granularity, blocking edges, and merge/split choices:

- Ask exactly one decision question at a time.
- Present 2-4 explicit options. Each option must have a short label and a one-line consequence or tradeoff.
- Mark one option as recommended when context supports a recommendation.
- Let the user answer by option label, short free text, or a custom alternative.
- Do not ask open-ended confirmation questions such as "Do you confirm?", "Is this OK?", or "Yes/no?" when more than one reasonable path exists.
- For tracker writes or other externally visible changes, first present the options, then require exact confirmation of the chosen target and scope before executing it.

## Fast-Path Guard

Before drafting a formal repair spec, check whether the review finding should bypass the repair-planning workflow.

Do not apply this fast-path guard while Goal Mode is active. In Goal Mode, every must-fix finding that remains in scope must produce a minimal `fix-review` handoff artifact so the automatic loop has a durable input for the next `spec-do` pass. The only exception is when the user explicitly interrupts Goal Mode and authorizes direct repair for this same finding.

Bypass `fix-review` when all are true:

- The finding is concrete, low risk, and evidence-backed.
- The repair is an obvious direct edit.
- The repair does not change product behavior, API/data contracts, permissions, acceptance criteria, testing seams, ticket boundaries, rollout, migration, or cross-module design.
- A focused verification is enough.

When this guard applies, do not write `repair-spec.md`, `repair-specs/`, or `repair-issues/`. Tell the user briefly that the finding does not need the formal repair-spec workflow and recommend direct implementation. If the user wants traceability or explicitly asks for repair artifacts anyway, continue with this skill.

## Inputs

Gather inputs before drafting the repair spec:

- Final `do-review` report and all findings.
- `.spec-workflow/<feature-slug>/review-report.md` when present.
- Relevant `.spec-workflow/<feature-slug>/review-reports/` entries when historical review context affects the repair target.
- Original requirements and non-goals.
- `.spec-workflow/<feature-slug>/requirements.md` when present.
- `.spec-workflow/<feature-slug>/spec.md` and `.spec-workflow/<feature-slug>/issues/` when present.
- `.spec-workflow/<feature-slug>/amendments/` when present and relevant to the reviewed implementation.
- Existing `.spec-workflow/<feature-slug>/repair-spec.md` and `.spec-workflow/<feature-slug>/repair-issues/` when continuing a repair pass.
- Relevant `.spec-workflow/<feature-slug>/repair-specs/` entries when historical repair decisions affect current findings or accepted risks.
- `.spec-workflow/<feature-slug>/implementation-report.md` when present.
- Relevant `.spec-workflow/<feature-slug>/implementation-reports/` entries when historical implementation context affects the repair target.
- `spec-do` implementation report and verification results.
- Relevant code, tests, docs, ADRs, issue tracker docs, and project guidance.
- Current ship decision and whether each finding blocks delivery.

Respect `Authority: external-tracker-only` markers in any review, spec, ticket, amendment, implementation, repair, or tracker-cache artifact. When present, read the named tracker item as the authoritative repair-planning source and Goal Mode authorization source before relying on local `.spec-workflow` files.

When `.spec-workflow/<feature-slug>/amendments/` exists, scan every amendment record's header or metadata fields for affected spec sections, affected tickets, dependency changes, testing decision changes, and implementation status impact before deciding relevance. Then fully read amendment records that affect the reviewed implementation, repair target, findings, dependencies, acceptance criteria, testing seams, or implementation status.

When continuing an existing repair plan, parse existing `repair-issues/` before triage. Map current findings to prior repair tickets by stable review finding ID such as `DR-001`, review title, and affected scope. Preserve `done` tickets unless new evidence explicitly reopens the finding. Preserve `blocked` tickets until the blocker is closed or the user explicitly overrides it. Treat `in-progress` repair tickets as resumable only after reconciling ownership and changed files from `implementation-report.md`. Do not reset prior `superseded`, `cancelled`, or `deferred` repair tickets to `ready-for-agent` unless the user explicitly reopens them.

## Goal Mode Repair Handoff

When Goal Mode is enabled for the current spec only:

- Determine authorization only from the current authoritative `spec.md` plus the latest applicable amendment record, or the authoritative tracker spec/amendment when `Authority: external-tracker-only` applies. Use `implementation-report.md` as the canonical runtime repair-cycle ledger and `review-report.md` as evidence for must-fix findings; neither report can enable, re-enable, broaden, or extend Goal Mode by itself.
- If repair artifacts, review report, implementation report, spec, or amendment metadata disagree, honor the current spec or latest amendment authorization, record the mismatch in `repair-spec.md`, and pause unless the safe interpretation is clearly to disable Goal Mode.
- If a later amendment exists without a fresh user-confirmed Goal Mode decision for that amendment, do not auto-handoff. Pause and ask the user to choose Goal Mode for the amended spec.
- If `Authority: external-tracker-only` applies and the tracker does not expose a readable, current, user-confirmed Goal Mode authorization anchor for the current spec version, do not auto-handoff. Treat Goal Mode as disabled or paused until the user chooses again.
- Produce a repair spec and optional repair tickets only for must-fix findings that are within the current spec, current amendment, or explicitly in-scope repair target.
- Do not broaden the goal, add unrelated follow-up work, or change product expectations without pausing for user approval.
- Record the current repair cycle number, reserved next cycle when present, remaining repair cycle budget from `implementation-report.md`, source review report, authorization anchor, and next automatic stage in `repair-spec.md` and append-only repair pass specs.
- After writing the repair spec, automatically hand the current repair spec or blocker-free repair tickets back to `spec-do` when all repair-critical decisions are closed and the cycle budget remains.
- Pause instead of auto-handoff when a repair requires product/business clarification, scope expansion, unsafe git operation, destructive verification, failed validation risk acceptance, or exhausted repair cycle budget.

When Goal Mode is disabled or absent, finish by recommending `spec-do` as the next stage instead of entering it automatically.

If findings or review target are unclear, ask one focused clarification question before drafting.

## Finding Triage

First group findings by severity, impact, dependency, and parallelism:

- Must fix before ship.
- Recommended for this repair round.
- Can be handled later.
- Will not fix now, user accepts risk.

For each finding, include:

- Problem symptom.
- Reproduction steps or evidence.
- Root-cause judgment.
- Impact scope.
- Repair approach.
- Alternatives and tradeoffs.
- Affected files or modules.
- Verification method.
- Regression risk.
- Whether it affects Ship Decision.
- Whether it can be repaired in parallel.
- Dependencies or blockers.

Do not collapse distinct root causes into one generic fix. Do not split one root cause into multiple tickets unless the split helps sequencing, ownership, or verification.

## Built-In Grilling Loop

Use the grilling loop when any repair-critical item is unclear:

- Business expectation.
- Interaction rule.
- Data definitions, calculation/reporting rules, or data semantics.
- Permission boundary.
- Compatibility or migration strategy.
- Acceptance criterion.
- Delivery or Ship Decision.
- Whether a finding is must-fix or accepted risk.
- Whether the repair is allowed to change user-visible behavior.

When grilling:

1. Choose the highest-leverage unresolved decision.
2. Ask exactly one question.
3. Present 2-4 concrete options, with one marked as recommended when you have enough context.
4. Explain the impact of the recommended option and important tradeoffs in the alternatives.
5. Wait for the user's answer.
6. Re-check for new ambiguity, inconsistency, or dependency.

Do not proceed with repair planning for a branch whose critical decision remains open.

Before asking the user, investigate facts that are discoverable from the repo or environment, including existing code, tests, docs, logs, configs, APIs, issue files, and prior workflow artifacts. Ask the user only for product, business, delivery, risk-acceptance, or ship-decision choices.

## Repair Spec Requirements

Write a repair spec that can drive the next repair implementation pass. It must be concrete enough for `spec-do` to execute serially or with internal subagents using the package's built-in implementation behavior. Include:

- Problem statement from the review findings.
- Repair goal.
- Non-goals.
- Findings grouped by delivery impact.
- Root-cause analysis per must-fix finding.
- User-facing behavior after repair.
- Frontend changes.
- Backend changes.
- API contract changes.
- Data model or database changes.
- Permissions, security, and audit changes.
- Error handling changes.
- Boundary and regression scenarios.
- Acceptance criteria.
- Testing and verification plan.
- Testing decisions.
- Risks and rollback plan.
- Recommended repair order.
- Repair execution strategy for the next implementation pass.
- Further notes and explicitly deferred risks.

Be concrete about behavior and contracts. Include exact request/response shapes, state transitions, validation rules, permission checks, migration requirements, and error behavior when those are known and stable.

If a required section is not applicable, write `Not applicable` and briefly state the evidence or reason. Do not invent API, database, permission, backend, or frontend content only to fill a template section.

Avoid brittle implementation detail when it is likely to go stale. Include specific files or modules only when they are necessary to remove ambiguity for the repair.

## Repair Execution Strategy

In the repair spec, define a repair execution strategy that later `spec-do` can run locally or with internal subagents. Do not invoke a separate implementation skill; implementation behavior is internalized by `spec-do`.

- Which repairs must be serial.
- Which repairs can run in parallel.
- Suggested child-agent slices.
- Allowed modification scope.
- Forbidden modification scope.
- Handoff artifacts.
- Merge order.
- Integration checkpoints.
- Decision gates.

The strategy must remain executable even when no child agents are started: include a safe serial order as the fallback. When child-agent slices are suggested, define non-overlapping modification scopes, expected outputs, verification commands, and merge order clearly enough for the main agent to coordinate them without any external coordination runtime.

Only recommend parallel repair when all are true:

- Write scopes do not overlap.
- Dependencies are clear.
- Contracts are stable.
- Root cause is confirmed.
- Outputs are independently verifiable.
- Merge order is explicit.

Set serial execution or a decision gate when repairs may touch the same files/modules, depend on unstable contracts, have unconfirmed root cause, or require a business decision.

Typical repair slices include API contract, backend call sites, UI flow, test gaps, docs/update, and review verification. Do not assume fixed specialist child agents exist; later `spec-do` must define each child prompt, context, allowed scope, output, and acceptance criteria.

## Artifact Storage

Persist this stage's artifacts in the current project by default when using the full spec-driven delivery workflow, when `.spec-workflow/` workflow artifacts already exist, or when durable handoff is needed. If the user only asks for a conversational repair plan and no project artifact convention exists, output the repair spec in the final response without writing files.

```text
.spec-workflow/<feature-slug>/repair-spec.md
.spec-workflow/<feature-slug>/repair-specs/<NN>-<pass-slug>.md
.spec-workflow/<feature-slug>/repair-issues/<NN>-<ticket-slug>.md
.spec-workflow/<feature-slug>/verification/
.spec-workflow/<feature-slug>/debug/
```

Use these rules:

- Resolve the project root before writing: use the user-provided artifact path first; otherwise reuse an existing applicable `.spec-workflow/` directory; otherwise use the nearest git root; otherwise use the directory containing project guidance such as `AGENTS.md`; if the root cannot be determined uniquely, ask one focused question.
- Reuse the existing `.spec-workflow/<feature-slug>/` that contains the original `requirements.md`, `spec.md`, `issues/`, `review-report.md`, `review-reports/`, `implementation-report.md`, `implementation-reports/`, `repair-spec.md`, or `repair-issues/` whenever it can be identified.
- If no existing feature artifact directory can be identified, generate `<feature-slug>` from the original feature or review target using lowercase kebab-case.
- If the user provides an explicit non-production artifact directory, use that directory instead of `.spec-workflow/<feature-slug>/`.
- Do not write repair-planning artifacts into production code, committed test directories, migration directories, config directories, generated-build/generated-code directories, dependency directories, lockfile locations, snapshots, or formatting-only files.
- When artifact storage applies, always write an append-only repair pass spec under `repair-specs/` and update `repair-spec.md` as the latest canonical repair spec and pointer to the newest pass spec.
- Number repair pass specs from `01` in chronological order within `repair-specs/`.
- Generate `<pass-slug>` from the repair goal, review pass, or repair target using lowercase kebab-case.
- Create `repair-issues/` only when repair tickets are generated.
- Write one ticket per file under `repair-issues/`, numbered from `01` in dependency order with blockers first.
- When continuing an existing repair plan, preserve existing `repair-issues/` filenames where possible. Update still-valid tickets in place and record the current repair pass ID or repair-spec path in the ticket. Create new repair tickets with the next available number. When a repair ticket is no longer valid, keep the file but change its `Status` to `superseded`, `cancelled`, or `deferred`, and reference the repair pass or replacement ticket when one exists.
- Never write all tickets into one combined ticket file.
- If target artifacts already exist, read them first and update intentionally instead of blindly overwriting.
- The final response must list every artifact path written. If no files were written, state that the repair spec was provided only in the response.

Store repair-planning evidence, root-cause notes, reproduced command output, screenshots, traces, captured payloads, and other non-production repair support files under `verification/` or `debug/` in the same `.spec-workflow/<feature-slug>/` directory. Do not write repair-planning support files into production code, committed test directories, migration directories, config directories, generated-build/generated-code directories, dependency directories, lockfile locations, snapshots, or formatting-only files.

Use this repair spec and optional repair tickets as the authoritative input for the next repair implementation pass. If the user explicitly provides an issue tracker target, or the project has a documented issue tracker workflow in existing repo guidance, publish repair specs and repair tickets there as well and apply the local equivalent of `ready-for-agent` status when available. Do not depend on any external setup skill to discover or configure this; use only explicit user instructions or existing project documentation. Keep the local `.spec-workflow` repair artifact as the durable handoff unless the user explicitly says the external tracker is the only source of truth.

If the user designates an external tracker as the only source of truth for the repair pass, write `Authority: external-tracker-only`, the tracker reference, and `Local Goal Mode cache: non-authoritative` into `repair-spec.md`, the append-only `repair-specs/<NN>-<pass-slug>.md`, and every affected `repair-issues/` ticket. Otherwise write `Authority: local-spec-workflow` or `Authority: local-spec-workflow-plus-tracker` as appropriate. Later `spec-do` must respect this marker and verify Goal Mode authorization from the tracker before relying on local cached repair artifacts.

When publishing to a real issue tracker, create one issue per repair ticket in dependency order, blockers first. Use the tracker native blocking, sub-issue, or dependency relationship where available; otherwise include a `Blocked by` section that references the blocking issue identifiers. If the source was an existing parent issue, review report, or tracker item, reference it from the generated repair spec or ticket, but do not close, retitle, relabel, or otherwise modify the parent item unless the user explicitly asks.

## Built-In Ticket Splitting

Create repair tickets only when findings are numerous, cross-module, risky, need batch implementation, or benefit from tracked parallel work. Do not split small repair work just for process.

When ticket guidance is needed, produce tracer-bullet repair tickets:

- Each ticket should repair a narrow but complete behavior path.
- A completed ticket should be independently verifiable.
- Each ticket should fit in a fresh agent context window.
- Each ticket must declare blockers.
- A ticket with no blockers can start immediately.
- Prefactoring that makes the repair safer should come before dependent behavior repair.

For each repair ticket, include:

- Title.
- Problem source: review finding ID/title.
- Repair goal.
- What to fix, stated as end-to-end behavior.
- Modification scope.
- Forbidden scope.
- Acceptance criteria.
- Dependencies.
- Blocked by.
- Priority.
- Whether it blocks delivery.
- Whether it can run in parallel.
- Parallel execution boundary.
- Input context for `spec-do`: repair spec path, ticket path, blockers, relevant modules/docs, and verification seams or commands.
- Status: `ready-for-agent`.

Before persisting repair tickets, present the proposed ticket breakdown with `Title`, `Blocked by`, and `What it repairs`. Ask one decision question using the Decision Question Format with options such as: accept as proposed; adjust blocking edges; merge or split specific tickets; pause for manual rewrite. Iterate until approved unless the user explicitly says to skip approval.

## Final Output

End with:

- Findings grouped by delivery impact.
- Goal Mode status for this spec, current repair cycle, remaining cycle budget, and whether the repair plan auto-hands off to `spec-do` or pauses.
- Complete repair spec.
- Whether repair tickets were generated.
- Repair spec path written.
- Append-only repair pass spec path written, when artifact storage applies.
- Repair ticket paths written, if any.
- Recommended repair order.
- Parallel and serial execution recommendation.
- Suggested repair execution DAG for the next implementation pass, including serial fallback and safe child-agent slices when useful.
- Must-fix blockers.
- Follow-up or accepted-risk items.
- Still-open alignment questions.
- Whether the next stage should be `spec-do`.

## Relationship To Other Skills

This skill is stage 5 of the five-stage spec-driven delivery chain. The package also includes auxiliary skills for bug diagnosis and source research; use those only when their triggers match the task.

1. `to-grill`: clarify requirements and close product/technical uncertainty.
2. `to-spec`: turn closed requirements into an implementation-ready spec and optional tickets.
3. `spec-do`: coordinate and implement from the spec or ticket.
4. `do-review`: run final delivery review without expanding scope or fixing code.
5. `fix-review`: turn review findings into a repair spec.

After this stage, use `spec-do` to implement the repair spec or repair tickets.
