---
name: to-spec
description: >-
  Turn a closed requirement research conclusion, current conversation, issue,
  or feature brief into an implementation-ready spec without writing code. Use
  when the user invokes /to-spec or $to-spec, asks to create a formal spec, PRD, or
  implementation specification, wants requirements prepared for later
  coordinated implementation, or asks to amend, refine, re-scope, tweak,
  or update an existing spec/ticket plan. Built-in clarification,
  amendment-impact analysis, and ticket-splitting behavior: ask one decision
  question at a time when essential business rules, data semantics,
  permissions, interaction details, or acceptance criteria are missing; for
  large or cross-module work, include tracer-bullet ticket guidance instead of
  relying on a separate ticketing skill. Do not force simple, concrete low-risk
  edits into formal spec/ticket artifacts; route them to direct implementation.
---

# To Spec

Use this skill as stage 2 of the spec-driven delivery workflow. Convert clarified requirements into a precise, implementation-ready specification that a later implementation agent can execute directly.

Use the same skill to amend an existing spec when the user changes, narrows, expands, corrects, or fine-tunes an already persisted spec or ticket plan. In amendment mode, keep the canonical spec and ticket set current, and also preserve an amendment record explaining the change.

This skill internalizes the behavior that would otherwise be provided by separate clarification and ticket-splitting skills. Do not invoke another skill to clarify missing spec decisions or to decide whether the work should be split. Apply the rules below directly.

## Hard Gates

- Do not write code.
- Do not modify production files, migrations, configs, or tests as part of this stage.
- Write all user-facing questions, summaries, recommendations, specs, ticket guidance, and persisted artifact prose in the language of the latest substantive user request; keep code identifiers, paths, API names, and skill names unchanged.
- Base the spec on the prior `to-grill` requirement research conclusion when it exists, preferably from `.spec-workflow/<feature-slug>/requirements.md`.
- If no prior research conclusion exists, synthesize from the current conversation and available repo context, then check for unresolved blocking ambiguity.
- Do not invent business rules, data semantics, permission boundaries, interaction details, acceptance criteria, migration strategy, or rollback behavior.
- If an essential decision is missing, ask exactly one focused question using the Decision Question Format below and wait for the user.
- Do not proceed to implementation while essential spec decisions remain open.
- If the task is small, do not create ticket guidance just to satisfy process.
- Persist the completed spec, and any generated tickets, using the storage rules below unless the user explicitly provides another path.
- When amending an existing spec, do not silently expand implementation scope that is already in progress. Mark the change as a spec amendment and update the handoff artifacts before `spec-do` continues.
- For every new spec and every recorded amendment, ask the user to choose the Goal Mode setting for this current spec version only using the Decision Question Format below. Never infer Goal Mode from prior specs, prior amendments, prior conversations, project defaults, or user preference history.

## Decision Question Format

Use this format for every user-owned decision in this skill, including requirement clarification, git branch or dirty-worktree handling, Goal Mode, testing seams, ticket breakdown, tracker authority, and risk acceptance:

- Ask exactly one decision question at a time.
- Present 2-4 explicit options. Each option must have a short label and a one-line consequence or tradeoff.
- Mark one option as recommended when context supports a recommendation.
- Let the user answer by option label, short free text, or a custom alternative.
- Do not ask open-ended confirmation questions such as "Do you confirm?", "Is this OK?", or "Yes/no?" when more than one reasonable path exists.
- For dangerous or irreversible operations such as branch switching, committing, tracker writes, or external side effects, first present the options, then require exact confirmation of the chosen operation and file/scope list before executing it.

## Fast-Path Guard

Before drafting a formal spec, check whether the request should bypass the spec workflow.

Bypass `to-spec` when all are true:

- The change is concrete and low risk.
- Scope is narrow and does not require new product alignment.
- No new business rule, data semantics, permission boundary, API contract, migration, rollout, or architectural decision is needed.
- The implementation target is discoverable from the repo.
- A focused verification is enough.

Examples: make a font larger, change a label, adjust simple spacing, fix a typo, tweak a small already-defined UI state, or make a clear one-file behavior correction.

When this guard applies, do not write `.spec-workflow/<feature-slug>/spec.md`, do not create tickets, and do not produce the full spec template. Tell the user briefly that this does not need the formal spec-driven delivery workflow and recommend direct implementation. If the user explicitly insists on a spec anyway, continue with this skill.

