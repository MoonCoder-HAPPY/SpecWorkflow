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

### Other Agents

```sh
npx specworkflow install codex
```

Install globally with `-g`:

```sh
npx specworkflow install -g codex
```

Replace `codex` with another preset when needed:

| Input | Project install | Global install with `-g` |
| --- | --- | --- |
| `codex`, `openai`, `agents`, `agent`, `agent-skills`, `agents-md`, `goose`, `zed`, `amp`, `sourcegraph-amp` | `.agents/skills` | `~/.agents/skills` |
| `gemini`, `gemini-cli`, `antigravity`, `google-antigravity` | `.agents/skills` | `~/.gemini/antigravity/skills` |
| `claude`, `claude-code`, `claudecode` | `.claude/skills` | `~/.claude/skills` |
| `cursor`, `cursor-agent`, `cursor-native` | `.cursor/skills` | `~/.cursor/skills` |
| `copilot`, `github-copilot`, `vscode`, `vs-code` | `.github/skills` | `~/.github/skills` |
| `dsh`, `deepseek`, `deepseek-harness` | `.dsh/skills` | `~/.dsh/skills` |
| `opencode`, `open-code` | `.opencode/skills` | `~/.opencode/skills` |
| `windsurf`, `cascade` | `.windsurf/skills` | `~/.windsurf/skills` |
| `cline`, `claudine` | `.cline/skills` | `~/.cline/skills` |
| `roo`, `roo-code`, `roocode` | `.roo/skills` | `~/.roo/skills` |
| `qwen`, `qwen-code`, `qwencode` | `.qwen/skills` | `~/.qwen/skills` |
| `kiro` | `.kiro/skills` | `~/.kiro/skills` |
| `kilo`, `kilo-code`, `kilocode` | `.kilo/skills` | `~/.kilo/skills` |
| `augment`, `augment-code`, `augmentcode`, `auggie` | `.augment/skills` | `~/.augment/skills` |
| `openclaw`, `claw` | `skills` | `~/.openclaw/skills` |

Unknown plain names are rejected so a typo does not create the wrong folder. For unsupported agents, pass an explicit project-level skills path:

```sh
npx specworkflow install .my-agent/skills
```

With `-g`, relative explicit paths are resolved from your home directory.

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

SpecWorkflow does not start by writing a spec. It starts by deciding whether the request deserves one. Small, obvious work such as copy edits, style tweaks, or a missing guard should stay direct.

The full route is for work with product meaning, data semantics, permission boundaries, cross-module impact, release risk, or enough ambiguity that guessing would be expensive. Once a request enters the route, keep its artifacts under one `.spec-workflow/<feature-slug>/` folder so every later pass has the same source of context.

```text
to-grill -> to-spec -> spec-do -> do-review -> fix-review -> spec-do repair -> do-review
```

`to-grill` turns a vague request into something solid. It should inspect the repo before asking questions, separate facts the code can answer from decisions only the user can make, and decide whether the work should be direct, deferred, or promoted into a spec. When it hands off, it leaves a requirements conclusion that the next stage can actually use.

`to-spec` turns that conclusion into an implementation contract. A useful spec names the scope, the non-goals, the affected modules, the data and permission rules, the user-visible behavior, and the evidence that will prove the work is done. If the task is changing an existing spec, it records the amendment and its impact instead of pretending the work starts from a blank page.

`spec-do` is the first stage that should touch production code. It checks the branch and dirty worktree, consumes the commit policy already chosen for a Goal run, and works from the approved spec, tickets, amendment, or repair plan. In staged execution it asks about commit permission before editing. Temporary evidence can live under `.spec-workflow`, but durable tests belong in the project's own test tree. Business logic should be wired for real, not mocked away just to make a validation run pass.

When implementation claims to be finished, `do-review` decides whether that claim holds. It compares the original request, spec, code diff, tests, and evidence, then looks for missed requirements, regressions, edge cases, and acceptance gaps. Review is not a quiet repair pass and not a place to expand scope; its job is a clear ship / no-ship judgment.

If the review finds must-fix issues, `fix-review` turns them into a focused repair plan. It cares about root cause, priority, verification, and whether the repair should be split into tickets. That plan goes back to `spec-do`, and the repair returns to `do-review`. The loop stays short: repair what blocks delivery, then review again.

