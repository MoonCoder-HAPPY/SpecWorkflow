# Bilingual Presentation And Handoffs

Use this reference before user-facing questions/progress, writing workflow
artifacts, or reading another stage's decisions. Each skill carries a complete
copy. Instructions may remain English; ordinary output uses the user's
language, and workflow readers recognize both English and Chinese records.

## Choose The Output Language

- Resolve language per output object, preserving the scope of explicit user
  instructions. "Write the report in English" changes that report's headings
  and prose, not ordinary questions/progress in a Chinese conversation.
  "Use English for all output" changes all those objects. Preserve the chosen
  scope until the user changes it; a later short confirmation or stock prompt
  does not cancel it. For objects without an explicit override, use the latest
  substantive human request's language, then the established conversation
  language for a command/short confirmation.
- Skill identifiers, pasted code/docs, tool output, product names, and stock
  bilingual `agents/openai.yaml` prompts do not by themselves change the user's
  language. Do not ask the user to choose a language when context establishes it.
- Use Chinese for a Chinese user and English for an English user. Do not print
  both versions of every sentence, heading, or status unless requested. Follow
  the user's Chinese script when established; recognize equivalent traditional
  Chinese labels by context without changing canonical values.
- Translate ordinary workflow terms, choices/reasons, progress, artifact prose,
  headings and conclusions. For vocabulary outside the tables, use plain
  natural language rather than falling back to an unexplained English label.
- Preserve code/programming identifiers, API/tool arguments and returned enum
  values, shell commands/options, actual filenames/folders/paths, IDs, version
  refs, URLs, and literal evidence. Programming terms may stay English when
  useful. Explain a real UI control using its actual label when needed to find
  it; do not rename that control or alter a user-required verbatim string.

The static skill-menu fields in `agents/openai.yaml` have one string per field,
not a locale selector. They use paired bilingual labels/descriptions as a
fallback. Do not invent localization keys or claim those static fields switch
automatically. Their bilingual starter text is not a request for bilingual
reports; dynamic output still follows the human language above.

## Delegation And Recovery

Before dispatching an implementation, review or research child, include the
resolved language policy for its requested outputs: conversation/progress,
report/artifact and any explicit per-object override. Also provide the absolute
path to this skill's local reference, or the needed self-contained rules if the
child cannot read that path. State that real identifiers, commands/API values,
paths and literal evidence stay unchanged. Do not depend on a child inheriting
the human conversation or inferring language from English task instructions.

Use the same policy for replacement children and continuation/stall-recovery
messages; do not re-detect it from the spelling of the latest request. A
continuation must preserve the assigned artifact language and existing paths,
progress and completed work. Use the resolved conversation/progress language
for its ordinary instructions; if all output was explicitly switched to
English, keep those instructions English too. Language samples in a skill are
examples, not mandatory literal recovery text. Main-agent aggregation follows
the same object-specific policy while preserving child evidence verbatim.

## Write Human Labels, Preserve Program Contracts

Use the localized human label and display value in prose/artifacts. English
labels elsewhere in a SKILL or template describe semantic fields, not mandatory
English wording. This reference takes precedence over such display examples;
the workflow gates, scope and authorization rules still apply unchanged.

If an existing tracker/parser needs literal machine keys/codes, retain them in
its structured metadata or real API payload, with localized explanations in
the human report. Do not send translated enum values to an API, rename actual
machine fields, or add a new parser schema just to translate a heading.

For ordinary human records either of these represents the same review result:

```text
Completion status: complete
Ship Decision: can ship
```

```text
完成状态：完成
交付结论：可以交付
```

These words alone are not proof of completion. The review must still establish
acceptance evidence, no must-fix findings, and the required Goal/ship conditions.

## Read And Normalize Before Making Decisions

1. Establish the artifact type, current spec/version and authoritative source
   first. Keep existing source/version/amendment precedence. Historical reports,
   quoted examples and old snapshots are not current authorization records.
2. Recognize both localized field headings and legacy English labels, including
   ASCII/full-width colons, Markdown headings, lists/tables and existing metadata.
   Read the actual records; an English-only `rg` result is not an absence proof.
3. Normalize a value **within its field/domain** using the tables below. For
   example, ticket `已完成` means `done`; Goal execution `已完成` means
   `completed`; review `完成` means `complete`. Do not globally replace strings
   or infer state from an unrelated sentence containing "done"/"完成".
4. Equivalent duplicate English/Chinese records can be read together. Conflicting
   current values are a real mismatch: preserve the evidence, stop the affected
   automatic branch, and follow its existing clarification gate. English is not
   inherently more authoritative than Chinese; neither language can override a
   current tracker, a newer amendment, or a live host state.