If the user asks to amend an existing spec but the amendment is a concrete low-risk implementation tweak with no impact on acceptance criteria, API/data/permission behavior, ticket boundaries, or testing seams, recommend direct implementation instead of formal amendment. If the user wants the change recorded for traceability, use amendment mode.

## Workflow Git Entry Gate

Run this gate before writing a new spec, ticket set, or amendment when the full workflow is continuing and no current `to-grill` `requirements.md` already records a usable git entry decision for the same repo and feature directory.

Use the prior `to-grill` gate when it exists:

- Read the `Git entry` section in `.spec-workflow/<feature-slug>/requirements.md`.
- Carry the branch decision, starting branch, starting `HEAD`, dirty baseline, and pre-workflow commit hash into the spec or amendment metadata.
- If the current repo, branch, or dirty state has materially changed since that gate, report the mismatch and ask one focused question before writing canonical artifacts.

When no usable prior gate exists:

- If the project is not a git repo, state that no git baseline is available and continue. Record `Git entry: not a git repo` in `spec.md` or the amendment record.
- If the project is a git repo, record the current branch, `HEAD`, and `git status --porcelain=v1 -uall`.
- Ask the user whether this workflow should continue on the current branch, continue on a new branch, or pause for manual branch handling. Use the Decision Question Format and include your recommendation.
- Do not create, switch, checkout, stash, reset, or commit until the user explicitly confirms that operation.
- If the worktree is dirty before the branch decision, list the dirty files and explain that switching branches may carry or block those changes. Ask whether to commit an exact reviewed scope first, continue while recording the dirty baseline, or pause for manual cleanup using the Decision Question Format.
- If the user chooses to commit first, ask for confirmation of the exact files or scope before committing. Never include unrelated dirty files by default.
- For any pre-workflow commit, show the exact proposed file list first. Exclude unresolved conflicts, unrelated files, local secrets, generated build output, dependency cache files, temporary/debug artifacts, and files with unknown purpose. Run only the validation that is appropriate and available for those pre-existing changes; if validation is unavailable, unknown, or failing, report that status and commit only after the user explicitly accepts it.
- If the user chooses to continue with dirty files, preserve the dirty baseline exactly as pre-existing user work.
- If the user chooses a new branch, create or switch to it only after the dirty-worktree handling decision is closed.

Record the gate result in `spec.md`; in amendment mode, also record it in the amendment record:

- Git repository path.
- Branch decision: current branch or new branch name.
- Starting branch and `HEAD`.
- Dirty-worktree decision: committed first, continued with dirty baseline, paused, or not dirty.
- Dirty files present before spec or amendment work began.
- Any commit hash created by this gate, when the user explicitly approved a pre-workflow commit.

## Goal Mode Gate

Run this gate once for each new spec and once for every recorded amendment before writing the final canonical artifact. This includes minor textual amendments when they are persisted for traceability. A new amendment supersedes the previous Goal Mode authorization until the user explicitly chooses the mode again for the amended spec.

Goal Mode is a per-spec autopilot authorization. It allows later stages to continue from this specific spec into implementation, final review, repair planning, repair implementation, and repeated final review without asking for low-value step-by-step confirmation. It never applies to another spec, another feature directory, another issue, or a future amendment unless the user explicitly chooses it again for that current spec.

Ask the user to choose Goal Mode before writing the final canonical `spec.md`:

- Present at least these options: Goal Mode disabled; Goal Mode enabled for this spec only with no auto-commit; Goal Mode enabled for this spec only with auto-commit after successful validation; pause and decide later.
- If the user enables Goal Mode, ask follow-up decision questions one at a time using the Decision Question Format for the goal target, maximum automatic repair cycles, and auto-commit authorization. Default recommendation for the target: `Implement the current spec, pass agreed validation, complete final review with no must-fix findings, and reach Ship Decision: can ship`. Default recommendation for maximum automatic repair cycles: `2`.
- If the user disables Goal Mode, record `Goal mode: disabled` in `spec.md` and proceed with the normal staged workflow.
- If the user enables Goal Mode, record `Goal mode: enabled for this spec only` in `spec.md`.
- Record every answer in `spec.md`; in amendment mode, also record the refreshed Goal Mode decision in the amendment record.
- Record a stable authorization anchor: spec ID, amendment ID when applicable, artifact root, authority marker, decision source (`user-confirmed-in-current-conversation`), decision timestamp or current date, supersedes prior Goal Mode authorization, and superseded-by marker when a later amendment exists.
- Treat the Goal Mode section in the current canonical `spec.md` plus the latest applicable amendment record as the only authorization source. Later implementation, review, and repair reports may record runtime state, but they must not enable, re-enable, broaden, or extend Goal Mode.
- If an external tracker is the only authoritative source, mirror the Goal Mode authorization anchor and every Goal Mode answer into the tracker item. Mark the local `.spec-workflow` spec or amendment as `Authority: external-tracker-only` and `Local Goal Mode cache: non-authoritative`. Later stages may use the local cache only after verifying it matches the tracker. If the tracker has no readable, current, user-confirmed Goal Mode authorization for the current spec version, Goal Mode is disabled or paused until the user chooses again.

