# SpecWorkflow

English | [中文](README.zh-CN.md)

SpecWorkflow is a shareable workflow skill pack for DeepSeek Harness and other Agent Skills-compatible tools. It gives an agent a disciplined path from a rough request to requirements, an implementation spec, code execution, delivery review, repair planning, bug diagnosis, and source-backed research.

It is intentionally not a heavy process for every request. Small, concrete edits can stay direct; ambiguous, cross-module, product-facing, data, permission, API, or release-sensitive work gets promoted into the full workflow.

![SpecWorkflow Architecture](assets/workflow-architecture.png)

## What It Does

| Stage | Skill | What it handles |
| --- | --- | --- |
| Research | `deep-research` | Source-backed investigation against docs, APIs, standards, code, or other primary sources. |
| 1 | `to-grill` | Requirement grilling, ambiguity removal, risk review, and the direct-fix vs full-workflow decision. |
| 2 | `to-spec` | Implementation-ready specs, amendments, acceptance criteria, validation plans, and optional tickets. |
| 3 | `spec-do` | Execution from an approved spec, issue set, amendment, or repair plan. |
| 4 | `do-review` | Final delivery review against request, spec, code, evidence, and acceptance criteria. |
| 5 | `fix-review` | Repair specs and repair tickets for must-fix review findings. |
| Debug | `bugs-fix` | Reproduction, root-cause diagnosis, repair, and fix evidence for bugs or regressions. |

## Requirements

- DeepSeek Harness `dsh@0.1.0-rc.6` or later for DSH installation.
- A repository workspace for the full workflow, because artifacts are written under `.spec-workflow/<feature-slug>/`.
- For non-DSH agents, an Agent Skills-compatible loader that can read `skill-package/*/SKILL.md`.

## Install

### DSH

```sh
dsh plugin --profile web add github:MoonCoder-HAPPY/SpecWorkflow
dsh web
```

Replace `web` with the DSH profile you use. For auditable installs, pin a commit:

```sh
dsh plugin --profile web add github:MoonCoder-HAPPY/SpecWorkflow#<commit>
```

### Other Agents

Ask your agent:

```text
Install https://github.com/MoonCoder-HAPPY/SpecWorkflow skill-package/* into the project-level skills directory recognized by your current agent tool. Keep folder names unchanged.
```

Use project-level installation when you want SpecWorkflow to apply only to the current repository.

## Quick Start

Typical feature work:

```text
Use to-grill to clarify this request, then move to to-spec when the requirement is ready.
```

Simple edits should stay simple:

```text
Make the table font larger.
```

SpecWorkflow should route that kind of request to direct implementation instead of forcing the full five-stage path.

## Workflow

Read the diagram from left to right. The top lane is the direct-fix shortcut, the middle lane is the full spec workflow, and the lower lane is the review-driven repair loop.

```text
to-grill -> to-spec -> spec-do -> do-review -> fix-review -> spec-do repair -> do-review
```

`to-grill` is the entry point for unclear or risky work. It reads the request, repo context, and visible constraints, then decides whether the task should be handled directly or promoted into the full workflow. When promoted, it writes the requirement conclusion to `.spec-workflow/<feature-slug>/requirements.md`.

`to-spec` turns a closed requirement conclusion into an implementation-ready spec. It captures scope, non-goals, data semantics, permissions, UX behavior, acceptance criteria, risks, and validation. For changes to an existing spec, it writes amendments and impact notes before implementation resumes.

`spec-do` implements approved specs, tickets, amendments, or repair plans. Before code changes, it handles branch choice, dirty worktree checks, and auto-commit preference. During implementation, it must not mock system business logic; evidence and implementation notes stay tied to the current feature directory.

`do-review` decides whether the work is truly shippable. It does not expand scope or change code. Must-fix findings move to `fix-review`.

`fix-review` turns must-fix findings into a repair spec and optional repair tickets. That repair plan goes back through `spec-do`, then returns to `do-review` until the work is shippable or needs a human decision.

`deep-research` and `bugs-fix` are side paths. Use `deep-research` before or during the workflow when external facts matter. Use `bugs-fix` for failures, regressions, and performance problems.

Goal Mode is opt-in per spec. When enabled, the agent may continue through implementation, review, repair planning, repair implementation, and follow-up review for the current spec only. It stops when the goal is met, the repair budget is exhausted, or a product, safety, git, validation, environment, or scope decision needs the user.

## Directory Output

SpecWorkflow keeps workflow files under `.spec-workflow` so project code and agent evidence stay separate.

```text
.spec-workflow/<feature-slug>/
  requirements.md
  spec.md
  issues/
  amendments/
  implementation/
  review/
  repair-spec.md
  repair-issues/
  verification/
  debug/
  bugs/
  research/
```

Project tests still belong in the project's real test directories, not under `.spec-workflow`.

## Boundaries

- SpecWorkflow does not replace product judgment. User choices are reviewed for reasonableness, safety, security, performance, maintainability, scope fit, verification cost, and reversibility before the agent proceeds.
- Simple, low-risk edits should not be forced into the full workflow.
- Implementation skills must not mock real system business logic just to make tests pass.
- Goal Mode is always opt-in and applies only to the current spec.
- The DSH package is a skill provider only. It does not register model-facing tools, manage credentials, or add resident background services.

## Package Layout

```text
skill-package/
  to-grill/
  to-spec/
  spec-do/
  do-review/
  fix-review/
  bugs-fix/
  deep-research/

index.mjs
cordis.patch.yml
package.json
```

For DSH, `index.mjs` registers `skill-package/` through the native `FileSystemSkillProvider`. For other agents, each folder under `skill-package/` is a standalone Agent Skill with its own `SKILL.md`.

## Verify

After installing into DSH:

```sh
dsh --profile web --dump-config
```

The composed config should include:

```text
# == specworkflow
- id: specworkflow
  name: specworkflow
```

You can also ask the agent which SpecWorkflow skills are available and when to use `to-grill`.

## Uninstall

```sh
dsh plugin --profile web remove specworkflow
```

Replace `web` with the profile you installed into.

## Compatibility

The DSH wrapper has been verified locally with `dsh@0.1.0-rc.6`. The package is host-only and does not ship a Web UI, resident tools, credentials, or background services. It registers a read-only skill provider over the bundled `skill-package/` directory.

## License

MIT. See [LICENSE](LICENSE).
