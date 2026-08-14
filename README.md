# SpecWorkflow

English | [中文](README.zh-CN.md)

SpecWorkflow is a project-level skill pack for agents that need a clean path from rough requests to shipped code. It keeps discovery, specs, implementation, review, repair, bug work, and research in one predictable flow.

## Skills

| Skill | Role | Main output |
| --- | --- | --- |
| `to-grill` | Clarifies the request and decides whether the full workflow is needed. | `requirements.md` or direct-fix decision |
| `to-spec` | Turns settled requirements into an implementation-ready spec. | `spec.md`, `issues/`, `amendments/` |
| `spec-do` | Implements approved specs, tickets, or repair plans. | implementation report and verification evidence |
| `do-review` | Checks whether the work is ready to ship. | ship, repair, or pause decision |
| `fix-review` | Converts review findings into a repair plan. | `repair-spec.md`, `repair-issues/` |
| `bugs-fix` | Diagnoses and fixes bugs or regressions. | diagnosis report and fix evidence |
| `deep-research` | Captures source-backed research for decisions. | research notes under `.spec-workflow` |

## Layout

```text
skill-package/
  to-grill/
  to-spec/
  spec-do/
  do-review/
  fix-review/
  bugs-fix/
  deep-research/
```

Each folder is a standalone skill with its own `SKILL.md`.

## Workflow

![SpecWorkflow Architecture](assets/workflow-architecture.png)

Read the diagram from left to right. The middle lane is the full spec workflow, the upper lane is the direct-fix shortcut, and the lower lane is the review-driven repair loop.

```text
to-grill -> to-spec -> spec-do -> do-review -> fix-review -> spec-do repair -> do-review
```

`to-grill` is the entry point. It reads the user request, repo context, and visible constraints, then decides whether the work should be handled directly or promoted into the full workflow. Small copy, styling, config, or obvious low-risk edits should be implemented directly. Ambiguous, cross-module, product-facing, data, permission, API, or user-flow changes should enter the workflow and write the requirement conclusion to `.spec-workflow/<feature-slug>/requirements.md`.

`to-spec` turns the requirement conclusion into an implementation-ready spec. It captures the goal, scope, non-goals, data semantics, permissions, UX behavior, acceptance criteria, risks, and validation plan. When updating an existing spec, it analyzes the impact first, then writes `spec.md`, `amendments/`, and optional `issues/`.

`spec-do` implements the approved work. It reads `spec.md`, `issues/`, or a repair plan, then follows the user's execution choice: serial work or internal subagent parallelism. Before implementation, it handles the branch, dirty worktree, and auto-commit decisions. During implementation, it does not mock system business logic; code changes, migrations, tests, evidence, and implementation reports stay tied to the current `.spec-workflow/<feature-slug>/` directory.

`do-review` is the delivery check. It does not expand scope or change code. It compares the original request, spec, code, implementation report, tests, and evidence, then returns one outcome: shippable, needs repair, or pause. Any must-fix finding moves to `fix-review`.

`fix-review` converts must-fix findings into a repair plan. It separates required fixes from deferred or unclear issues, writes `repair-spec.md`, and optionally splits `repair-issues/`. The repair plan returns to `spec-do` for implementation, then back to `do-review` for another delivery check until the work is shippable or needs a human decision.

`bugs-fix` and `deep-research` are side paths. Failures, regressions, and performance problems go to `bugs-fix` for reproduction, root-cause diagnosis, repair, and evidence. Questions that need external facts, official docs, API behavior, or source-backed decisions go to `deep-research`; its notes are saved under the current `.spec-workflow` directory and can feed requirements, specs, or direct decisions.

Goal Mode is opt-in per spec. When enabled, the agent may continue through implementation, review, repair planning, repair implementation, and follow-up review for the current spec only. It stops when the goal is met, the repair budget is exhausted, or a product, safety, git, validation, environment, or scope decision needs the user.

## Quick Start

Ask your agent

```text
Install this repository's skill-package/* into the project-level skills directory recognized by your current agent tool. Keep the folder names unchanged. After installing, list the installed skills and confirm each one has a SKILL.md.
```

Use project-level installation when you want SpecWorkflow to apply only to the current repository. Use a global skills directory only if you intentionally want these skills available everywhere.

## Artifact Storage

SpecWorkflow keeps working files under `.spec-workflow` so project code and temporary agent evidence stay separate.

| Area | Typical contents |
| --- | --- |
| `.spec-workflow/<feature-slug>/` | `requirements.md`, `spec.md`, issues, amendments, implementation notes, review reports, repair plans |
| `.spec-workflow/<feature-slug>/verification/` | command logs, screenshots, traces, payload captures, one-off harnesses |
| `.spec-workflow/<feature-slug>/debug/` | temporary debug helpers and investigation notes |
| `.spec-workflow/<feature-slug>/bugs/` | bug diagnosis reports and bug-specific verification evidence |
| `.spec-workflow/<feature-slug>/research/` | source-backed research notes |

Project tests still belong in the project's real test directories, not under `.spec-workflow`.

## Best Practices

When docs are unclear, external APIs are uncertain, or framework behavior needs confirmation, start with `deep-research` and save sources plus conclusions under `.spec-workflow/<feature-slug>/research/`.

For development work, follow the five-step main path: `to-grill -> to-spec -> spec-do -> do-review -> fix-review`. This keeps requirements, specs, implementation notes, acceptance review, and repair planning tied to one feature directory.

For failures, regressions, or performance issues before or after release, use `bugs-fix` for focused diagnosis. If the bug reveals new scope or requirements, move back to `to-grill` or `to-spec`.

## License

MIT. See `LICENSE`.