Do not enable Goal Mode when any essential product, business, data, permission, migration, rollout, or acceptance decision remains open. Close, defer, or explicitly accept those risks before offering Goal Mode.

Goal Mode must pause and ask the user when any of these occurs later:

- A required product, business, data, permission, migration, rollout, or acceptance decision is missing.
- The implementation would expand beyond the current spec, current amendment, or current repair spec.
- Git branch switching, stashing, resetting, cleaning, rebasing, pushing, or destructive history movement is needed.
- New dirty files appear that are not part of the recorded baseline and cannot be safely classified.
- Validation fails and continuing would require accepting risk or changing expectations.
- A review finding requires changed scope rather than an in-scope repair.
- A child agent is unrecoverable and the remaining work cannot be safely serialized or replaced.
- The environment is production or unknown and the needed verification would be destructive or externally visible.
- The maximum automatic repair cycle count is reached.

When Goal Mode is enabled and the final spec plus any ticket guidance are persisted with no pause condition active, continue directly into `spec-do` for this same spec version instead of ending with only a recommendation. When Goal Mode is disabled or absent, end normally and recommend `spec-do` as the next stage.

## Context Gathering

Before drafting the spec, gather only the context needed to make the spec executable:

- Read the prior requirement research conclusion from the conversation or referenced artifact.
- Read relevant project guidance such as `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/`, `.spec-workflow/`, ADRs, existing specs, or issue files when they exist.
- Explore the codebase enough to name affected modules, public interfaces, existing seams, data paths, and known project pitfalls.
- Use project domain vocabulary consistently.
- Respect existing architecture and ADRs in the affected area.
- Prefer existing testing seams over new seams. Choose the highest public seam that verifies behavior without coupling tests to internals.

If a fact is discoverable from the repo or environment, investigate it instead of asking the user. Ask the user only for product, business, or delivery decisions.

## Spec Amendment Mode

Use amendment mode when the user references an existing spec or ticket plan and asks to change, refine, re-scope, correct, remove, reorder, or add behavior.

Before drafting an amendment:

- Locate the existing feature directory, preferring the `.spec-workflow/<feature-slug>/` that contains the referenced `spec.md`, `issues/`, or prior `amendments/`.
- Read the current `spec.md`, relevant `issues/`, prior amendment records, and the original `requirements.md` when present.
- Determine whether implementation has already started by checking current conversation context, `spec-do` reports, branch changes, commits, or tracker status when available.
- Identify whether the requested change affects product behavior, acceptance criteria, testing seams, API/data contracts, permissions, rollout, ticket boundaries, dependencies, or only wording.

Classify the amendment:

- Minor textual clarification: improves wording without changing implementation scope.
- Scope refinement: narrows, expands, removes, or reprioritizes behavior.
- Contract change: changes API, data model, permissions, validation, state transitions, or compatibility.
- Ticket-plan change: adds, merges, splits, reorders, blocks, unblocks, or deprecates tickets.
- Post-implementation change: changes a spec whose implementation has already started or completed.

For each amendment, produce:

- Amendment summary.
- Reason for change.
- Source of change: user request, review finding, implementation discovery, tracker update, or product decision.
- Affected spec sections.
- Affected tickets and dependency edges.
- Behavior before and after the amendment.
- Acceptance criteria changes.
- Testing decision changes.
- Implementation impact and whether `spec-do` can continue from the current point.
- Migration or rollback impact when relevant.
- Open decisions, if any.

If the amendment changes behavior, contracts, acceptance criteria, permissions, or testing seams, ask one clarification question using the Decision Question Format when the decision is not already explicit. Do not update canonical artifacts for that branch until the critical decision is closed, deferred, or accepted as risk.

