# SpecWorkflow

[English](README.md) | 中文

SpecWorkflow 是一组项目级 Agent skills，用来把模糊需求推进到可执行 spec、代码实施、交付检查和修复闭环。它不强迫所有需求走重流程；简单明确的改动会直接处理。

## Skills

| Skill | 作用 | 主要产物 |
| --- | --- | --- |
| `to-grill` | 澄清需求，并判断是否需要完整流程。 | `requirements.md` 或直接实施决策 |
| `to-spec` | 把已收口的需求整理成可实施 spec。 | `spec.md`、`issues/`、`amendments/` |
| `spec-do` | 根据 spec、ticket 或 repair plan 实施。 | 实施记录和验证证据 |
| `do-review` | 检查当前工作是否可以交付。 | 可交付、需修复或暂停决策 |
| `fix-review` | 把 review findings 整理成修复计划。 | `repair-spec.md`、`repair-issues/` |
| `bugs-fix` | 诊断并修复 bug 或回归问题。 | 诊断报告和修复证据 |
| `deep-research` | 为决策保存带来源的调研结论。 | `.spec-workflow` 下的 research 记录 |

## 目录结构

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

每个目录都是一个独立 skill，包含自己的 `SKILL.md`。

## 工作流

![SpecWorkflow Architecture](assets/workflow-architecture.png)

读图时按从左到右理解。中间是完整 spec 流程，上方是简单需求的直接实施分支，下方是 review 后的修复闭环。

```text
to-grill -> to-spec -> spec-do -> do-review -> fix-review -> spec-do repair -> do-review
```

`to-grill` 是入口。它先读用户需求、仓库上下文和已知约束，判断这件事是否值得进入完整流程。字体变大、改一句文案、调一个明显配置这类低风险事项，应该直接实施；需求模糊、跨模块、影响业务规则、数据、权限、接口或用户流程时，才进入正式流程。进入后，它会把需求探索结论写到 `.spec-workflow/<feature-slug>/requirements.md`。

`to-spec` 接住需求结论，把它整理成可实施的规格。它会补齐目标、范围、非目标、数据语义、权限、交互、验收标准、风险和验证方式；如果是在调整既有 spec，则先分析改动影响，再写入 `spec.md`、`amendments/`，必要时拆出 `issues/`。

`spec-do` 负责实施。它读取 `spec.md`、`issues/` 或修复计划，按用户选择决定串行执行还是使用内部 subagent 并行执行。实施前会处理分支、脏工作区和是否自动提交的选择；实施中不 mock 系统业务逻辑，代码、迁移、测试、验证证据和实施报告都围绕当前 spec 落到 `.spec-workflow/<feature-slug>/`。

`do-review` 是交付检查，不继续扩大 scope，也不直接改代码。它对照原始需求、spec、代码改动、实施报告、测试和证据，判断结果是可以交付、需要修复，还是必须暂停。只要存在 must-fix 问题，就进入 `fix-review`。

`fix-review` 把 must-fix findings 转成修复规格。它会判断哪些问题必须修、哪些需要延期或重新澄清，然后写入 `repair-spec.md`，必要时拆成 `repair-issues/`。修复计划完成后，流程回到 `spec-do` 做修复实施，再回到 `do-review` 做第二轮检查，直到可交付或需要人工决策。

`bugs-fix` 和 `deep-research` 是支线。失败、回归、性能异常先走 `bugs-fix`，它专注复现、定位根因、验证修复；需要外部事实、官方文档、API 行为或来源支撑时走 `deep-research`，调研结果保存到当前 `.spec-workflow` 目录，供需求、规格或直接决策使用。

Goal Mode 只对当前 spec 生效，且必须由用户显式选择。启用后，Agent 可以自动串联实施、review、修复规划、修复实施和再次 review；遇到目标完成、修复预算耗尽，或产品、安全、git、验证、环境、scope 决策时停止。

## 快速开始

把这段交给你的 Agent

```text
把 https://github.com/MoonCoder-HAPPY/SpecWorkflow 的 skill-package/* 安装到当前 Agent 工具可识别的项目级 skills 目录中。保持目录名不变。
```

如果只想在当前项目使用 SpecWorkflow，就安装到项目级目录。只有明确想让所有项目都能使用时，才安装到全局 skills 目录。

## 目录产出

SpecWorkflow 把工作文件放在 `.spec-workflow` 下，避免把临时证据和项目代码混在一起。

| 目录 | 常见内容 |
| --- | --- |
| `.spec-workflow/<feature-slug>/` | `requirements.md`、`spec.md`、issues、amendments、实施记录、review 报告、repair plan |
| `.spec-workflow/<feature-slug>/verification/` | 命令日志、截图、trace、payload 捕获、一次性 harness |
| `.spec-workflow/<feature-slug>/debug/` | 临时 debug helper 和排查记录 |
| `.spec-workflow/<feature-slug>/bugs/` | bug 诊断报告和对应验证证据 |
| `.spec-workflow/<feature-slug>/research/` | 带来源的调研记录 |

项目长期测试仍然放在项目原本的测试目录，不放进 `.spec-workflow`。

## 最佳实践

遇到资料不清、外部 API 不确定、框架行为需要确认时，先用 `deep-research` 做调研，把来源和结论存到 `.spec-workflow/<feature-slug>/research/`。

进入开发时，再按五步主流程推进：`to-grill -> to-spec -> spec-do -> do-review -> fix-review`。这样需求、规格、实施、验收和修复会围绕同一个 feature 目录沉淀。

上线前后出现失败、回归或性能异常时，用 `bugs-fix` 单独诊断。若 bug 暴露出新需求或范围变化，再回到 `to-grill` 或 `to-spec`。

## License

MIT. See `LICENSE`.
