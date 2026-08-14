---
name: bugs-fix
description: Diagnosis loop for hard bugs and performance regressions. Use when the user says "diagnose"/"debug this", invokes /bugs-fix or $bugs-fix, or reports something broken/throwing/failing/slow.
---

# Bugs Fix

A discipline for hard bugs. Skip phases only when explicitly justified.

When exploring the codebase, read `CONTEXT.md` (if it exists) to get a clear mental model of the relevant modules, and check ADRs in the area you're touching.

## Git And Commit Gates

Run these gates before fixing code. Diagnosis may read files, run existing tests, inspect logs, and build disposable repro harnesses outside the repo or in the system temp directory before the entry gate is closed. Do not write any repo file, including `.spec-workflow` workflow artifacts, production code, committed test directories, migration directories, config directories, generated-build/generated-code directories, dependency directories, lockfile locations, snapshots, formatting-only files, debug scripts, fixtures, or harnesses, until the relevant gate is closed.

### Entry Gate

- If the project is not a git repo, state that no git baseline is available and continue.
- If the project is a git repo, record the current branch, `HEAD`, and `git status --porcelain=v1 -uall`.
- Ask the user whether bug-fix work should continue on the current branch or on a new branch. Include your recommendation and wait for the user's explicit choice.
- Do not create, switch, checkout, stash, reset, or commit until the user explicitly confirms that operation.
- If the worktree is dirty before the branch decision, list the dirty files and explain that switching branches may carry or block those changes. Ask whether to commit first, continue while recording the dirty baseline, or pause for manual cleanup.
- If the user chooses to commit first, ask for confirmation of the exact files or scope before committing. Never include unrelated dirty files by default.
- For any pre-fix commit, show the exact proposed file list first. Exclude unresolved conflicts, unrelated files, local secrets, generated build output, dependency cache files, temporary/debug artifacts, and files with unknown purpose. Run only the validation that is appropriate and available for those pre-existing changes; if validation is unavailable, unknown, or failing, report that status and commit only after the user explicitly accepts it.
- If the user chooses to continue with dirty files, preserve the dirty baseline exactly as pre-existing user work and exclude it from later fix review and commit scope.
- If the user chooses a new branch, create or switch to it only after the dirty-worktree handling decision is closed.

## Artifact Storage

Store bug-fix artifacts under `.spec-workflow` in the current project:

```text
.spec-workflow/<feature-slug>/bugs/<bug-slug>/diagnosis-report.md
.spec-workflow/<feature-slug>/bugs/<bug-slug>/verification/
.spec-workflow/<feature-slug>/bugs/<bug-slug>/debug/
```

Use `.spec-workflow/<feature-slug>/bugs/<bug-slug>/` when the bug belongs to an existing requirement directory. If no related requirement directory exists, use `.spec-workflow/<bug-slug>/` with the same `diagnosis-report.md`, `verification/`, and `debug/` children. Create or update these `.spec-workflow` files only after the entry gate allows repo artifact writes.

Use these rules:

- Resolve the project root before writing: use the user-provided artifact path first; otherwise reuse an existing applicable `.spec-workflow/<feature-slug>/`; otherwise use the nearest git root; otherwise use the directory containing project guidance such as `AGENTS.md`; if the root cannot be determined uniquely, ask one focused question.
- Generate `<bug-slug>` from the bug symptom or failing scenario using lowercase kebab-case.
- Store the durable diagnosis summary, confirmed root cause, fix summary, repro command, validation command, and cleanup notes in `diagnosis-report.md`.
- Store temporary verification outputs, traces, screenshots, test-results, command logs, captured payloads, and smoke-test evidence under `verification/`.
- Store disposable repro harnesses, debug scripts, temporary fixtures, and instrumentation notes under `debug/`.
- Real regression tests that should remain part of the project belong in the repo's existing test locations and naming conventions, not under `.spec-workflow`.
- Do not write bug-fix support artifacts into production code, committed test directories, migration directories, config directories, generated-build/generated-code directories, dependency directories, lockfile locations, snapshots, or formatting-only files.
- If temporary artifacts remain after cleanup, record their paths, reason, and cleanup expectation in `diagnosis-report.md`.

If the bug belongs to a feature directory whose local artifacts carry `Authority: external-tracker-only`, read the named tracker item before fixing or committing. Treat local `.spec-workflow` spec, ticket, bug, and Goal Mode metadata as non-authoritative cache. Do not let stale local acceptance criteria, status, priority, blocker, or authorization data override the tracker. If the tracker cannot be read or does not identify the current expected behavior, pause and ask the user for the authoritative source before changing code.

### Implementation Commit Gate

Before changing files, ask whether this bug-fix pass may automatically create a git commit after the fix and validation are complete.