Before writing canonical artifacts for an amendment that changes behavior, contracts, ticket boundaries, dependencies, permissions, acceptance criteria, or testing seams, present the amendment summary and affected canonical paths, then ask one approval decision using the Decision Question Format. Include options such as: approve and write canonical artifacts; revise the amendment; record it as deferred/out of scope; pause. Minor textual clarifications that do not change implementation scope may be recorded without this approval gate.

## Amendment Storage

Store amended specs as "latest canonical artifact plus append-only amendment log":

```text
.spec-workflow/<feature-slug>/spec.md
.spec-workflow/<feature-slug>/issues/<NN>-<ticket-slug>.md
.spec-workflow/<feature-slug>/amendments/<NN>-<amendment-slug>.md
.spec-workflow/<feature-slug>/research/<topic-slug>.md
```

Use these rules:

- Keep `.spec-workflow/<feature-slug>/spec.md` as the latest canonical implementation-ready spec.
- Keep `.spec-workflow/<feature-slug>/issues/` as the latest canonical ticket set for `spec-do`.
- Store each amendment record under `.spec-workflow/<feature-slug>/amendments/`.
- Number amendment records from `01` in chronological order within the feature directory.
- Generate `<amendment-slug>` from the amendment goal using lowercase kebab-case.
- Do not create a separate full copy of the spec for every amendment unless the user explicitly asks for snapshots.
- When a ticket remains valid but needs changed scope, update the existing ticket file in place and mention the amendment ID in the ticket.
- When a new ticket is needed, create the next numbered file under `issues/`.
- When a ticket is no longer valid, keep the file but change its status to `superseded`, `cancelled`, or `deferred`, and reference the amendment ID and replacement ticket when one exists.
- When ticket order changes, preserve existing ticket file names when possible and update `Dependencies`, `Blocked by`, `Status`, and `Input context for spec-do` sections instead of renumbering every file.
- If renumbering is unavoidable, explain why in the amendment record and final response.
- If an external issue tracker is authoritative, mirror the same amendment summary, ticket status changes, and dependency changes there using explicit user instructions or documented project workflow.
- If the user designates an external tracker as the only source of truth, write `Authority: external-tracker-only` and the tracker reference into `spec.md`, affected tickets, and amendment records. Otherwise write `Authority: local-spec-workflow` or `Authority: local-spec-workflow-plus-tracker` as appropriate.

Each amendment record must include:

- Amendment ID and title.
- Date if available from the environment.
- Source request or tracker reference.
- Prior artifact paths read.
- Canonical artifact paths updated.
- Summary of spec changes.
- Ticket changes: created, modified, superseded, cancelled, deferred, or unchanged.
- Dependency changes.
- Testing decision changes.
- Implementation status impact: not started, can continue, must pause, must redo specific tickets, or requires new `spec-do` pass.
- Goal Mode impact: disabled for this amended spec, newly enabled for this amended spec, or paused because the required per-amendment user decision is still missing. Do not write `still enabled` based only on prior spec metadata.
- Open questions and accepted risks.

After amendment storage completes, the canonical `spec.md` and `issues/` are the authoritative input for `spec-do`; amendment records explain history and should be read by `spec-do` when they affect implementation scope.

## Built-In Clarification Loop

Ask one decision question at a time using the Decision Question Format when any of these are unclear:

- Business rules.
- Data source, data path, or data semantics.
- Permission, security, or audit boundary.
- Frontend interaction details.
- Backend behavior or API contract.
- Error handling behavior.
- Acceptance criteria.
- Compatibility with old data or old workflows.
- Rollback, retry, idempotency, or operational behavior.
- Delivery scope or ship decision.

For each question:

1. Identify the unresolved decision.
2. State your recommended answer.
3. Explain the tradeoff or risk.
4. Wait for the user's answer.
5. Re-check whether the spec can now be completed.

Continue until each essential decision is closed, deferred, out of scope, or accepted as a risk.

## Spec Requirements

Write the spec so a later `spec-do` stage can implement it without guessing. Include every section below, using the user's language for section titles and content:

