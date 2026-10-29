# Goal Mode Execution Contract

Read the local `bilingual-output.md` alongside this contract. Render questions,
progress and human artifact labels in the selected language. The English field
labels and codes below are canonical semantic examples; recognize their
Chinese aliases before authorization, cycle or completion logic. Preserve real
host API arguments/status values and stable IDs. Localization is neither
Goal authorization nor evidence of actual activation or native completion.

Read this for the final execution-mode choice in `to-spec`, and before starting,
resuming, or automatically handing off an authorized run in `spec-do`,
`do-review`, or `fix-review`. Each skill carries its own copy so installation of
a single skill does not depend on another skill's resources.

## Authorization And Activation

Two different facts must be established:

- **Authorization:** the user chose continuous execution for the exact finished
  spec/version after execution readiness. The authoritative spec and applicable
  amendment (or tracker-only source) record that decision.
- **Activation:** the selected host goal/loop actually started and its identity
  matches that authorization. Tool results or readable host state prove this;
  a sentence, checklist, spec flag, or implementation report cannot start it.

Host permission settings, plan mode, a task list, a subagent, and a non-interactive
CLI invocation do not by themselves provide a persistent completion loop.
Never change permission policies or install a loop plugin just because the user
selected Goal Mode. Discover capabilities before offering the final choice.

Use these backend labels:

- `native-goal`: a host-owned persistent goal with verified lifecycle state
  and automatic continuation toward the target in the current execution surface.
- `host-loop`: an already available, explicitly selected loop/runner with a
  verified run identity and stop limits. It is not a native goal.
- `session-only`: explicitly selected continuous work within the current
  invocation. It has no guarantee of continuation after the host ends the turn.

Do not silently substitute one backend for another. If an installed host has
no verified persistent mechanism, say so before the choice. Read only the
relevant host section in `agent-runtime-adapters.md`; check live tool schemas
and installed-version documentation before using an API or command. If the
host or current capability is unverified, missing, changed, or contradictory,
perform the internal research procedure in `runtime-discovery.md` before
offering a fallback. An old catalog row is not proof of current support or
non-support.
A durable objective or a successful start response alone does not establish
automatic continuation. Verify the continuation mechanism before offering a
persistent run; if only goal state is supported, report that distinction and
research the current runtime before selecting a different execution backend.

## Required Authorization Record

Persist in the current authoritative spec and applicable amendment:

```text
Goal mode: pending selection | disabled | enabled for this spec only
Spec ID / version: <exact current version>
Amendment ID: <current amendment or none>
Artifact root: <absolute requirement directory>
Authority: <local-spec-workflow | local-spec-workflow-plus-tracker | external-tracker-only>
Decision source: user-confirmed-in-current-conversation
Decision date / message reference: <available evidence>
Authorization anchor: <spec ID + version + amendment + decision reference>
Supersedes / superseded by: <prior or later authorization, when applicable>
Execution backend: native-goal | host-loop | session-only
Goal target: implement this version, pass agreed validation, complete final
  review with no must-fix findings, and reach Ship Decision: can ship
Maximum automatic repair cycles: <user-selected Goal round limit; default recommendation 3>
Auto-commit: no | yes, scoped changes after successful agreed validation
Implementation subagents: local | auto | prefer
Review subagents: local | auto | prefer
Required validation / environment: <approved checks and safe environment>
Pause conditions: <new decision, changed scope, permission/ownership blocker,
  unavailable required verification, or exhausted authorized limits>
```

The final menu must display the actual target, limit, backend, commit policy,
and the separately selected implementation/review subagent policies. A
recommendation becomes an agreed parameter only when the user selects an option
containing it; do not invent budgets or subagent defaults. No-commit and
`local` subagent policies are as settled as auto-commit or `auto`. Every new
spec/version needs fresh choices.
The anchor must distinguish renewed decisions for the same version; use an
available user-message reference or a recorded authorization generation rather
than relying on the calendar date alone.

Tracker-only authority requires readable current authorization from that
tracker before activation. Local metadata is a cache. Runtime records and
review/repair artifacts cannot authorize, extend, or re-enable a run.

## Goal Round Limit Choice

During execution readiness, before the final Goal Mode choice, offer one
round-limit decision with these four options in the user's language:

- **3 rounds (Default, Recommended):** a bounded repair run that returns
  control promptly if the current spec still cannot pass final review.
- **5 rounds:** a moderate repair budget before returning control to the user.
- **10 rounds:** leaves room for more automatic review/fix iterations.
- **Custom:** use an explicitly supplied positive safe integer.

If the user already specified a valid limit for this spec version, reuse it
without re-confirmation. Selecting Custom with no value requires a numeric
answer before the final execution choice. Reject zero, negative, fractional,
non-numeric, unsafe-integer, or unlimited values; explain the issue and obtain
a valid choice without silently rounding, clamping, or reverting to 3.