- If the project is not a git repo, state that automatic commit is unavailable and continue without commit behavior.
- If the user says no, do not commit in this pass.
- If the user says yes, commit only after the original repro loop is green, the regression test passes or the missing seam is documented, and cleanup is complete.
- Do not auto-push.
- Do not commit when validation failed unless the user explicitly approves a failed-state commit after seeing the failed validation summary.
- Do not commit unresolved conflicts, unrelated pre-existing dirty files, local secrets, generated build output, dependency cache files, or temporary debug artifacts.
- Before committing, show the exact files proposed for the commit and compare them against the entry-gate dirty baseline.
- Use a commit message that states the confirmed root cause, the fix, and the validation loop that now passes.

### Bisection Safety Gate

Run this gate before any operation that moves git history or the checked-out worktree, including `git bisect`, checkout-based differential testing, reset-like commands, or scripts that boot multiple commits.

- Prefer an isolated temporary worktree, clone, or disposable copy for bisection so the user's active worktree and dirty baseline are not disturbed.
- If an isolated workspace is unavailable or impractical, ask for explicit permission before running bisection in the current worktree. Explain that bisection checks out different commits and can conflict with uncommitted files.
- Do not run bisection in the current worktree when unresolved conflicts, unrelated dirty files, or uncommitted user work would be at risk, unless the user explicitly accepts that risk after seeing the file list.
- Record the bisection workspace path, starting commit range, command used, cleanup status, and final identified commit or inconclusive result.
- After bisection, return the current worktree or isolated workspace to a known state. If cleanup cannot be completed, stop and report the exact state instead of continuing as though the repo is clean.

## Phase 1 - Build a feedback loop

**This is the skill.** Everything else is mechanical. If you have a **tight** pass/fail signal for the bug - one that goes red on _this_ bug - you will find the cause; bisection, hypothesis-testing, and instrumentation all just consume it. If you don't have one, no amount of staring at code will save you.

Spend disproportionate effort here. **Be aggressive. Be creative. Refuse to give up.**

### Ways to construct one - try them in roughly this order

1. **Failing test** at whatever seam reaches the bug - unit, integration, e2e.
2. **Curl / HTTP script** against a running dev server.
3. **CLI invocation** with a fixture input, diffing stdout against a known-good snapshot.
4. **Headless browser script** (Playwright / Puppeteer) - drives the UI, asserts on DOM/console/network.
5. **Replay a captured trace.** Save a real network request / payload / event log to disk; replay it through the code path in isolation.
6. **Throwaway harness.** Spin up a minimal subset of the system (one service, mocked deps) that exercises the bug code path with a single function call.
7. **Property / fuzz loop.** If the bug is "sometimes wrong output", run 1000 random inputs and look for the failure mode.
8. **Bisection harness.** If the bug appeared between two known states (commit, dataset, version), automate "boot at state X, check, repeat" so you can `git bisect run` it.
9. **Differential loop.** Run the same input through old-version vs new-version (or two configs) and diff outputs.
10. **HITL bash script.** Last resort. If a human must click, drive _them_ with `scripts/hitl-loop.template.sh` so the loop is still structured. Captured output feeds back to you.

Build the right feedback loop, and the bug is 90% fixed.

### Tighten the loop

Treat the loop as a product. Once you have _a_ loop, **tighten** it:

- Can I make it faster? (Cache setup, skip unrelated init, narrow the test scope.)
- Can I make the signal sharper? (Assert on the specific symptom, not "didn't crash".)
- Can I make it more deterministic? (Pin time, seed RNG, isolate filesystem, freeze network.)

A 30-second flaky loop is barely better than no loop; a 2-second deterministic one is tight - a debugging superpower.

### Non-deterministic bugs

The goal is not a clean repro but a **higher reproduction rate**. Loop the trigger 100x, parallelise, add stress, narrow timing windows, inject sleeps. A 50%-flake bug is debuggable; 1% is not - keep raising the rate until it's debuggable.

### When you genuinely cannot build a loop

Stop and say so explicitly. List what you tried. Ask the user for: (a) access to whatever environment reproduces it, (b) a captured artifact (HAR file, log dump, core dump, screen recording with timestamps), or (c) permission to add temporary production instrumentation. Do **not** proceed to hypothesise without a loop.

Production and unknown-environment safety:

- In production or unknown environments, perform only read-only diagnosis unless the user explicitly confirms the environment, blast radius, rollback path, and safety of the action.
- Do not add temporary production instrumentation unless it is explicitly approved for this incident, scoped to the minimum surface, reversible, observable, and has a cleanup plan recorded in `diagnosis-report.md`.
- Do not run destructive, externally visible, data-mutating, payment, notification, permission, migration, or irreversible actions while trying to reproduce a bug unless the environment is isolated or the action is proven rollback-safe and explicitly approved.
- If safe verification cannot be performed, report the exact blocked verification and residual risk instead of claiming the bug is fixed.

### Completion criterion - a tight loop that goes red

Phase 1 is done when the loop is **tight** and **red-capable**: you can name **one command** - a script path, a test invocation, a curl - that you have **already run at least once** (paste the invocation and its output), and that is:

- [ ] **Red-capable** - it drives the actual bug code path and asserts the **user's exact symptom**, so it can go red on this bug and green once fixed. Not "runs without erroring" - it must be able to _catch this specific bug_.
- [ ] **Deterministic** - same verdict every run (flaky bugs: a pinned, high reproduction rate, per above).
- [ ] **Fast** - seconds, not minutes.
- [ ] **Agent-runnable** - you can run it unattended; a human in the loop only via `scripts/hitl-loop.template.sh`.

If you catch yourself reading code to build a theory before this command exists, **stop - jumping straight to a hypothesis is the exact failure this skill prevents.** No red-capable command, no Phase 2.

## Phase 2 - Reproduce + minimise

Run the loop. Watch it go red - the bug appears.

Confirm:

- [ ] The loop produces the failure mode the **user** described - not a different failure that happens to be nearby. Wrong bug = wrong fix.
- [ ] The failure is reproducible across multiple runs (or, for non-deterministic bugs, reproducible at a high enough rate to debug against).
- [ ] You have captured the exact symptom (error message, wrong output, slow timing) so later phases can verify the fix actually addresses it.

### Minimise

Once it's red, shrink the repro to the **smallest scenario that still goes red**. Cut inputs, callers, config, data, and steps **one at a time**, re-running the loop after each cut - keep only what's load-bearing for the failure.

Why bother: a minimal repro shrinks the hypothesis space in Phase 3 (fewer moving parts left to suspect) and becomes the clean regression test in Phase 5.

Done when **every remaining element is load-bearing** - removing any one of them makes the loop go green.

Do not proceed until you have reproduced **and** minimised.

## Phase 3 - Hypothesise

Generate **3-5 ranked hypotheses** before testing any of them. Single-hypothesis generation anchors on the first plausible idea.

Each hypothesis must be **falsifiable**: state the prediction it makes.

> Format: "If <X> is the cause, then <changing Y> will make the bug disappear / <changing Z> will make it worse."

If you cannot state the prediction, the hypothesis is a vibe - discard or sharpen it.

**Show the ranked list to the user before testing.** They often have domain knowledge that re-ranks instantly ("we just deployed a change to #3"), or know hypotheses they've already ruled out. Cheap checkpoint, big time saver. Don't block on it - proceed with your ranking if the user is AFK.

## Phase 4 - Instrument

Each probe must map to a specific prediction from Phase 3. **Change one variable at a time.**

Tool preference:

1. **Debugger / REPL inspection** if the env supports it. One breakpoint beats ten logs.
2. **Targeted logs** at the boundaries that distinguish hypotheses.
3. Never "log everything and grep".

**Tag every debug log** with a unique prefix, e.g. `[DEBUG-a4f2]`. Cleanup at the end becomes a single grep. Untagged logs survive; tagged logs die.

**Perf branch.** For performance regressions, logs are usually wrong. Instead: establish a baseline measurement (timing harness, `performance.now()`, profiler, query plan), then bisect. Measure first, fix second.

## Phase 5 - Fix + regression test

Write the regression test **before the fix** - but only if there is a **correct seam** for it.

A correct seam is one where the test exercises the **real bug pattern** as it occurs at the call site. If the only available seam is too shallow (single-caller test when the bug needs multiple callers, unit test that can't replicate the chain that triggered the bug), a regression test there gives false confidence.

**If no correct seam exists, that itself is the finding.** Note it. The codebase architecture is preventing the bug from being locked down. Flag this for the next phase.

If a correct seam exists:

1. Turn the minimised repro into a failing test at that seam.
2. Watch it fail.
3. Apply the fix.
4. Watch it pass.
5. Re-run the Phase 1 feedback loop against the original (un-minimised) scenario.

## Phase 6 - Cleanup + post-mortem

Required before declaring done:

- [ ] Original repro no longer reproduces (re-run the Phase 1 loop)
- [ ] Regression test passes (or absence of seam is documented)
- [ ] All `[DEBUG-...]` instrumentation removed (`grep` the prefix)
- [ ] Throwaway prototypes deleted, or moved only to this bug's `.spec-workflow` `debug/` directory with the reason and cleanup expectation documented in `diagnosis-report.md`
- [ ] The hypothesis that turned out correct is stated in the commit / PR message when a commit or PR is created - so the next debugger learns

**Then ask: what would have prevented this bug?** If the answer involves architectural change, such as no good test seam, tangled callers, or hidden coupling, write a built-in architecture follow-up recommendation with the specific evidence, affected modules, proposed direction, expected benefit, and why it is out of scope for the bug-fix pass. Do not invoke a separate architecture-improvement skill. Make the recommendation **after** the fix is in, not before - you have more information now than when you started.

## Final Output

End with a bug-fix report in the user's language:

- Bug symptom and confirmed root cause.
- Repro loop command and original failing result.
- Fix summary.
- Regression test path or reason no correct seam exists.
- Validation commands and final results.
- Files changed.
- Diagnosis report path written.
- Verification and debug artifact paths kept, if any.
- Cleanup status, including debug instrumentation removal.
- Commit hash, if committed.
- Remaining risks, blocked verification, or follow-up architecture recommendation.
- Whether the original repro no longer reproduces.