- Goal Mode metadata: enabled or disabled for this spec version only; spec ID; amendment ID when applicable; artifact root; authority marker; decision source and date; supersedes or superseded-by markers; goal target when enabled; maximum automatic repair cycles; auto-commit authorization for this spec; required pause conditions; and a note that runtime cycle counts are maintained by `implementation-report.md`, not by the authorization metadata.
- Problem statement from the user's perspective.
- Solution from the user's perspective.
- Background and goal.
- Non-goals.
- User stories: an extensive numbered list in the form "As an <actor>, I want <feature>, so that <benefit>", covering the important actors, scenarios, permissions, edge cases, and operational paths.
- User flow.
- Frontend changes.
- Backend changes.
- API design.
- Data model and database changes.
- Permissions and security.
- Performance and scalability constraints.
- Error handling.
- Boundary conditions.
- Implementation decisions: modules or interfaces to build or change, architectural choices, schema changes, API contracts, interaction contracts, and technical clarifications already decided.
- Acceptance criteria.
- Testing plan.
- Testing decisions: what makes a good test for this feature, which public seams/modules will be tested, and prior-art tests or patterns in the codebase.
- Risks and rollback plan.
- Recommended implementation order.
- Further notes: relevant constraints, known project pitfalls, follow-up context, or intentionally accepted limitations that do not fit the sections above.

Be concrete about behavior and contracts. Include exact request/response shapes, state transitions, validation rules, permission checks, migration requirements, and error behavior when those are known and stable.

If a required section is not applicable, write `Not applicable` and briefly state the evidence or reason. Do not invent API, database, permission, backend, or frontend content only to fill a template section.

Avoid brittle implementation detail when it is likely to go stale, such as speculative file paths or line numbers. Include specific files or modules only when they are necessary to remove ambiguity for implementation.

If a prototype or existing code snippet encodes a decision more precisely than prose can, include only the decision-rich shape, not a working demo.

## Testing Decisions

Define testing at public seams:

- State which user-facing, API-facing, service-facing, or persistence-facing seams must be tested.
- Prefer high-level behavior tests over implementation-coupled tests.
- Identify relevant prior tests or patterns in the codebase.
- Cover success, validation failure, permission failure, empty state, partial state, retry/rollback, and error visibility when relevant.
- Include frontend real-interaction verification when the feature has UI behavior.
- Include backend API/service/repository/migration verification when backend behavior changes.

Before finalizing, present the proposed testing seams and ask the user to choose: accept the proposed seams, adjust one or more seams, defer the seam decision as accepted risk, or pause. If the testing seam itself is a product or architecture decision and is not obvious from repo patterns, ask one clarification question using the Decision Question Format before finalizing the spec.

## Artifact Storage

Persist this stage's artifacts in the current project by default:

```text
.spec-workflow/<feature-slug>/spec.md
.spec-workflow/<feature-slug>/issues/<NN>-<ticket-slug>.md
.spec-workflow/<feature-slug>/amendments/<NN>-<amendment-slug>.md
```

Use these rules:

- Resolve the project root before writing: use the user-provided artifact path first; otherwise reuse an existing applicable `.spec-workflow/` directory; otherwise use the nearest git root; otherwise use the directory containing project guidance such as `AGENTS.md`; if the root cannot be determined uniquely, ask one focused question.
- First reuse the existing `.spec-workflow/<feature-slug>/` that contains the prior `requirements.md` whenever the requirement research conclusion can be identified.
- Generate `<feature-slug>` from the requirement title or goal using lowercase kebab-case only when no existing requirement artifact directory applies.
- If the user provides an explicit non-production artifact directory, use that directory instead of `.spec-workflow/<feature-slug>/`.
- Do not write workflow artifacts into production code, committed test directories, migration directories, config directories, generated-build/generated-code directories, dependency directories, lockfile locations, snapshots, or formatting-only files. If the user requests such a target, ask for a non-production artifact location.
- Always write the final spec to `spec.md`.
- Create `issues/` only when ticket guidance is generated.
- Create `amendments/` only when updating an existing spec or ticket plan through amendment mode.
- Create `research/` only when this stage must preserve extra non-production research notes that are not already captured in `requirements.md`, `spec.md`, or an amendment record.
- Write one ticket per file under `issues/`, numbered from `01` in dependency order with blockers first.
- Never write all tickets into a single combined ticket file.
- Keep ticket file names stable and readable: `<NN>-<ticket-slug>.md`.
- If the target spec or ticket files already exist, read them first and update intentionally instead of blindly overwriting.
- The final response must list every artifact path written.