Three is the default proposal, not automatic permission to start or to change
an existing run's limit. A missing answer is not approval. Persist the actual
selection in the authoritative spec/amendment, display it in the final Goal
Mode choice, and initialize the runtime repair ledger from that value. Existing
authorized limits remain unchanged unless explicitly revised.

One workflow round is `fix-review -> spec-do repair -> do-review`, reserved and
settled by `do-review`. The initial implementation/review, individual tickets,
test reruns, and host continuation turns do not each consume a repair round.
Finish early when the goal is evidenced; the selected number is a maximum,
not a requirement to perform all rounds. Host continuation/turn caps and token
budgets are separate settings; never map this number to them automatically.

## Activation Procedure

1. Finish requirement, spec, testing, amendment, optional ticket, branch, dirty
   baseline, environment, and backend decisions. Persist the ready inputs.
2. Obtain the final per-version choice and save its authorization anchor.
3. Re-read the exact executable inputs. If the choice changed scope or a new
   essential decision appeared, return to planning; do not activate.
4. Inspect current host goal/runner state when supported. If a matching active
   run already exists, reuse it after verifying its anchor, limits, and ledger.
   Do not create a second run. Do not overwrite, complete, pause, or clear an
   unrelated goal to make room; report that conflict and ask for host handling.
   The main coordinator owns goal activation and lifecycle. Child agents may
   perform scoped work but must not create separate goals or mutate the parent
   goal as an implementation shortcut.
5. For `native-goal` or `host-loop`, use the exposed supported API/entry point
   with the approved objective and limits, then read back state. The objective
   must identify the absolute spec path or authoritative tracker, spec version,
   authorization anchor, artifact root, target, repair limit, commit policy,
   and subagent policies.
   Store the anchor in host metadata when supported; otherwise include it in
   the objective text so read-back/resume can bind the run unambiguously. Keep
   longer detail in the spec rather than exceeding the host's objective limit.
6. If activation needs a user composer command/UI action, record
   `awaiting-host-activation`, provide the precise action once, and wait for
   observable confirmation. Writing `/goal ...` in prose or running it in a
   shell is not submitting it to the host composer. Do not launch another CLI
   or task behind the user's back to imitate current-session activation.
7. Record API response/run ID and read-back evidence in the runtime ledger.
   With explicit `session-only` selection, record that limit instead of a fake
   host goal ID. Then actually start the first executable `spec-do` action.
   Do not end the turn with only "I am entering Goal Mode".

On an activation error, inspect host state before retrying: the create request
may have succeeded despite a lost response. Reuse a matching run and avoid
duplicate creates. If no run can be verified, record `activation-failed` and
explain the failure. If the entry/schema/current surface appears wrong, run
`runtime-discovery.md` to identify the actual supported mechanism before
proposing a fallback. Permission, quota, and transient errors remain runtime
blockers, not permission to switch mechanisms or research ways around controls.
A different backend needs a new explicit choice.

## Runtime Ledger And Resume

Use `.spec-workflow/<feature-slug>/implementation-report.md` for latest runtime
state and `implementation-reports/` for pass history. Include:

- Authorization anchor, authoritative input paths/version, backend, host
  session/run identity, activation evidence, subagent policies, and last state
  verification.
- Executable-input fingerprint: file hashes or authoritative tracker revision
  for the spec, relevant amendments, and ticket contracts at activation.
  Exclude runtime status/report updates from this comparison; a changed
  executable contract requires rechecking readiness and version authorization.
- Execution state: `awaiting-host-activation`, `active`, `session-only`,
  `blocked`, `user-paused`, `activation-failed`, `completion-pending-host`,
  `completed`, or `stopped`.
- Current stage, changed-file ownership, child-agent status, agreed validation
  results, reserved repair cycle ID, completed cycles, remaining repair budget,
  next automatic action, and concrete blocker or completion evidence.

These are workflow states, not assumed host enum names. Use only statuses and
operations supported by the host's actual tool contract. A ledger entry cannot
resume an explicitly paused goal or override a host budget/rate/usage limit.

After compaction, interruption, or a fresh invocation, read authoritative
inputs, the latest ledger, current host state, and outstanding child ownership.
Continue the matching unfinished run only if the user has not stopped/paused
it, the version/authorization still match, and no blocker or limit is active.
Otherwise report the actual state and wait for the necessary user action.
Do not reset cycles, replay completed tickets, or renew authorization silently.

## Question And Blocker Rules

After verified activation, these rules take precedence over ordinary
step-by-step confirmation gates in the executing/review/repair skills:

- Reuse settled business rules, acceptance criteria, testing seams, ticket
  boundaries, branch decision, dirty baseline, and both commit choices. Do not
  ask the same question again merely because the stage changed.
