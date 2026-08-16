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

## Install

### DSH

```sh
dsh plugin --profile web add specworkflow
dsh web
```

Replace `web` with the DSH profile you use.

For unreleased changes or an auditable GitHub snapshot:

```sh
dsh plugin --profile web add github:MoonCoder-HAPPY/SpecWorkflow
```

Pin a commit when you need exact-source installs:

```sh
dsh plugin --profile web add github:MoonCoder-HAPPY/SpecWorkflow#<commit>
```

### Other Agents

Ask your agent:

```text
Install the npm package specworkflow, then copy its skill-package/* directories into the project-level skills directory recognized by your current agent tool. Keep folder names unchanged.
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

The diagram is meant to be read as a working route, not a ceremony. Start with the request in front of you, decide how much structure it actually needs, then keep every artifact for that piece of work under the same `.spec-workflow/<feature-slug>/` folder.

```text
to-grill -> to-spec -> spec-do -> do-review -> fix-review -> spec-do repair -> do-review
```

Use `to-grill` when the request still has unanswered product, data, permission, UX, or risk questions. It should not sit there asking what the repo can answer by inspection. Its job is to separate obvious direct edits from work that needs a real spec, then leave a short requirements conclusion when the work moves forward.

Use `to-spec` once the requirement is stable enough that another agent could implement it without guessing. The spec should say what is in scope, what is not, what data or permissions are involved, how the user-facing behavior should work, and how the result will be checked. When the work is a change to an existing spec, write the amendment and its impact instead of pretending it is a brand-new feature.

Use `spec-do` for the actual implementation pass. It should check the branch and worktree first, ask about auto-commit only when needed, then implement against the approved spec or repair plan. Tests and temporary evidence can be collected under `.spec-workflow`, but real project tests belong in the project's normal test directories. Business logic should be wired for real, not faked just to get a green run.

Use `do-review` when implementation claims to be done. This pass is deliberately judgmental: compare the original request, spec, code, tests, and evidence, then say whether the work is ready, needs repair, or should stop for a user decision. It should not quietly expand scope or fix code while reviewing.

Use `fix-review` only for findings that really need another implementation pass. It turns review findings into a focused repair plan, then sends that plan back to `spec-do`. After the repair, run `do-review` again. The loop ends when the work is shippable or when the next decision is genuinely the user's call.

`deep-research` and `bugs-fix` sit beside the main route. Use `deep-research` when an answer depends on outside facts or primary sources. Use `bugs-fix` when the starting point is a failure, regression, or performance problem rather than a planned feature.

Goal Mode is a convenience switch for one spec at a time. If the user enables it, the agent can keep moving through implementation, review, repair planning, repair implementation, and another review without pausing at every handoff. It still stops for product choices, safety concerns, git decisions, validation gaps, environment problems, or scope changes.

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

## License

MIT. See [LICENSE](LICENSE).
