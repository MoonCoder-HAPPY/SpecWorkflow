# Agent Coverage Catalog

Checked against primary sources on 2026-10-12. This catalog covers 30 named
tools/products: every distinct host represented by this package's installer
presets, plus common additional terminal, IDE, and cloud agents. It is a dated
inventory, not a claim that every product or future version has been discovered.

Read the card for the actual host/surface. The first ten profiles below use the
existing details in `agent-runtime-adapters.md`; the remaining twenty cards
are internalized here. An installer alias is not capability or host identity.
Gemini CLI and Antigravity, or an editor and its external ACP agent, must be
identified separately. Generic `agent`/`agents`/`openai` installation names
require actual-host discovery.

`verified` applies to the stated feature, `conditional` adds prerequisites,
and `unverified` is an evidence limit, never a permanent negative. Native goal
state, automatic continuation, and detached/background work are separate axes.
For an unknown/unverified/changed mechanism, execute `runtime-discovery.md`
before offering an execution fallback. Never borrow a command from another row.

## Coverage And Entry Index

| Tool / product | Evidence-backed entry or boundary | Profile |
| --- | --- | --- |
| Codex | `/goal` or exposed goal tools; verify current state | `agent-runtime-adapters.md`, Codex |
| Claude Code | `/goal <condition>`; post-turn evaluator | `agent-runtime-adapters.md`, Claude Code |
| Cursor | `/goal [objective]`, rollout-dependent | `agent-runtime-adapters.md`, Cursor |
| DSH / DeepSeek Harness | Goal tools plus active/armed round driver | `agent-runtime-adapters.md`, DSH |
| GitHub Copilot | CLI Autopilot plus execution prompt; IDE is separate | `agent-runtime-adapters.md`, GitHub Copilot CLI |
| Gemini CLI | AfterAgent extension point; native Goal unverified | `agent-runtime-adapters.md`, Other Hosts |
| OpenCode | Community Goal plugin; core Goal unverified | `agent-runtime-adapters.md`, Other Hosts |
| Cline | Task execution/approval; persistent Goal unverified | `agent-runtime-adapters.md`, Other Hosts |
| Roo Code | Built-in subtasks; persistent Goal unverified | `agent-runtime-adapters.md`, Other Hosts |
| Windsurf / Cascade | Invocation-limit Auto-Continue, not proven Goal | `agent-runtime-adapters.md`, Other Hosts |
| Qwen Code | Native `/goal`, approval-backed proposal, verifier | Qwen Code |
| Kiro | CLI `/goal`; IDE Autopilot/workflows are separate | Kiro |
| Kilo Code | `/goal` or `goal` tool; root `goal_report` | Kilo Code |
| Augment Code / Auggie | Ordinary Agent/print; local Goal unverified | Augment Code / Auggie |
| Google Antigravity | 2.0/CLI `/goal`; older IDE/headless conditional | Google Antigravity |
| Sourcegraph Amp | Local single turn; optional remote Orb | Sourcegraph Amp |
| Block Goose | Task run/tool iterations; Goal unverified | Block Goose |
| Zed Agent | Built-in Agent Panel; external harness differs | Zed Agent |
| OpenClaw | Durable Goal/start admission verified; auto-followup unverified | OpenClaw |
| Warp Agent | Current-task autonomy; cloud runs separately | Warp Agent |
| Aider | Single request/reflection; Goal unverified | Aider |
| Continue | CLI/IDE tool loop; Goal unverified | Continue |
| Hermes Agent | Native `/goal` plus judge/continuation | Hermes Agent |
| OpenHands | Optional native Critic refinement loop | OpenHands |
| Devin | Local `/loop`; separate cloud session | Devin |
| TRAE | IDE/SOLO tasks; independent Goal unverified | TRAE |
| Replit Agent | Background task queue with manual application | Replit Agent |
| Factory Droid | Native Missions with plan/permission prerequisites | Factory Droid |
| JetBrains Junie | Goal mode and `/goal`; model/client prerequisites | JetBrains Junie |
| Amazon Q Developer | IDE agentic coding; CLI migrated to Kiro | Amazon Q Developer |

