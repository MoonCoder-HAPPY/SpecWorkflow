# Agent Runtime Adapters

Evidence checked on 2026-10-12 against official documentation and official
source. Read the host section that applies to the current session. Commands
and rollout vary by installed version: the live tool schema, command menu,
runtime state, and applicable host policy take precedence over this snapshot.
For a new host, an unverified row, an unavailable entry, a version/surface
mismatch, conflicting evidence, or a rejected activation contract, read
`runtime-discovery.md` and research the current host before offering a fallback.
This discovery behavior is internalized here; do not call an external research
skill or assume that this catalog is permanently complete.

The 30-product coverage index and additional startup/lifecycle cards are in
`additional-agent-runtimes.md`. Read the matching card when the current host
is not in the detailed sections below. This includes every installer preset's
actual host plus additional common clients; catalog coverage does not add new
installer aliases or prove support for every version.

These are host capabilities, not dependencies on other workflow skills.
Do not install plugins, edit hook/approval settings, launch another CLI, or
create a cloud task as a side effect of selecting Goal Mode.

## Capability Map

| Host / surface | Verified entry | How to establish activation | Backend |
| --- | --- | --- | --- |
| Codex desktop / interactive CLI / IDE | `/goal`; exposed goal tools when present | Read matching current goal or visible host goal state | `native-goal` |
| Claude Code | User `/goal <condition>` | `◎ /goal active`, bare `/goal` status, evaluator verdicts | `native-goal` |
| Cursor Agent / CLI | User `/goal [objective]`, rolling out | Confirm command availability and observable goal state/continuation | `native-goal` only where available |
| DSH with official Goal stack | `create_goal` tool or Web `/goal` | Correct goal id/revision, active phase, armed activation, loaded round driver | `native-goal` |
| GitHub Copilot CLI | Shift+Tab to Autopilot, then submit the bound execution prompt; or accept the ready plan in Autopilot | Actual mode plus accepted spec-bound prompt/run; observe continuation and `task_complete` for completion | `host-loop` |
| Gemini CLI | Custom `AfterAgent` hooks exist; native Goal unverified | A specifically installed loop needs its own verified contract | `session-only` unless a verified loop was explicitly selected |
| OpenCode | Community Goal plugin listed; core native Goal unverified | Verify the actual installed plugin, not the ecosystem listing | Same fallback |
| Cline / Roo Code | Task execution, approval controls, Roo subtasks; native Goal unverified | Task/subtask progress is not persistent-goal evidence | Same fallback |
| Windsurf / Cascade | Auto-Continue at invocation limits | This setting alone is not goal state or completion evaluation | Same fallback |
| Qwen Code / Kiro CLI / Kilo Code / Antigravity 2.0 / Junie / Hermes | Native target entries with different tool/UI/client contracts | Read the exact startup and lifecycle card in `additional-agent-runtimes.md` | `native-goal` when current support/continuation is verified |
| OpenClaw | Durable Goal and Start/Resume admission verified; auto-followup unverified | State/start success alone does not prove autonomous continuation | Research driver before persistent-run choice |
| Amp / Goose / Zed / Augment / Warp / Aider / Continue | Ordinary/local/remote work with separate boundaries | Use their cards and current-host discovery | Accurate fallback after research |
| OpenHands / Devin / Factory / Replit / TRAE / Amazon Q | Conditional refinement/mission/cloud/task modes | Verify actual surface, prerequisites, limits and scope | No implicit settings/cloud/permission changes |
| Other/future hosts | Execute `runtime-discovery.md` for current host | Do not guess `/goal`, `/ralph`, or lifecycle APIs | Accurate fallback only after research |

Skill installation support is not a promise that a host has native Goal support.
For unverified hosts, first execute `runtime-discovery.md`. Only if current
research still finds no verifiable usable goal/loop should you offer explicitly
labeled session-only execution or staged execution, with the evidence limit.
An existing optional loop can be used only after checking its source, state,
completion test, limits, cancellation, and resume behavior before the final
choice. Do not build or install a loop implicitly to satisfy the menu.

## Codex

Prefer the tools actually exposed in the current session. Where their live
schemas match these names:

1. `get_goal({})`: inspect the current goal and preserve unrelated objectives.
2. `create_goal({ objective: <approved current-spec target> })`: call only
   after the user's final per-version choice explicitly authorizes a goal.
3. `get_goal({})`: verify the target, current status, and identity against the
   authorization anchor; record the returned state before implementation.
4. At evidenced completion, `update_goal({ status: "complete" })`, then read
   back the current goal if supported. Re-check identity before updating.

Pass `token_budget` only if the user explicitly chose a token budget and the
tool supports it. A repair-cycle limit is not a token budget. Do not infer a
pause/resume API from the names: the current `update_goal` contract may require
an explicit user pause request, restrict `blocked` to repeated blocked turns,
and provide no resume/objective-edit operation. Respect that contract.