5. Unknown/ambiguous critical fields or values stay unresolved. Do not turn
   approximate wording into execution/commit permission, a ready ticket, or ship
   approval. Inspect the authoritative source first; ask only for a genuinely
   unresolved decision under that stage's existing rules.

Do not rewrite old artifacts merely to change language. Preserve paths, IDs,
scope, approval evidence, ownership, exact commands, and repair counts. Language
normalization does not amend a spec, reopen a ticket, authorize/rearm a goal,
reset a budget, or prove activation. If an actual recorded amendment is made,
the existing fresh per-version Goal choice still applies.

## Workflow Vocabulary

| English concept/display | Chinese display |
| --- | --- |
| Goal Mode / Goal | 目标模式 / 目标 |
| Requirement clarification | 需求澄清 |
| To Grill / To Spec / Spec Do | 需求澄清 / 需求规格 / 实施需求 |
| Do Review / Fix Review / Bugs Fix / Deep Research | 交付审查 / 修复规划 / 问题诊断 / 深度调研 |
| Specification / spec | 需求规格 |
| Ticket / issue | 任务单 / 问题单 |
| Implementation | 实施 |
| Delivery review | 交付审查 |
| Repair planning / repair spec | 修复规划 / 修复规格 |
| Bug diagnosis / deep research | 问题诊断 / 深度调研 |
| Workflow / stage handoff | 工作流 / 阶段交接 |
| Amendment / scope / non-goals | 规格修订 / 范围 / 不做的内容 |
| Findings / must-fix findings | 发现的问题 / 必须修复的问题 |
| Blocker / accepted risk | 阻断原因 / 已接受的风险 |
| Auto-commit / validation | 自动提交 / 验证 |
| Recommended / custom / pause | 推荐 / 自定义 / 暂停 |
| Frontier | 当前可执行任务集合 |
| Testing seams | 测试接口或验证边界 |
| Fixed point | 审查基准版本 |
| Standards axis | 规范检查 |
| Spec axis | 需求符合性检查 |
| Scope axis | 范围检查 |
| Tracer-bullet / vertical slice | 可验证的端到端小任务 / 完整的小功能 |
| Prefactoring / integration check | 实施前必要的重构 / 集成检查 |
| Smell baseline / red-green | 代码问题检查清单 / 测试先失败再通过 |
| Local serial implementation / internal subagents | 本地串行实施 / 内部子代理 |
| Parallel / serial | 并行 / 串行 |
| Local axis-separated review | 按维度分别审查 |
| Out of scope / follow-up | 本次范围外 / 后续事项 |
| No spec available | 无可用需求来源 |
| Not applicable / passed / failed | 不适用 / 通过 / 未通过 |

Programming acronyms such as API, SDK, CLI, IDE, DAG, ADR, TDD and E2E may remain
unchanged. Translate accompanying ordinary labels and explanations.

## Field Labels And Section Aliases

The canonical field names identify existing concepts; they are not a new
mandatory serialized schema. Read the corresponding Chinese or English label.

| English/legacy label | Chinese label |
| --- | --- |
| Background / problem statement | 背景 / 问题说明 |
| Goal / non-goals / user flow | 目标 / 不做的内容 / 用户流程 |
| Functional scope / acceptance criteria | 功能范围 / 验收标准 |
| Closed questions / open questions | 已确定的问题 / 待确定的问题 |
| Requirements conclusion | 需求澄清结论 |
| Testing plan / testing decisions | 测试计划 / 测试决策 |
| Title / what it delivers | 标题 / 交付结果 |
| Dependencies / blocked by | 依赖关系 / 前置阻断事项 |
| Status / ticket status | 状态 / 任务状态 |
| Input context for spec-do | spec-do 输入上下文 |
| Authority | 权威来源 |
| Local Goal Mode cache | 本地目标模式缓存 |
| Git entry / auto-commit allowed | Git 初始状态 / 是否允许自动提交 |
| Auto-commit | 自动提交 |
| Goal mode / goal target | 目标模式 / 完成目标 |
| Spec ID / version / amendment ID | 规格标识 / 版本 / 修订标识 |
| Artifact root / execution backend | 产物根目录 / 执行方式 |
| Decision source / decision date | 决策来源 / 决策日期 |
| Authorization anchor | 授权标识 |
| Supersedes / superseded by | 替代前项 / 被后项替代 |
| Maximum automatic repair cycles | 自动修复次数上限 |
| Required validation / environment | 必需验证 / 验证环境 |
| Pause conditions / pause reason | 暂停条件 / 暂停原因 |
| Execution state / next automatic stage | 执行状态 / 下一自动阶段 |
| Capability status / safe next action | 能力核实状态 / 下一安全操作 |
| Coordination structure / validation results | 协作方式 / 验证结果 |
| Reserved cycle / completed cycles / remaining budget | 已预留轮次 / 已完成轮次 / 剩余次数 |
| Reserved cycle ID / remaining repair cycle budget | 预留轮次标识 / 剩余修复次数 |
| Completion status | 完成状态 |
| Ship Decision | 交付结论 |
| Standards axis findings | 规范检查发现的问题 |
| Spec axis findings | 需求符合性检查发现的问题 |
| Scope axis findings | 范围检查发现的问题 |
| Root cause / repro command / cleanup status | 根因 / 复现命令 / 清理情况 |

