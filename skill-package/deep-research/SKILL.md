---
name: deep-research
description: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user invokes /deep-research or $deep-research, wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
---

# Deep Research

Prefer spinning up a **background agent** to do the research, so you keep working while it reads. Before starting that agent, resolve the project root and exact output path. If background-agent tooling is unavailable, either perform the research in the main agent when the scope is still manageable, or pause and report that the research is blocked because it truly requires background delegation.

Its job:

1. Investigate the question against **primary sources** - official docs, source code, specs, first-party APIs - not a secondary write-up of them. Follow every claim back to the source that owns it.
2. Write the findings to a single Markdown file, citing each claim's source.
3. Save it only to the exact output path assigned by the main agent. The main agent should place requirement-specific research under the matching `.spec-workflow/<feature-slug>/research/<topic-slug>.md`. If the research is not tied to an existing requirement, prefer `.spec-workflow/<topic-slug>/research/<topic-slug>.md`. Say where it was saved.

## Main-Agent Responsibilities

- Wait for every background research agent before giving the final answer. If a background agent is stuck or silent for a long time, use the built-in stalled-background-agent policy below before exiting.
- Review the background agent's claims against the cited primary sources before presenting the findings as reliable.
- Resolve the project root before delegation: use the user-provided artifact path first; otherwise use the nearest git root; otherwise use the directory containing project guidance such as `AGENTS.md`; if the root cannot be determined uniquely, ask one focused question.
- Choose and communicate the exact output file path to the background agent before it writes anything. Reuse the existing `.spec-workflow/<feature-slug>/research/` directory when the current spec, ticket, bug, review, or repair work belongs to that feature.
- Before starting a background agent, confirm that the current environment provides usable background-agent tooling. If it does not, do not invent an external orchestration mechanism; continue in the main agent for bounded research, or pause when the research volume, source count, or time requirement makes main-agent execution unreliable.
- If the project is a git repo, record the current branch, `HEAD`, and `git status --porcelain=v1 -uall` before the background agent writes the Markdown file. This is a lightweight research baseline, not permission to commit.
- Do not create commits, amend commits, create branches, switch branches, stash, reset, or clean the worktree in this skill.
- Do not write research notes into production code, committed test directories, migration directories, config directories, generated-build/generated-code directories, dependency directories, lockfile locations, snapshots, or formatting-only files.
- If the worktree is dirty, do not try to clean it. Write only the research Markdown file and report any pre-existing dirty files as unrelated baseline context.

## Artifact Storage

Store research artifacts under `.spec-workflow` in the current project:

```text
.spec-workflow/<feature-slug>/research/<topic-slug>.md
.spec-workflow/<topic-slug>/research/<topic-slug>.md
```

Use the feature-specific path when the research supports a current requirement, spec, ticket, implementation, review, repair, or bug-fix workflow. Use the standalone topic directory only for research that is not tied to a requirement. Do not scatter research notes under `docs/`, production code, committed test directories, migration directories, config directories, generated-build/generated-code directories, dependency directories, lockfile locations, snapshots, or formatting-only files unless the user explicitly provides another non-production artifact directory.

## Background Agent Recovery Policy

Apply this policy to every background research agent.

- If a background research agent stops because of an API call error, model service interruption, network timeout, transient tool transport failure, or context delivery interruption, do not immediately treat the research as failed.
- First send a continuation instruction to the same background agent in the user's language, equivalent to: `Please continue from the interruption. Do not restart completed work. First summarize what is already done and what remains, then continue.`
- Localize the continuation instruction to the latest substantive user request language. For Chinese users, send the Chinese equivalent of "please continue from the interruption; do not restart completed work; first summarize what is already done and what remains, then continue."
- Allow at most two recovery attempts for the same research task after transient infrastructure failures.
- Do not use this recovery policy for real task failures such as inaccessible sources, paywalled or missing primary sources, permission denial, invalid output path, ambiguous research question, or evidence that the background agent wrote outside the assigned path. Handle those as blockers or research limitations.
- If the same background agent cannot recover after the allowed attempts, preserve its partial notes, start a replacement background agent only with the exact project root, output path, already-read sources, and remaining questions, or complete the remaining research in the main agent when small enough.
- Report recovery attempts, replacement agents, partial-output reuse, and any remaining source-confidence limits in the final answer.

## Stalled Background Agent Policy

Use this policy when a background research agent is silent, appears stuck, or has not produced useful progress for a long time without a clear transient API/tool interruption:

- Treat `30 minutes` without meaningful output or status change as stalled unless project guidance sets a stricter limit.
- Before stopping a stalled background agent, inspect any available status, output snapshot, partial notes, source list, and last reported research phase.
- Send one continuation instruction to the same agent in the user's language, equivalent to: `Please continue. First summarize your current state, sources already checked, findings so far, blockers, and the remaining plan.`
- If the agent resumes, keep coordinating it and report the stall and recovery in the final answer.
- If the agent remains stalled after the continuation window, stop, close, or kill only that background agent using the current environment's supported child-agent control. Do not kill unrelated terminals, processes, or agents.
- Preserve partial notes, source URLs or paths, confidence limits, and remaining questions.
- Start a replacement background agent only with the exact project root, output path, already-read sources, and remaining questions, or complete the remaining research in the main agent when small enough.
- Before final reporting, wait for every replacement background agent and close completed background agents when they are no longer needed.