When no goal creation tool is exposed but the current surface supports it,
provide `/goal <approved objective>` for submission in the **host composer**.
CLI users can inspect with bare `/goal` and manage with `/goal edit`,
`/goal pause`, `/goal resume`, or `/goal clear` when the installed version lists
them. Desktop users have goal progress controls. Never type a slash command
into a shell or assume a Markdown response invokes it.

Official CLI objectives are non-empty and at most 4,000 characters. Reference
the absolute spec path and version for detailed scope. `--full-auto`, approval
policies, and sandbox bypasses are not goal activation mechanisms.

Sources: [long-running work](https://learn.chatgpt.com/docs/long-running-work),
[desktop commands](https://developers.openai.com/codex/app/slash-commands),
[CLI reference](https://developers.openai.com/codex/cli/reference).
Tool examples above additionally depend on the actual exposed tool contract.

## Claude Code

The official native entry is user `/goal <condition>`; bare `/goal` reports
status and `/goal clear` clears it. The condition is limited to 4,000 characters.
Setting a new goal replaces an active goal and immediately starts a turn, so
inspect existing state and finish planning before providing the start action.

No model-side goal creation tool was established in the official tool list.
If none is exposed locally, mark `awaiting-host-activation` and provide the
user composer action. Do not assume the `Skill` tool can execute this command.
Verify the active indicator/status and the correct condition after submission.

Claude's separate evaluator sees the conversation, not files or tests directly.
Surface actual command results, review findings, and final acceptance evidence
in the conversation as well as artifacts. A spec path alone does not prove
completion. When final review passes, record `completion-pending-host` and
end the turn with that evidence so the evaluator can return Met and the host
can record achievement. No model-side completion API is required for this
branch; do not wait inside the turn for its post-turn verdict. Record native
completion only once that verdict/state is observable. Do not issue
`/goal clear` as a substitute for successful evaluation.
On a real workflow blocker, explicitly report that the goal is not met and what
input is needed; follow the host's supported user controls to stop continuation.

Resume restores an unfinished active condition, but host turn/timer/token
counters reset. Preserve SpecWorkflow's repair ledger across that reset.
Unrecoverable errors can clear the goal; hook/trust policy can disable it.
Verify real state rather than renewing it from a report. No `/goal pause` or
`/goal resume` command is assumed here; use only current documented controls.
Auto permission mode reduces tool approvals but does not create goal turns.

The official optional Ralph Wiggum plugin and timed `/loop` are different
mechanisms. Neither is a required dependency of this package, and this skill
does not invoke them as a substitute for native Goal activation.

Sources: [Goal](https://code.claude.com/docs/en/goal.md),
[commands](https://code.claude.com/docs/en/commands.md),
[tools](https://code.claude.com/docs/en/tools-reference.md).

## Cursor

Official Agent and CLI docs list `/goal [objective]` as a long-lived target.
It is rolling out, so check the current command menu/version/account first.
If available and no model-side goal API is exposed, provide the user composer
action and wait for observed activation. Do not silently start a new chat to
obtain rollout access or overwrite a different objective.

CLI Ctrl+C pauses a goal. Do not invent status/clear/resume subcommands or a
`get_goal` API: these were not established in the cited docs. Use locally
documented controls and observable host state; if that cannot be verified,
record the limitation instead of announcing success. Cross-process goal
restoration is unverified, so recheck it on resume.

Cursor `/loop` and stop hooks are distinct. Cloud Agent runs are separate
execution surfaces that may create branches/push; a local Goal selection is
not permission to launch one.

Sources: [Agent overview](https://cursor.com/docs/agent/overview.md),
[CLI slash commands](https://cursor.com/docs/cli/reference/slash-commands.md).

## DSH / DeepSeek Harness

DSH's official native Goal stack consists of the goal state service, model
goal tools, and automatic goal-round driver; the Web command adapter supplies
user `/goal` actions. Confirm that the **current session** composes
`@deepseek-ai/dsh-goal`, `@deepseek-ai/dsh-tool-goal`, and
`@deepseek-ai/dsh-goal-round-driver`. A visible state tool without the driver
does not prove persistent continuation. Minimal/SDK/ACP compositions differ.
Do not alter the composition without explicit user instruction.

DSH tool names overlap Codex's but their schemas are different:

```text
get_goal()
create_goal(objective, max_goal_rounds?)
update_goal(goal_id, revision, action, objective?, max_goal_rounds?, blocked_reason?)
```

Use actual structured arguments from the exposed schema. Read the current
goal before creation and before **each** update; use the exact id and fresh
revision. Do not pass Codex's `status` or `token_budget` fields to DSH.

Create/edit/pause/resume require a live top-level turn with direct human input.
Only the main agent handling the final user choice may start this goal; do not
delegate goal creation to a subagent or an autonomous Goal Round. If a turn no
longer has the required authority, record awaiting activation and ask for the
specific user host action; do not forge human input or retry a denied mutation.

Verify matching objective/version, `goal.phase: active`, **and**
`activation: armed` in `get_goal`; record the id/revision. Confirm the driver
composition and, when continuation occurs, Goal Round activity. Only an active
projection or only a Markdown enabled flag is insufficient.

Web commands are `/goal`, `/goal <objective>`, `/goal edit <objective>`,
`/goal pause`, `/goal resume`, and `/goal clear`. Commands are user control-plane
actions, not model prompts. Persistently paused goals must be resumed by the
user; model resume is rejected. After session restore/fork/restart, active
goals are disarmed and need explicit human resume authorization before rearm.

At completion, read the fresh ref and use `update_goal` action `complete`, then
read back if the host allows a final read. Autonomous `blocked` has a configured
recurrence threshold (official default: three consecutive Goal Rounds); it is
not legal to force this status on the first blocker. Respect the live threshold
and avoid repeating the user question while waiting. Round limits, provider
failures, and persistence failures can stop the driver; do not auto-rearm them
without the required human request. `max_goal_rounds` counts continuation
rounds, not repair cycles or tokens; leave host defaults alone unless a separate
host cap was explicitly selected.

Sources: official
[goal tools](https://github.com/deepseek-ai/deepseek-harness/blob/d743267388641bc76f17c45ce8b4c231aed1d32c/packages/goal/tool-goal/README.md),
[round driver](https://github.com/deepseek-ai/deepseek-harness/blob/d743267388641bc76f17c45ce8b4c231aed1d32c/packages/goal/goal-round-driver/README.md),
[user command adapter](https://github.com/deepseek-ai/deepseek-harness/blob/d743267388641bc76f17c45ce8b4c231aed1d32c/packages/goal/command-goal/README.md).

## GitHub Copilot CLI

Autopilot is a built-in continuation mode. The verified current-session user
entry has two distinct paths:

1. Switch with Shift+Tab until Autopilot is selected, then **submit an execution
   prompt** bound to the ready spec's absolute path, version, authorization
   anchor, target, repair limit, artifact root, and commit policy. Prepare this
   prompt for the user at handoff. A mode toggle alone does not submit work or
   start `spec-do`.
2. If a native ready-plan UI is already available and matches the approved
   spec, select its "Accept plan and continue in Autopilot execution mode"
   option, which starts execution from that plan. Do not submit another prompt
   when this path has already started the matching run.

If no model-side start/mode API exists, wait for the applicable host action;
verify the current session, selected mode, accepted spec-bound input and run,
then record automatic continuation when it occurs. Do not announce active
execution merely because the mode indicator changed. This is a technical start
action, not another business/authorization question. Do not treat Copilot IDE
Agent mode as the same feature or launch a new CLI/cloud session to imitate it.

For a **separately user-requested invocation**, official CLI reference documents
`--autopilot` / `--mode=autopilot` and `--max-autopilot-continues`. Check the
installed help and use only an explicitly selected cap. Official documentation
disagrees on the default cap, so do not assume five or unlimited. Do not enable
`--plan --mode autopilot` before the final per-spec choice: that combination can
auto-transition without a human plan approval. No permission-bypass flag is
needed as a default adapter instruction.

Observe automatic continuations and the current spec's evidence. Where exposed,
call `task_complete` only after final review satisfies the target. Ctrl+C stops
execution. A continuation cap, tool permission denial, or resumed session does
not prove success or renewed activation. `--no-ask-user` suppresses clarification
but does not create an automatic continuation loop; do not use it to conceal
missing requirements.

Sources: [Autopilot](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot),
[CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).

## Other Hosts And Optional Loops

- **Gemini CLI:** official `AfterAgent` hooks can reject a final response and
  trigger another turn. A hook extension point is not an installed goal engine.
  Auto-edit/YOLO and saved sessions do not prove persistent targets.
  [Source](https://github.com/google-gemini/gemini-cli/blob/9b6e0265d16bbd29ca51e33c9e0c01dc4cec5e83/docs/hooks/reference.md).
- **OpenCode:** the official ecosystem lists a community Goal plugin. Its
  listing does not prove local installation, command syntax, or core Goal
  support; inspect the actual plugin before any optional host-loop choice.
  [Source](https://opencode.ai/docs/ecosystem/).
- **Cline / Roo Code:** auto-approval, task completion, and Roo parent/subtask
  orchestration are real features but not evidence of a persistent current-chat
  Goal. Reuse the approved workflow within the current invocation unless an
  actual loop is discovered and explicitly selected.
  [Cline](https://docs.cline.bot/cli/overview.md),
  [Roo](https://github.com/RooCodeInc/Roo-Code/blob/b867ec9145750d0ae1ff7f02d35406e9bf2a0b16/apps/docs/docs/features/boomerang-tasks.mdx).
- **Windsurf / Cascade:** Auto-Continue addresses tool-invocation limits; Turbo
  addresses command approval. Neither proves a goal evaluator or restart
  behavior. Use the current product's documented setting names, not guessed
  keys from old versions.
  [Source](https://docs.devin.ai/desktop/cascade/cascade.md).

"Unverified" describes the cited evidence, not a permanent claim that a
product cannot add Goal support. Run `runtime-discovery.md` for the actual
current host, inspect its authoritative contract, and prove activation before
use. Never stop at a static negative row or copy another host's command.
