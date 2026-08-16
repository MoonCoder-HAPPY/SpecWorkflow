# SpecWorkflow

[English](README.md) | 中文

SpecWorkflow 是一套可分享的 workflow skill pack，面向 DeepSeek Harness 和其它兼容 Agent Skills 的工具。它给 Agent 一条清晰路径：从粗糙需求开始，推进到需求澄清、实施规格、代码执行、交付检查、修复规划、bug 诊断和带来源的调研。

它不会把每个请求都拖进重流程。简单明确的修改可以直接处理；需求模糊、跨模块、影响产品体验、数据、权限、接口或发布风险的工作，才进入完整 workflow。

![SpecWorkflow Architecture](assets/workflow-architecture.png)

## 功能

| 阶段 | Skill | 处理内容 |
| --- | --- | --- |
| 调研 | `deep-research` | 基于官方文档、API、标准、源码等一手来源做调研。 |
| 1 | `to-grill` | 需求质询、消除歧义、风险审查，并判断直接实施还是进入完整流程。 |
| 2 | `to-spec` | 编写可实施 spec、修订说明、验收标准、验证计划和可选 tickets。 |
| 3 | `spec-do` | 根据已批准的 spec、issue、修订或修复计划进行实施。 |
| 4 | `do-review` | 对照需求、spec、代码和证据做最终交付检查。 |
| 5 | `fix-review` | 把 must-fix review findings 转成修复 spec 和修复 tickets。 |
| 调试 | `bugs-fix` | 针对 bug、回归和性能问题做复现、根因定位、修复和证据留存。 |

## 安装

### DSH

```sh
dsh plugin --profile web add specworkflow
dsh web
```

### 其它 Agent

```sh
npx specworkflow install codex
```

使用 `-g` 安装到全局目录：

```sh
npx specworkflow install -g codex
```

需要时把 `codex` 换成其它预设：

| 输入 | 项目安装位置 | `-g` 全局安装位置 |
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

未识别的纯名称会直接报错，避免因为拼错而创建错误目录。如果当前工具不在预设里，请传入明确的项目级 skills 路径：

```sh
npx specworkflow install .my-agent/skills
```

带 `-g` 时，相对显式路径会从用户 home 目录解析。

## 快速开始

典型功能开发：

```text
使用 to-grill 澄清这个需求，需求收口后再进入 to-spec。
```

简单修改保持简单：

```text
把表格字体调大一点。
```

这类请求应该直接实施，不应该强行进入五阶段流程。

## 工作流

这一节不是让每个需求都走一遍流程，而是告诉 Agent 怎么判断路线：先看手上的请求到底需要多少结构，再把同一件事的产物放到同一个 `.spec-workflow/<feature-slug>/` 目录下。

```text
to-grill -> to-spec -> spec-do -> do-review -> fix-review -> spec-do repair -> do-review
```

请求里还有产品、数据、权限、交互或风险问题时，用 `to-grill`。它不应该把能从仓库里查到的问题甩给用户；它要做的是判断这件事能不能直接改，还是需要进入正式 spec。进入下一步前，留下简短的需求结论。

需求已经稳定到“另一个 Agent 不用猜也能做”时，用 `to-spec`。spec 里要写清范围、非目标、数据和权限、用户看到的行为，以及怎么验收。如果是在改已有 spec，就写修订和影响，不要假装这是一个全新的功能。

真正写代码时，用 `spec-do`。它先处理分支、脏工作区和是否自动提交，再按已批准的 spec 或修复计划实施。临时证据可以放进 `.spec-workflow`，但项目长期测试要放回项目自己的测试目录。业务逻辑要真实接上，不能为了过测试随手 mock。

实现说自己完成后，用 `do-review`。这一轮就是严格检查：拿原始需求、spec、代码、测试和证据对照，判断能不能交付、是否需要修复，或者是否必须停下来让用户决定。review 不负责偷偷扩大范围，也不边审边改。

确实需要再修一轮时，用 `fix-review`。它把 must-fix finding 变成聚焦的修复计划，再交回 `spec-do`。修完以后再回到 `do-review`，直到可以交付，或者下一步真的需要用户拍板。

`deep-research` 和 `bugs-fix` 不在主链上，但经常会插进来。判断依赖外部事实或一手资料时，用 `deep-research`；起点是失败、回归或性能问题时，用 `bugs-fix`。

Goal Mode 是单个 spec 的便利开关。用户启用后，Agent 可以连续跑实施、review、修复规划、修复实施和再次 review，不必每个交接点都停下来问。遇到产品选择、安全风险、git 决策、验证缺口、环境问题或 scope 变化时，仍然要停。

## 目录产出

SpecWorkflow 把 workflow 文件放在 `.spec-workflow` 下，避免把项目代码和 Agent 证据混在一起。

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

项目长期测试仍然放在项目原本的测试目录，不放进 `.spec-workflow`。

## 验证

安装到 DSH 后运行：

```sh
dsh --profile web --dump-config
```

组合配置里应该出现：

```text
# == specworkflow
- id: specworkflow
  name: specworkflow
```

也可以直接询问 Agent 当前有哪些 SpecWorkflow skills，以及什么时候使用 `to-grill`。

## 卸载

```sh
dsh plugin --profile web remove specworkflow
```

把 `web` 换成你实际安装的 profile。

## 许可证

MIT. See [LICENSE](LICENSE).