## Value Domains

Apply each row only in its stated domain. Canonical codes remain the existing
English values for internal comparisons or actual machine metadata. Human
output uses the display in the chosen language.

| Domain | Canonical English code / English display | Chinese display |
| --- | --- | --- |
| Review classification | complete | 完成 |
| Review classification | mostly complete | 基本完成 |
| Review classification | incomplete | 未完成 |
| Ship decision | can ship | 可以交付 |
| Ship decision | fix before ship | 修复后交付 |
| Ship decision | do not ship | 不可交付 |
| Ticket status | ready-for-agent / ready for execution | 可开始执行 |
| Ticket status | in-progress / in progress | 执行中 |
| Ticket status | done | 已完成 |
| Ticket status | blocked | 被阻断 |
| Ticket status | deferred | 已延期 |
| Ticket status | superseded | 已被替代 |
| Ticket status | cancelled | 已取消 |
| Goal authorization | pending selection | 待选择 |
| Goal authorization | disabled | 未启用 |
| Goal authorization | enabled for this spec only | 仅对当前规格启用 |
| Execution backend | native-goal / native goal execution | 原生目标执行 |
| Execution backend | host-loop / host loop execution | 宿主循环执行 |
| Execution backend | session-only / session-only execution | 仅当前会话执行 |
| Goal execution ledger | awaiting-host-activation | 等待宿主启动 |
| Goal execution ledger | active | 活动中 |
| Goal execution ledger | session-only | 仅当前会话执行 |
| Goal execution ledger | blocked | 被阻断 |
| Goal execution ledger | user-paused | 用户已暂停 |
| Goal execution ledger | activation-failed | 启动失败 |
| Goal execution ledger | completion-pending-host | 等待宿主确认完成 |
| Goal execution ledger | completed | 已完成 |
| Goal execution ledger | stopped | 已停止 |
| Authority | local-spec-workflow | 本地工作流材料为权威来源 |
| Authority | local-spec-workflow-plus-tracker | 本地材料与跟踪器共同记录 |
| Authority | external-tracker-only | 仅外部跟踪器为权威来源 |
| Local cache | non-authoritative | 非权威缓存 |
| Decision source | user-confirmed-in-current-conversation | 用户在当前对话中明确选择 |
| Auto-commit permission | yes / allowed | 允许 |
| Auto-commit permission | no / not allowed | 不允许 |
| Git entry | not a git repo | 不是 Git 仓库 |
| Discovery capability | verified-current | 已核实当前能力 |
| Discovery capability | conditional | 有条件可用 |
| Discovery capability | unverified | 尚未核实 |
| Discovery capability | explicitly-unsupported-by-current-contract | 当前契约明确不支持 |

Do not interpret review `完成` as a ticket reopening, ledger `已完成` as host
completion evidence, or `仅对当前规格启用` as actual activation. Read counters
as the exact recorded integers. A permission field in a runtime/review report
does not grant new authority when the existing stage requires the spec/user.
The current host's real status enums/argument names remain byte-for-byte true
to its tool contract; explain them rather than sending a translated enum.

## Review Smell Names

| English name | Chinese display |
| --- | --- |
| Mysterious Name | 命名含糊 |
| Duplicated Code | 重复代码 |
| Feature Envy | 过度依赖其它模块的数据 |
| Data Clumps | 经常一起出现却未组织的数据 |
| Primitive Obsession | 过度用基础类型表示领域概念 |
| Repeated Switches | 重复的条件分支 |
| Shotgun Surgery | 一项改动需要修改许多位置 |
| Divergent Change | 一个模块因许多不同原因变化 |
| Speculative Generality | 没有实际需要的通用设计 |
| Message Chains | 连续多层访问 |
| Middle Man | 只有转发作用的模块 |
| Refused Bequest | 不符合继承契约的实现 |

These are display names, not changed review criteria. Keep separate review
axes and the original evidence/risk rules. Outside-code prose can use ordinary
Chinese explanations; exact source identifiers/evidence are preserved.