Keep every durable planning, research, ticketing, amendment, or handoff artifact for this requirement inside `.spec-workflow/<feature-slug>/` unless the user explicitly chooses another non-production artifact directory. Do not scatter related spec material under `docs/`, production folders, test folders, migration folders, generated folders, or dependency folders.

If the user explicitly provides an issue tracker target, or the project has a documented issue tracker workflow in existing repo guidance, publish specs and tickets there as well and apply the local equivalent of `ready-for-agent` status when available. Do not depend on any external setup skill to discover or configure this; use only explicit user instructions or existing project documentation. Keep the local `.spec-workflow` artifact as the durable handoff unless the user explicitly says the external tracker is the only source of truth.

When publishing to a real issue tracker, create one issue per approved ticket in dependency order, blockers first. Use the tracker native blocking, sub-issue, or dependency relationship where available; otherwise include a `Blocked by` section that references the blocking issue identifiers. If the source was an existing parent issue, reference it from the generated spec or ticket, but do not close, retitle, relabel, or otherwise modify the parent issue unless the user explicitly asks.

Use this spec file and the optional `issues/` directory as the authoritative input for `spec-do`, unless the user explicitly designates an external tracker artifact as the only authoritative source. When external tracker is the only source, local `.spec-workflow` files are a cache and must carry `Authority: external-tracker-only`; Goal Mode authorization must be verified from the tracker and the local Goal Mode section must be treated as non-authoritative cache only. When `amendments/` exists, it is the history and rationale for the current canonical spec/tickets; `spec-do` should read amendment records that affect the ticket or spec being implemented.

## Built-In Ticket-Splitting Decision

After drafting the spec, decide whether ticket guidance is needed.

Create ticket guidance only when the work is large, cross-module, risky, or must be delivered in batches. Do not split small work.

When ticket guidance is needed, produce tracer-bullet tickets:

- Each ticket should deliver a narrow but complete vertical slice through the required layers.
- A completed ticket should be demoable or independently verifiable.
- Each ticket should fit in a fresh agent context window.
- Each ticket must declare blockers.
- A ticket with no blockers can start immediately.
- Prefactoring that makes the change easier should come before dependent behavior tickets.
- Present the proposed ticket breakdown before persisting tickets.

Wide mechanical refactors are the exception to vertical slicing. For wide refactors, describe an expand-contract sequence:

- Expand: add the new form beside the old form without breaking existing behavior.
- Migrate: move call sites in batches sized by blast radius.
- Contract: remove the old form after all callers have migrated.
- Integrate and verify when batches cannot stay green independently.

For each ticket, include:

- Title.
- Parent or source issue reference, when the source was an existing issue or tracker item.
- Problem source.
- What to build, stated as end-to-end behavior from the user's perspective and not as a layer-by-layer implementation list.
- Delivery goal.
- Modification scope.
- Acceptance criteria.
- Dependencies.
- Blocked by.
- Status: `ready-for-agent`.
- Priority.
- Whether it blocks delivery.
- Whether it can run in parallel.
- Parallel execution boundary.
- Input context for `spec-do`: spec path, this ticket path, blockers, relevant modules or docs, and verification seams or commands.

Before persisting tickets, present a numbered ticket breakdown with `Title`, `Blocked by`, and `What it delivers`. Ask one decision question using the Decision Question Format with options such as: accept as proposed; adjust blocking edges; merge or split specific tickets; pause for manual rewrite. Iterate until the user approves the breakdown, unless the user explicitly instructs you to skip approval. Then persist each ticket using the artifact storage rules above. The goal is to produce executable, durable guidance for the next stage.

## Final Output

End with:

- The complete implementation-ready spec.
- Goal Mode decision for this spec only, including goal target, maximum repair cycles, auto-commit authorization, and pause conditions when enabled.
- Whether ticket guidance was generated.
- The spec path written.
- The ticket paths written, if any.
- The amendment paths written, if any.
- For amendment mode, a concise change log of canonical spec/ticket updates.
- Recommended implementation order.
- The current frontier: tickets with no blockers that can start immediately; later work should proceed from the blocker-free frontier.
- Open questions, only if they are explicitly deferred, out of scope, or accepted as risk.
- A clear recommendation on whether the next stage should be `spec-do`; when Goal Mode is enabled for this spec and no pause condition is active, state that the agent is entering `spec-do` automatically for this spec.

When the full spec-driven delivery workflow is in use, the next stage must read the persisted spec, any ticket files, and any amendment records that affect the chosen spec or ticket as its authoritative input.
