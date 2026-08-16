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

SpecWorkflow 的第一步不是写 spec，而是判断这件事值不值得进入 spec。很多请求本来就很小，比如改一段文案、调一个样式、补一个明显遗漏的判断；这类工作应该直接完成。

只有当需求开始牵涉产品含义、数据语义、权限边界、跨模块影响、发布风险，或者“做错了会很难收拾”时，才进入完整流程。同一件事产生的材料都放在同一个 `.spec-workflow/<feature-slug>/` 目录下，后续每一轮都能接得上。

```text
to-grill -> to-spec -> spec-do -> do-review -> fix-review -> spec-do repair -> do-review
```

`to-grill` 负责把模糊需求压实。它不是机械提问，也不是把仓库里能查到的事实甩给用户确认；它会先自己读上下文、找现有实现、识别真正需要用户拍板的地方。到这一阶段结束时，应该已经知道这件事是直接改、暂缓、还是进入 spec，并留下可以交给下一步使用的需求结论。

`to-spec` 把结论变成实施契约。好的 spec 不只是“要做什么”，还要写清楚不做什么、哪些模块会受影响、数据和权限怎么处理、用户最终会看到什么、验收时看哪些证据。如果是在已有 spec 上做调整，它会记录修订和影响范围，而不是把历史上下文抹掉重写一份。

到 `spec-do` 才真正动代码。实施前先处理 git 分支、脏工作区和是否允许自动提交；实施时按已批准的 spec、tickets、修订或修复计划推进。临时证据、调试脚本、截图和运行记录可以放进 `.spec-workflow`，但长期存在的测试必须回到项目自己的测试目录。这里有一条硬规则：业务逻辑要真实接上，不能为了让验证变绿而 mock 掉系统本身。

实现完成后，`do-review` 接手判断能不能交付。它会把原始需求、spec、代码 diff、测试和证据放在一起看，找遗漏、回归、边界和验收缺口。review 不是顺手修代码的阶段，也不应该暗中扩大范围；它只负责给出清楚的 ship / no-ship 判断。

如果 review 发现必须修的问题，`fix-review` 会把这些 finding 收束成修复计划。它关心根因、优先级、验证方式和是否需要拆 ticket，然后把修复计划交回 `spec-do`。修完以后再回到 `do-review`，形成一个很短的闭环；直到结果可以交付，或者下一步确实需要用户做决定。

`deep-research` 和 `bugs-fix` 不属于主链上的固定阶段，更像两条随时可以插入的支线。遇到外部事实、官方文档、API 行为、标准差异时，先用 `deep-research` 把依据找齐；如果起点不是新需求，而是失败、回归、异常或性能问题，就直接走 `bugs-fix`，先复现和定位根因。

Goal Mode 是给单个 spec 用的连续执行开关。用户明确启用后，Agent 可以从实施一路跑到 review、修复规划、修复实施和再次 review，不必每个交接点都停下来等确认。但它不是无限授权；遇到产品选择、安全风险、git 决策、验证缺口、环境问题或 scope 变化时，仍然要停下来。

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
