# Subagent Capability and User Preference Adapters

Subagent use is a user-selected policy, not a mandatory workflow default. Before
Goal Mode activation, `to-spec` must ask separately whether the user wants child
agents for implementation and whether the user wants child agents for final
review. Persist both choices in the spec. `spec-do` and `do-review` must honor
those choices and must not silently replace a user's choice with the model's
preference.

Supported policy values:

- `local`: main agent only; no child dispatch.
- `auto`: main agent decides from task independence, risk, and host support.
- `prefer`: actively prefer child agents when a safe independent split exists.

Policy precedence:

- In Goal Mode, the current spec/amendment or authoritative tracker controls.
  A conversational change must be recorded in that authoritative source before
  it takes effect.
- Outside Goal Mode, an explicit stage-specific choice in the current
  conversation takes precedence, then a user-selected stage policy already
  recorded in the current spec/amendment, then an older implementation/review
  report. Persist a new answer for the same spec/stage.

If Goal Mode is authorized but either policy is missing, pause and ask before
starting implementation or review. Outside Goal Mode, first inspect whether the
work has at least two safe independent axes and the host exposes a child-agent
mechanism. Ask one stage-specific question only when child agents could
materially improve the work; otherwise use local serial/axis-separated work and
record the fallback reason without a ceremonial question.

## Preference And Capability Check

When the selected policy is `auto` or `prefer`, perform these steps after
reading the spec and Git baseline, and after drafting the DAG:

1. Identify the actual host and surface: Codex app/CLI/IDE, Claude Code, Cursor,
   Copilot IDE, OpenCode, Gemini CLI, Cline, Roo Code, DSH, or another client.
2. Inspect the tools exposed in the current turn. A tool mentioned in historic
   documentation but absent from the current session is unavailable.
3. Resolve the host adapter from the matrix below. If the host or version is not
   listed, inspect the current tool list and host help before choosing a
   fallback. Do not invent an API.
4. Derive independent slices from the DAG.
5. Apply the user's policy: `local` stops here; `auto` uses child agents only
   when they materially improve execution; `prefer` actively looks for a safe
   independent split.
6. If at least two slices qualify and the host supports child agents, dispatch
   them before editing. A plan to delegate later is not sufficient once the user
   selected `auto` or `prefer` and the main agent decided delegation is useful.
7. Record the persisted user policy, capability, dispatch mode, agent
   IDs/names, scopes, dependencies, and any fallback reason.

## Host Matrix

Verified on 2026-10-29 against first-party documentation. Product behavior can
change; re-check the current host when a documented tool or command is absent.

| Host | Verified mechanism | Parallel/write implications |
|---|---|---|
| Codex app / CLI / IDE | Subagents are enabled by default; current local releases delegate after a direct request or applicable skill/AGENTS instruction. Custom agents live under `.codex/agents/*.toml`; concurrency can be set with `[agents] max_concurrent_threads_per_session`. | Use the available spawn/collaboration tool. Assign non-overlapping files because child agents share the parent workspace unless the host explicitly isolates them. Wait for all children and aggregate results. |
| Claude Code | Built-in and custom subagents can be delegated automatically or invoked explicitly. They support foreground/background work, parallel research, custom tools/models, nested agents, and a documented concurrent limit. | Prefer explicit parallel tasks for independent slices. Keep write scopes disjoint. Use background only when the parent can continue without that result. |
| Cursor | Subagents can be invoked automatically, with `/agent-name`, or natural language. They support foreground/background execution, parallel execution, and isolated project copies/worktrees or cloud environments for write-heavy work. | Use foreground when the next step depends on the result. Use isolated worktrees/cloud copies for parallel write tasks. The parent owns merge and final validation. |
| GitHub Copilot in IDE | Subagents must be enabled and require configured custom agents. They can be selected automatically or invoked directly and return to the main chat. | Direct child-agent selection is documented. Parallel execution is not assumed unless the current surface exposes it; otherwise serialize. |
| OpenCode | Primary agents can invoke subagents automatically by description or through `@agent`; built-in `general` and `explore` child sessions are documented. General subagents can run multiple units in parallel. | Use `explore` for read-only investigation and `general` for independent implementation slices. Verify child-session navigation/result collection in the current TUI. |
| Gemini CLI | Subagents are exposed as tools with isolated context. Delegation can be automatic or forced with `@subagent`; built-in `generalist`, `codebase_investigator`, and other agents are documented. | Prefer `generalist` for resource-heavy implementation slices and `codebase_investigator` for read-only mapping. Respect configured agent overrides/tool limits. |
| Cline CLI / Desktop | `spawn_agent` starts parallel subagents with separate context. The VSCode and JetBrains extensions do not use this subagent feature. | Use only on Cline CLI/Desktop. In Act mode children can edit, so assign disjoint scopes and inspect the spawn approval. In Plan mode treat review children as read-only. |
| Roo Code | Orchestrator/Boomerang mode uses `new_task` to hand work to another mode and `attempt_completion` to return a summary. Subtasks have isolated context. | Treat this as an isolated sequential handoff unless the current version explicitly exposes parallel scheduling. Do not claim concurrent subagents. |
| DSH / unknown host | Child-agent APIs are not verified by this reference. | Run current-host discovery. If no child-agent tool is exposed, use documented local serial implementation/review and record `unavailable-unverified`. Do not simulate subagents with cloud sessions or external orchestration. |