- Choose in-scope technical details, repair ticket granularity, and ordering
  using the approved contracts and repo conventions. Apply the user's selected
  implementation/review subagent policy; do not replace `local` with automatic
  delegation or re-ask a settled policy. Present in-policy decisions as
  progress.
- Classify new dirty files against the ledger and actual diffs. Owned planning,
  implementation, child, and repair changes are expected. Preserve unrelated
  files. Only unresolved overlap/ownership requires a decision.
- Inspect code, docs, configuration, logs, and prior artifacts to answer facts.
  Repair failing validation when it has a safe in-scope fix. Do not ask the user
  to choose whether to fix an implementation defect already covered by scope.
- Show the exact scoped commit files and validation evidence when auto-commit
  is authorized, then commit without another generic confirmation. New scope,
  unrelated files, changed branches, failed-state commits, push, and destructive
  Git operations remain outside that authorization.
- Never collect ordinary requirements inside an active run. If new evidence
  exposes a required product/data/permission/acceptance decision absent from
  the approved inputs, record a `blocked` workflow state **before** asking one
  focused question. Explain the new evidence, what prior readiness missed, and
  the exact decision needed. A non-blocking discovery stays a follow-up.
- Also block for scope/version changes, unresolvable ownership, permission
  denial, unavailable acceptance-critical verification, risk acceptance that
  changes expectations, destructive/production actions, unrecoverable child
  work that cannot be serialized, or exhausted approved limits.

At a blocker, stop affected automatic work and use the host's allowed waiting,
pause, or blocked behavior. Never bypass a host restriction: if its pause tool
requires an explicit user request, or its blocked status has a recurrence rule,
honor that contract and record the workflow blocker without inventing a host
transition. Report the required host action if the host cannot be suspended
programmatically. Do not send repeated clarification messages on auto-resumes.

A user answer can resolve the specific blocker; it is not permission to change
scope or start another spec. Changed executable requirements need `to-spec`,
amendment/readiness processing, and a fresh final per-version choice. If the
version is unchanged and the host is explicitly user-paused, wait for user
resume. Increasing a repair budget must be recorded in the authoritative
authorization before work resumes; a review/implementation ledger alone is
insufficient. If this changes the anchor or limits bound to a host goal, use
the host's supported edit/rebind operation and verify the same goal before
resuming. If only a user can edit it, record `awaiting-host-activation` and
provide that action. Never create a second run around an unfinished old goal,
or treat a budget change in Markdown as a successful host update.

## Stage Continuation And Completion

Run `spec-do -> do-review -> fix-review -> spec-do -> do-review` without
routine user approvals. Read the next stage's actual packaged instructions and
perform its first action in the same execution stream; prose naming the next
stage is not a handoff. Do not require a magic user slash command for an
otherwise available packaged stage.

`do-review` owns repair-cycle reservation and completion. Reserve before repair
planning, complete and decrement exactly once after its follow-up review is
persisted, and never reset the ledger on re-entry. The default proposal of three
permits up to three repair passes; it does not mean three tickets or test reruns. Unfinished
implementation returns to `spec-do` without consuming a review-repair cycle.

Only final review evidence satisfying the target can finish workflow execution.
Persist reports and child results first, then use the host's actual completion
mechanism for the **matching** run:

- Inspect the completion/report tool's turn-termination contract before calling
  it. If it may end the turn or forbid further user-facing output (for example
  Qwen's completion proposal), surface the actual required checks, acceptance
  evidence and review conclusion through an allowed visible message/tool result,
   and prepare the ledger's canonical `completion-pending-host` state **before** that call. A file
  path alone is not transcript evidence. Make the terminating call last; honor
  its actual termination instructions without a later read, write, poll, or
  final message. Reconcile the native outcome only on a later permitted turn.
- If a completion API/tool exists, call it after checking identity and read
  back state only when the host permits further actions. An accepted proposal/report is not necessarily
  a terminal transition: when the contract defers verification or persistence
  until the turn ends, record `completion-pending-host` and follow the post-turn
  path below without polling inside that turn. A failed call also leaves that state;
  do not claim the native goal completed or restart implementation just to get
  around the failed transition.
- If the host evaluates completion after the turn (for example Claude Code),
  record `completion-pending-host`, present the actual acceptance/test/review
  evidence before any terminating tool, or in the final response when the host
  allows one, and end the turn so that evaluation can run.
  Do not wait inside the turn for an evaluator that runs only after it ends,
  invent a completion API, or clear the goal as a success shortcut. Record
  `completed` only after host completion becomes observable. If a new host turn
  requests more evidence, inspect its verdict, supply the missing approved
  check/evidence, and do not repeat a full repair cycle just for acknowledgement.
- For explicit `session-only` execution, record the evidenced workflow target
  as completed without inventing host goal state.

Stop on user cancellation or host limits without marking unfinished work
complete. `can ship` is a delivery judgment, not permission to push, merge,
deploy, publish, or notify others.