All start commands below are reference entries, not actions to execute during
research. Do not launch another CLI, create a cloud task, change approval or
Git settings, install a plugin, or submit external issue/PR messages as a side
effect of selecting Goal. If a host requires an additional native plan/form,
populate it from the finished spec and disclosed parameters; keep
`awaiting-host-activation` until its required approval and dispatch actually
happen. Do not reopen settled product requirements or invent acceptance rules.

## Qwen Code

- **Identify:** `qwen`, `qwen-code`, `qwencode`; distinguish interactive,
  headless, and ACP clients. Native cross-turn Goal is verified.
- **Start:** user `/goal <objective>` or `/goal set <objective>`. Where the
  current client supports it, model `propose_goal` requests dedicated user
  approval; it starts only after approval and a normal turn end. YOLO cannot
  skip that approval. Do not substitute an assumed `create_goal` API.
- **Verify/control:** bare `/goal` reports state; `/goal edit`, `/goal pause`,
  `/goal resume`, `/goal clear` have documented meanings. Headless entry is
  `qwen -p "/goal <objective>"` only for a separately requested invocation.
  Control the exact session, not an ambiguous latest-session shortcut. Stream
  events use `goal_state`; ACP uses `sessionGoalControl`/`_meta.goalState` where
  the frontend implements them.
- **Finish/recover:** `update_goal` proposes complete/blocked; the independent
  verifier accepts the terminal state after the turn. Before proposing completion,
  run the objective's proof checks immediately beforehand and surface only
  objective-required output/evidence, without progress or native-completion
  commentary. Put the review conclusion in the visible evidence when the
  objective requires it, and save `completion-pending-host`. A ready proposal can
  return `terminateTurn: true` and require no further user-facing text: obey it,
  without a later final response, state poll, or ledger write. Read the verdict
  only on a later allowed turn. Workspace trust and recording matter; interrupt can pause, old
  pre-journal sessions do not restore a live Goal, and native usage/turn/time
  windows remain separate from repair cycles. Do not reset them to bypass caps.