`deep-research` and `bugs-fix` sit beside the main route rather than inside it. Reach for `deep-research` when the answer depends on primary sources, official docs, API behavior, standards, or external facts. Start with `bugs-fix` when the problem is already a failure, regression, exception, or performance issue; reproduce first, then diagnose the root cause.

### Goal Mode

Choose Goal Mode at the end of `to-spec`, after requirements, testing, optional tickets, branch handling, and the finished spec are settled. The final choice shows the exact spec version, completion target, repair limit, execution backend, and whether commits are allowed. An earlier request to "run autonomously" is recorded as a preference; it does not start execution.

The Goal round limit defaults to **3**, with **5**, **10**, and **Custom** alternatives. It caps automatic repair cycles for the current spec; the run finishes early when the goal is met. Choose the limit before the final execution-mode choice. Host continuation limits and token budgets are separate.

Choosing the mode authorizes the run. Starting it requires a separate, real host action. On a host exposing goal tools, the agent must create or reuse the matching goal and read back its state. If the host needs a composer command or UI action, the workflow reports that it is waiting for activation. Writing `Goal mode: enabled` in a spec does not activate the host.

After verified activation, implementation, review, repair planning, and repair execution continue without repeating settled questions. The agent fixes in-scope defects and chooses technical details itself. A new product decision, scope change, unresolved ownership, unavailable required validation, or exhausted limit records a blocker before requesting input. Each new spec or amendment gets its own final choice.

Persistent goals are not a universal Agent feature. A host without a verified goal or loop can offer explicitly labeled **session-only execution**: continue within the current invocation, with no promise of automatic continuation after the host ends the turn. Auto-approval and permission-bypass flags do not turn it into a persistent goal. Host-specific entries and verification requirements are bundled in [the runtime adapters](skill-package/to-spec/references/agent-runtime-adapters.md).

| Host | Goal / continuation entry |
| --- | --- |
| Codex | Exposed goal tools when available; otherwise user `/goal` in the current chat. |
| Claude Code | User `/goal <condition>`; verify its active indicator and status. |
| Cursor | User `/goal [objective]` where rollout has made it available. |
| DSH | Model `create_goal` plus the official round driver; verify both active and armed state. |
| Copilot CLI | User selects Autopilot and submits the spec-bound execution prompt, or accepts a matching ready plan in Autopilot. |
| Qwen Code, Kiro CLI, Kilo Code, Antigravity, Junie, Hermes | Native Goal entries with product-specific approval, state, completion and recovery rules. |
| Other clients and future versions | Research the actual current host before choosing an execution fallback; auto-approval and durable state alone are insufficient. |

The bundled [coverage catalog](skill-package/to-spec/references/additional-agent-runtimes.md) contains 30 named tools/products, including every host represented by the installer presets. It records startup steps, execution surfaces, lifecycle limits, and primary sources. Entries with insufficient evidence are marked as such rather than assigned a guessed Goal command.

For a new Agent, unavailable entry, changed version, or conflicting result, the [built-in discovery procedure](skill-package/to-spec/references/runtime-discovery.md) inspects local tools/help and current official docs or source. It saves the current host's findings under `.spec-workflow/<feature-slug>/research/agent-runtime.md` and verifies real activation before implementation. The installed skill is not rewritten automatically, and discovering a mechanism does not authorize installing a plugin, changing permissions, or launching cloud work.

### Output Language And Handoffs

Each of the seven skills carries the [bilingual presentation and reading contract](skill-package/to-spec/references/bilingual-output.md). Questions, progress, report headings and delivery conclusions follow the user's chosen language; they are not duplicated in both languages by default. Programming terms, actual command/API identifiers, paths and literal evidence keep their real spelling.

Language instructions keep their scope: requesting an English report in a Chinese conversation changes the report, not ordinary questions/progress. Only an explicit all-output switch changes everything. Child-agent prompts and recovery messages carry and reuse this resolved policy.

Later stages understand Chinese, English and mixed legacy labels while preserving the separate ticket, review and Goal-state domains. Translation does not grant authorization or reset repair counts. Skill-menu metadata has static strings rather than automatic locale selection, so it uses paired bilingual labels.

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