## Parallel Implementation Criteria

For `auto` or `prefer`, dispatch implementation children only when all are true:

- At least two tasks have real independent value.
- Write scopes do not overlap.
- Shared contracts, migrations, schemas, or cross-cutting decisions are already
  fixed or owned by the main agent.
- Each child has a verifiable acceptance check.
- Dependencies and merge order are explicit.
- The host exposes a child-agent mechanism with acceptable permission and cost.

Keep these in the main agent:

- Product decisions and unresolved contracts.
- Shared schema/API/migration changes that other slices depend on.
- Cross-cutting refactors and overlapping files.
- Final integration, full regression, commit, and delivery report.

Suggested initial dispatch: 2-3 children, or the host's lower configured limit.
Do not start more children than ready independent tasks. Refill slots only after
a dependency is satisfied or a child result is integrated.

## Review Dispatch Criteria

When review policy is `auto`, consider independent read-only review children
when any of these apply. When review policy is `prefer`, use them unless the
review is too small or tightly coupled to split safely:

- More than three changed files, or more than one module/package.
- Both frontend and backend behavior changed.
- Security, permissions, audit, data migration, persistence, or external
  contracts are affected.
- The implementation has multiple high-risk acceptance paths.
- The review would otherwise mix Standards and Spec judgments in one pass.

Default children:

- Spec/Acceptance reviewer: original requirement, spec/tickets/amendments,
  implementation report, acceptance evidence.
- Standards/Security/Regression reviewer: project standards, correctness,
  security, exceptional flows, tests, and maintainability.

Add focused children for frontend interaction, backend/API behavior, database or
migration safety, or runtime/performance when those are material. Review
children must be read-only and must receive the fixed point and exact diff scope.

`local` always uses main-agent axis-separated review. Small, single-module,
low-risk reviews may also use local review under `auto`. The review report must
record the user policy and why child review was or was not used.

## Child Prompt Contract

Every child prompt must include:

- Parent objective and exact task ID.
- Scope and non-goals.
- Authoritative spec/ticket/repair path or review fixed point.
- Allowed read scope and write scope; review children are always no-write.
- Files/modules owned by the child and files/modules forbidden.
- Shared contracts or decisions that must not be changed.
- Expected deliverable: patch/commit/evidence for implementation, or findings
  with file/line evidence for review.
- Acceptance checks and required validation commands.
- Dependency, integration order, and completion signal.
- Language policy and exact technical-value preservation.
- Instruction not to revert other agents' work.

## Fallback Codes

Record one reason when no child is dispatched:

- `not-parallelizable`: fewer than two independent slices, or overlapping write
  scopes.
- `contract-unstable`: shared API/schema/product decision is unresolved.
- `host-unavailable`: current host exposes no child-agent tool.
- `permission-denied`: child dispatch is blocked by host policy.
- `cost-safety`: user/host imposed a serial or no-delegation budget.
- `trivial-fast-path`: small single-module implementation or review.
- `user-selected-local`: the user explicitly chose main-agent-only execution or
  review.

These reasons apply only when the user policy permits or requests child agents.
When the policy is `local`, record `user-selected-local` without treating it as
a failed capability check.

## Sources

- Codex: https://learn.chatgpt.com/docs/agent-configuration/subagents
- Claude Code: https://code.claude.com/docs/en/sub-agents
- Cursor: https://cursor.com/docs/agent/subagents
- GitHub Copilot IDE subagents:
  https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-subagents
- OpenCode: https://opencode.ai/docs/agents/
- Gemini CLI subagents:
  https://github.com/google-gemini/gemini-cli/blob/main/docs/core/subagents.md
- Cline subagents: https://docs.cline.bot/features/subagents
- Roo Code Boomerang tasks:
  https://docs.roocode.com/features/boomerang-tasks