- **Sources:** [Goals](https://qwenlm.github.io/qwen-code-docs/en/users/features/goals/),
  [headless](https://qwenlm.github.io/qwen-code-docs/en/users/features/headless/).
  Official source snapshot: `QwenLM/qwen-code` commit
  `e17ad4caef7b7bc69f27c8b751a75ce099a011b8` (`0.25.1`),
  `packages/core/src/goals/goal-protocol.ts` and `goal-tools.ts`.

## Kiro

- **Identify:** `kiro`; CLI and IDE have different mechanisms. Current Amazon
  Q CLI documentation redirects to Kiro, not to the Q IDE feature set.
- **CLI start:** inside `kiro-cli chat`, user `/goal <objective>`; an explicitly
  selected host iteration cap uses documented `/goal --max <N> <objective>`.
  The documented host default is five iterations, not this workflow's three
  repair cycles. Do not set `--max 3` merely because the workflow default is 3.
- **Verify/control:** observe real implementation/self-verification progress;
  Ctrl+S steers; `/goal clear` cancels the loop while preserving file changes.
  A dedicated Goal status/pause/resume/restart contract was not established;
  discover current help instead of borrowing subcommands.
- **IDE/other workflows:** Autopilot reduces interaction but alone does not
  prove the CLI Goal state machine. Shared background workflows are a separate
  opt-in capability: existing `/workflow run` recipes and workflow status/
  pause/resume/cancel controls depend on version/account and enabled features.
  Do not enable Workflows, restart the client, or create recipes implicitly.
  Repeat caps, node persistence, and waiting are not CLI Goal caps.
- **Sources:** [CLI Goal](https://kiro.dev/docs/cli/chat/goal.md),
  [IDE Autopilot](https://kiro.dev/docs/ide/chat/autopilot.md),
  [workflows](https://kiro.dev/docs/workflows.md),
  [workflow management](https://kiro.dev/docs/workflows/manage.md).

## Kilo Code

- **Identify:** `kilo`, `kilo-code`, `kilocode`; CLI/VS Code native Goals verified.
- **Start:** user `/goal <objective>` or Set goal composer/Start goal. An
  exposed `goal` tool can start with action `start` plus objective or resume
  with action `resume`; inspect its actual schema/permission. Active goals
  hide this tool, and delegated workers cannot create goals. The loop begins
  after the current turn, without cancelling that response.
- **Verify/control:** bare `/goal`, `/goal pause`, `/goal resume`, `/goal clear`
  and composer controls; do not replace another running objective. Headless
  `kilo run --command goal` supports status/pause/clear only; do not copy the
  interactive start syntax into it.
- **Finish/recover:** only the root worker uses `goal_report` complete/blocked;
  the report is persisted after a clean turn end. Treat an accepted report as
  pending until terminal state is observed, not as independent verification.
  Active goals become paused on backend restart; some failures/denials also
  pause/block. The question tool is unavailable during active Goal: report the
  real blocker, let the host transition, and request the needed user action
  through an allowed surface instead of inventing the tool or guessing a rule.
- **Source:** [Session Goals](https://kilo.ai/docs/code-with-ai/agents/goals).

## Augment Code / Auggie

- **Identify:** `augment`, `augment-code`, `augmentcode`, `auggie`; distinguish
  IDE Agent/Agent Auto, local CLI, and Cosmos cloud.
- **Observed entry:** IDE choose Agent and submit the finished request; `auggie`
  is interactive, `auggie --print "<instruction>"` runs one instruction and
  exits. Queue flags and `--max-turns` do not establish a persistent Goal.
  Local native Goal/automatic post-reply continuation is unverified.
- **Verify/control:** IDE progress/Stop and CLI session list/resume are ordinary
  work/history controls. Agent Auto and tool permissions are different; CLI
  permission settings do not prove IDE enforcement. Check current runtime
  before offering persistent execution.
- **Other surface:** Cosmos New Session is real cloud execution with separate
  environment, credentials, and lifecycle limits. It is not an implicit local
  Goal fallback; environment restart or saved chat does not prove Goal rearm.
- **Sources:** [CLI reference](https://docs.augmentcode.com/cli/reference.md),
  [IDE Agent](https://docs.augmentcode.com/using-augment/agent.md),
  [Cosmos sessions](https://docs.augmentcode.com/cosmos/sessions-overview.md).

## Google Antigravity

- **Identify:** `antigravity`, `google-antigravity`; CLI executable `agy`.
  Do not conflate it with Gemini CLI merely because installation directories
  or model providers overlap.
- **Start:** 2.0 Desktop/Web or CLI interactive `/goal <objective>` is verified
  and documented to work continuously to the objective. Confirm command
  availability in the actual surface/version. Older IDE Planning/Fast and
  ordinary headless `agy -p` do not establish the same Goal contract.
- **Verify/control:** inspect the actual trajectory and outcomes; CLI Ctrl+O
  expands it, Esc/ Ctrl+C stop ordinary execution. Goal-specific status/clear/
  pause/resume tools, budgets, and restart guarantees were not established;
  use current-host discovery rather than guessing them.
- **Limits:** permission Ask/Deny rules still apply. Remote Control, OS service,
  worktree mode, scheduling, and teamwork are separate actions, not required
  Goal dependencies or permission to move execution elsewhere.
- **Sources:** [slash commands](https://antigravity.google/docs/slash-commands/),
  [CLI reference](https://antigravity.google/docs/cli/reference/),
  [headless](https://antigravity.google/docs/cli/headless/).

## Sourcegraph Amp

- **Identify:** `amp`, `sourcegraph-amp`; local CLI and remote Orbs differ.
- **Observed entry:** `amp` or local `amp -x "<task>"`; execute mode explicitly
  waits for one agent turn and exits. A persistent Goal/automatic post-turn
  continuation contract is unverified; investigate current help first.
- **Verify/control:** transcript and thread identity, double Esc to interrupt,
  existing thread continuation/history. Do not invent `amp goal` or Goal enums.
- **Other surface:** `-ox` starts remote Orb work and can return while it runs;
  thread links/streaming prove that cloud turn, not a Goal evaluator. Orb sleep,
  credits, remote files, Sync/Ship, and tool permissions have separate effects.
  Do not create an Orb or permission plugin as an automatic fallback.
- **Sources:** [execute mode](https://ampcode.com/docs/markdown/cli/execute-mode),
  [Orbs](https://ampcode.com/docs/markdown/cli/spawning-orbs),
  [threads](https://ampcode.com/docs/markdown/threads).

## Block Goose

- **Identify:** `goose`; the official project now points to `aaif-goose/goose`.
- **Observed entry:** `goose run -t "<task>"`; `-s` retains interactive chat
  afterward, not automatic Goal work. Native persistent Goal is unverified.
- **Verify/control:** streamed results and exact saved session; named run and
  resume restore history, Ctrl+C cancels execution. `--no-session` loses that
  recovery. Recipes/scheduler/server are separately chosen mechanisms.
- **Limits:** `--max-turns` and repeated-tool limits govern its tool loop, not
  repair cycles. Auto/Approve/SmartApprove/Chat are permission modes. Headless
  approval requirements can fail rather than silently become auto-allowed.
- **Sources:** [task runs](https://github.com/aaif-goose/goose/blob/4617040c7b650b37d599bdaa08d3790572c19ae8/documentation/docs/guides/running-tasks.md),
  [CLI controls](https://github.com/aaif-goose/goose/blob/4617040c7b650b37d599bdaa08d3790572c19ae8/documentation/docs/guides/goose-cli-commands.md).

## Zed Agent

- **Identify:** `zed`; distinguish first-party Zed Agent from an external ACP
  harness. Check both ends of that bridge before selecting a profile.
- **Observed entry:** command palette `agent: new thread`, choose Zed Agent,
  submit the task. Built-in persistent Goal/auto-post-turn work is unverified.
- **Verify/control:** Agent Panel progress/Stop; queues contain actual user
  messages and are not a Goal scheduler. Restoring thread history or creating
  a summary thread does not revive interrupted work. Checkpoint restore changes
  code and is not Goal resume; tool permission rules remain separate.
- **Sources:** [Agent Panel](https://zed.dev/docs/ai/agent-panel),
  [fixed snapshot](https://github.com/zed-industries/zed/blob/93d745668805029476e6d7fbb19652116fed51de/docs/src/ai/agent-panel.md).

## OpenClaw

- **Identify:** `openclaw`, `claw`; built-in runtime versus external/native
  Codex sessions. Durable session Goal state is verified, automatic Goal
  follow-up after an ordinary reply remains unverified in the checked runtime.
- **State/start entry:** `/goal start <objective>`, bare `/goal` or `/goal status`,
  or exposed `create_goal`/`get_goal`. Control UI Goal/Start goal admits initial
  work only for an idle supported local session. Token budgets need explicit
  authorization and actual tool schema, not a guessed command flag.
- **Continuation:** inspected start/resume admission and queued-followup code
  do not prove an active Goal enqueues a new input after every reply. Do not
  announce unattended persistent execution from state or Start success alone;
  run current-host discovery for the actual driver before offering it.
- **Finish/recover:** model updates only complete/blocked; operator pause/resume/
  edit/clear remain operator controls. Even a completed existing goal needs
  explicit clear before another start. State survives restart, not necessarily
  worker execution; `/stop` interrupts a turn whereas pause/clear are state
  controls. Heartbeats, standing orders, cron, and Gateway service are different
  mechanisms and must not be enabled to fake missing Goal continuation.
- **Sources:** [Goal](https://docs.openclaw.ai/tools/goal.md),
  [start admission](https://github.com/openclaw/openclaw/blob/2bb3dac0102688d6a8401fa15443baf7bdd21fc5/src/auto-reply/reply/commands-goal.ts),
  [follow-up queue](https://github.com/openclaw/openclaw/blob/2bb3dac0102688d6a8401fa15443baf7bdd21fc5/src/auto-reply/reply/queue/drain.ts).

## Warp Agent

- **Identify:** Warp app/`warp` CLI versus legacy `oz` and cloud Automation
  Platform. A distinct persistent Goal is unverified.
- **Observed entry:** submit a task in `warp`; Run until completion/auto-approve
  grants autonomy within that task and changes permissions, not a Goal
  scheduler. Do not enable `/auto-approve` or its flag as a Goal default.
- **Verify/control:** transcript/session ID, Ctrl+C, exact conversation-token
  resume. `/handoff` forks/uploads work to cloud; it requires a separate choice.
  Cloud run status/cancel/followups have their own contract and terminal states;
  a successful cloud run is not proof of current-session Goal activation.
- **Sources:** [CLI reference collection](https://docs.warp.dev/_llms-txt/warp-agent-cli.txt),
  [agent modes](https://docs.warp.dev/_llms-txt/agents.txt).

## Aider

- **Observed entry:** `aider` or single-task `aider --message "<task>" <files>`;
  lint/test reflection is verified but persistent Goal is unverified.
- **Verify/control:** real diff/test outputs; Ctrl+C interrupts, chat-history
  restore needs another user input. Native reflection caps and API/history
  limits are not this workflow's three repair cycles. Do not invent `/goal` or
  promote external scripts/Ralph supervisors to an installed native feature.
- **Commit prerequisite:** Aider defaults to automatic Git commits. Verify
  that the current host can honor the chosen commit policy before offering
  no-commit execution. Documented no-auto/no-dirty-commit settings exist, but
  do not silently launch/reconfigure Aider; resolve any required host action
  before work. A textual no-commit promise cannot override host auto-commit.
- **Sources:** [scripting](https://aider.chat/docs/scripting.html),
  [lint/test](https://aider.chat/docs/usage/lint-test.html),
  [fixed args](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/args.py).

## Continue

- **Identify:** `cn` CLI, VS Code extension, JetBrains plugin. The checked
  official repository is read-only/unmaintained (final release 2.0.0).
- **Observed entry:** `cn` or print-and-exit `cn -p "<task>"`; native persistent
  Goal is unverified. Resume/session lists restore history, not guaranteed work.
- **Limits:** all-tools `--auto`, serve mode, compaction and external plugins
  do not establish a persistent target. Reconcile old CLI README entries with
  current code/help; do not invent a Goal flag or create a server implicitly.
- **Sources:** [official README](https://github.com/continuedev/continue),
  [fixed CLI](https://github.com/continuedev/continue/blob/5522c6f44ca0ac3528b37244818fbfa39b5af470/extensions/cli/src/index.ts).

## Hermes Agent

- **Identify:** Nous Research Hermes CLI/TUI/Desktop/dashboard/Gateway; ACP
  did not advertise this Goal handler in the checked implementation.
- **Start/control:** user `/goal <objective>`, `/goal` or `/goal status`,
  `/goal pause`, `/goal resume`, `/goal clear`. Use `/goal -- <objective>` to
  preserve leading control words; do not borrow OpenClaw's `start` grammar.
  A generic model-side create/get/update API was not established.
- **Verify/finish:** `goal_judge` evaluates after each turn and enqueues a real
  same-session continuation. Supply acceptance evidence, end the turn for
  judge completion, and keep native completion pending until observed. Chat
  judge blocked pauses the Goal; do not borrow another host's blocker threshold.
- **Resume/limits:** native Goal max turns and per-turn CLI tool limits differ.
  Resume resets its native counter, not the workflow repair ledger. Pause/clear
  control state without stopping a running turn; Ctrl+C or Gateway `/stop`
  interrupts it. Saved Goal metadata alone does not mean a dead process runs.
  Quality-gate shell commands and Kanban Goal workers are optional separate
  actions, never automatically registered/created by chat Goal selection.
- **Sources:** [Persistent Goals](https://hermes-agent.nousresearch.com/docs/user-guide/features/goals),
  [fixed Goals](https://github.com/NousResearch/hermes-agent/blob/71d34bad1045610252eda02ee79549436896e784/website/docs/user-guide/features/goals.md),
  [Kanban boundary](https://github.com/NousResearch/hermes-agent/blob/71d34bad1045610252eda02ee79549436896e784/website/docs/user-guide/features/kanban.md).

## OpenHands

- **Capability:** official CLI Critic Iterative Refinement provides a bounded
  post-FinishAction loop conditionally for its supported provider. It is
  disabled by default; not an established universal `/goal` command.
- **User entry:** existing CLI Ctrl+P -> Settings -> Critic Settings -> enable
  Iterative Refinement, then submit the finished target. Enabling this setting
  is an explicit prerequisite, not an automatic skill mutation.
- **Verify/control:** real `Refining n/N` and results; its own refinement cap,
  thresholds, Esc pause, session restore, and approval limits remain separate.
  Reaching a cap or a success probability does not prove spec acceptance.
- **Other surface:** headless can imply always-approve; cloud creates a separate
  session/environment. Neither is automatically selected to avoid current
  permission prompts or provide a missing current-session loop.
- **Sources:** [Critic](https://docs.openhands.dev/openhands/usage/cli/critic.md),
  [fixed refinement controller](https://github.com/OpenHands/OpenHands-CLI/blob/0403f1a79a9fc62a6c7be21c17d7b51f64245ad2/openhands_cli/tui/core/refinement_controller.py).

## Devin

- **Identify:** local CLI versus Devin Cloud. Local `/loop <prompt>` is a
  documented review loop requiring clean Git state. Its full stop/cap/resume
  contract was not established; research current help before offering it.
- **Start prerequisite:** submit the ready target in the existing local loop
  surface only after required branch/dirty-state handling. Do not stash, clean,
  or commit merely to satisfy the prerequisite. `devin -p` is single-turn.
- **Other surface:** cloud UI or `--cloud` uses a remote session and can outlive
  the terminal; not an implicit replacement for local execution. Read status
  plus status detail, not merely a running VM. Archive/sleep can be resumed;
  termination cannot. Do not copy legacy API paths into newer contracts.
- **Limits:** permission modes, sandbox, ACU caps and environment persistence
  are separate; do not enable Bypass/Autonomous or create cloud work implicitly.
- **Sources:** [local commands](https://docs.devin.ai/cli/essential-commands.md),
  [cloud CLI](https://docs.devin.ai/cli/cloud.md).

## TRAE

- **Identify:** current IDE, SOLO, Agent window, and local/worktree/cloud surfaces.
- **Observed entry:** select the actual Agent with `@`, submit the ready target
  and approve its plan; SOLO is a product/mode switch, not proven `/goal`.
  Planning/task execution is verified; independent completion-driven
  continuation is unverified. Do not guess a SOLO Goal command from a slogan.
- **Verify/control:** inspect the current task/panel and results. Multitasking,
  queued work, automated tasks, and cloud storage have different lifecycles;
  version-specific controls need current-host discovery. Auto Run and security
  settings do not authorize unattended Goal scheduling or remote handoff.
- **Sources:** [SOLO overview](https://docs.trae.ai/ide/solo-mode),
  [built-in Agent](https://docs.trae.ai/ide/built-in-agent),
  [Agent window](https://docs.trae.ai/ide/get-started-with-the-agent-window).

## Replit Agent

- **Capability/entry:** Web main-thread planning -> View plan -> Accept tasks
  starts native background tasks in isolated project copies. This is a real
  queue, not proof of an endless Goal loop in the current main thread.
- **Verify:** task threads and board distinguish Queued/Active/Ready/Applying/
  Done. Ready means review is needed; Done can also mean dismissal/cancellation.
  Inspect actual evidence, then user Apply changes to main version or Dismiss.
  Do not report the main spec implemented just because a copy is ready.
- **Control/limits:** cancelling building work discards it and cannot resume;
  an archived draft can resume. Plan/credit/concurrency limits remain separate.
  Task creation, application, routines and budget increases are distinct actions
  and are not implicit consequences of choosing current-session Goal.
- **Sources:** [task system](https://docs.replit.com/core-concepts/agent/task-system.md),
  [task lifecycle](https://docs.replit.com/features/agent/task-lifecycle.md).

## Factory Droid

- **Capability/entry:** native Missions via `/missions` (alias `/mission`), or
  existing Factory App Mission Control. Prepare and approve the mission plan
  from the finished spec before dispatch; ordinary `droid exec` is single-shot.
- **Prerequisites:** Missions require an allowed High autonomy level (or a
  separate unsafe mode). Do not raise permissions or choose unsafe mode to make
  Goal work. If the current policy cannot support Missions, report it during
  readiness and offer only an accurately supported alternative after discovery.
- **Verify/control:** mission/worker/validation evidence and exact identity;
  use actual App pause/history/resume controls, not guessed `/mission cancel`.
  Missions are explicitly not fire-and-forget; unresolved features or a retry
  cap do not prove completion. Workers can produce commits: verify consistency
  with the selected commit policy before starting.
- **Other surface:** Droid Computer uses persistent remote machines and needs
  a separate location/scope choice; local execution still depends on the host.
- **Sources:** [Missions](https://docs.factory.com/missions/overview.md),
  [reference](https://docs.factory.com/missions/reference.md),
  [CLI](https://docs.factory.com/missions/running-cli.md),
  [autonomy](https://docs.factory.com/autonomy-and-safety/auto-run.md).

## JetBrains Junie

- **Start:** IDE AI Chat -> Junie -> Goal mode -> configure/submit target;
  CLI interactive `/goal <message>`. Native Goal is verified but unavailable
  with Junie Lite; do not invent `junie --goal` or silently switch models.
- **Bridge/setup:** ACP V2 needs a compatible model and form-capable frontend.
  Native setup/Goal-owned plan review can precede dispatch; keep waiting state
  until that technical activation actually finishes, using the ready spec
  rather than reopening product discovery.
- **Verify/control:** read progress, transcript and exact session. TUI
  `/goal stop` leaves orchestrated mode; ACP uses `/goal close`, not the same
  command. Step limits/permissions may require user intervention. Normal history
  resume does not prove every surface restores Goal context/budget.
- **Other surface:** remote mode mirrors a still-running local CLI; closing the
  share does not stop the task or move it into cloud. Headless/trusted config,
  Brave and sandbox modes are not automatic Goal prerequisites.
- **Sources:** [IDE Junie](https://www.jetbrains.com/help/ai-assistant/junie-agent.html),
  [commands/ACP](https://junie.jetbrains.com/docs/slash-commands.html),
  [parameters](https://junie.jetbrains.com/docs/parameters.html).

## Amazon Q Developer

- **Identify:** Q Developer IDE and GitHub integration versus the CLI that
  officially migrated to Kiro. Do not attribute Kiro's Goal to all Q surfaces.
- **Observed IDE entry:** Q chat with `</>` agentic coding enabled, submit
  target/scope/acceptance; multistep work is verified, persistent Goal is
  unverified. Old `/dev`-style names are not assumed current universal commands.
- **Verify/control:** current chat actions/diff, actual Stop generation control,
  permissions and same-chat followups. Tabs, history, `/clear` and compaction do
  not establish a paused/resumable Goal. Investigate the installed surface.
- **Other surface:** the preview GitHub integration's issue label or `/q dev`
  launches external work and PR/comment/commit effects. It is not an IDE Goal
  command or permission to install the app, label an issue, or send comments.
- **Sources:** [CLI migration](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/command-line.html),
  [IDE chat](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/q-in-IDE-chat.md),
  [GitHub development](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/github-feature-development.md).

## Future Or Changed Agents

Do not stop at this inventory or advertise unsupported products as permanently
incapable. Run `runtime-discovery.md` for the actual current product, surface,
version, frontend/harness and tools; save its findings in this requirement's
research directory. Use a verified corrected entry under the same authorization
only when its scope/backend/limits/side effects match. Otherwise obtain the
appropriate new choice, and never silently downgrade or launch elsewhere.
