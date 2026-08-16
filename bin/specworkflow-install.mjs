#!/usr/bin/env node
import { cp, mkdir, readdir, rm } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'skill-package')

const presetGroups = [
  {
    projectTarget: '.agents/skills',
    globalTarget: '.agents/skills',
    aliases: [
      'agent',
      'agents',
      'agent-skills',
      'agents-md',
      'amp',
      'codex',
      'goose',
      'openai',
      'sourcegraph-amp',
      'zed',
    ],
    label: 'codex, goose, zed, amp -> .agents/skills',
  },
  {
    projectTarget: '.github/skills',
    globalTarget: '.github/skills',
    aliases: ['copilot', 'github-copilot', 'vs-code', 'vscode'],
    label: 'copilot, vscode                   -> .github/skills',
  },
  {
    projectTarget: '.cursor/skills',
    globalTarget: '.cursor/skills',
    aliases: ['cursor', 'cursor-agent', 'cursor-native'],
    label: 'cursor                            -> .cursor/skills',
  },
  {
    projectTarget: '.claude/skills',
    globalTarget: '.claude/skills',
    aliases: ['claude', 'claude-code', 'claudecode'],
    label: 'claude, claude-code                 -> .claude/skills',
  },
  {
    projectTarget: '.dsh/skills',
    globalTarget: '.dsh/skills',
    aliases: ['deepseek', 'deepseek-harness', 'dsh'],
    label: 'dsh, deepseek                      -> .dsh/skills',
  },
  {
    projectTarget: '.opencode/skills',
    globalTarget: '.opencode/skills',
    aliases: ['open-code', 'opencode'],
    label: 'opencode                           -> .opencode/skills',
  },
  {
    projectTarget: '.windsurf/skills',
    globalTarget: '.windsurf/skills',
    aliases: ['cascade', 'windsurf'],
    label: 'windsurf, cascade                  -> .windsurf/skills',
  },
  {
    projectTarget: '.cline/skills',
    globalTarget: '.cline/skills',
    aliases: ['claudine', 'cline'],
    label: 'cline, claudine                    -> .cline/skills',
  },
  {
    projectTarget: '.roo/skills',
    globalTarget: '.roo/skills',
    aliases: ['roo', 'roo-code', 'roocode'],
    label: 'roo, roo-code                      -> .roo/skills',
  },
  {
    projectTarget: '.qwen/skills',
    globalTarget: '.qwen/skills',
    aliases: ['qwen', 'qwen-code', 'qwencode'],
    label: 'qwen, qwen-code                    -> .qwen/skills',
  },
  {
    projectTarget: '.kiro/skills',
    globalTarget: '.kiro/skills',
    aliases: ['kiro'],
    label: 'kiro                               -> .kiro/skills',
  },
  {
    projectTarget: '.kilo/skills',
    globalTarget: '.kilo/skills',
    aliases: ['kilo', 'kilo-code', 'kilocode'],
    label: 'kilo, kilo-code                    -> .kilo/skills',
  },
  {
    projectTarget: '.augment/skills',
    globalTarget: '.augment/skills',
    aliases: ['auggie', 'augment', 'augment-code', 'augmentcode'],
    label: 'augment, auggie                    -> .augment/skills',
  },
  {
    projectTarget: 'skills',
    globalTarget: '.openclaw/skills',
    aliases: ['openclaw', 'claw'],
    label: 'openclaw                           -> skills',
  },
  {
    projectTarget: '.agents/skills',
    globalTarget: '.gemini/antigravity/skills',
    aliases: ['antigravity', 'gemini', 'gemini-cli', 'google-antigravity'],
    label: 'gemini, antigravity                -> .agents/skills',
  },
]

const presets = new Map()

for (const group of presetGroups) {
  for (const alias of group.aliases) {
    presets.set(alias, group)
  }
}

function usage() {
  console.error('Usage:')
  console.error('  npx specworkflow install codex')
  console.error('  npx specworkflow install claude-code')
  console.error('  npx specworkflow install cursor')
  console.error('  npx specworkflow install copilot')
  console.error('  npx specworkflow install dsh')
  console.error('  npx specworkflow install -g codex')
  console.error('  npx specworkflow install <project-skills-dir>')
  console.error('')
  console.error('Project presets:')
  for (const group of presetGroups) {
    console.error(`  ${group.label}`)
  }
  console.error('')
  console.error('Unknown plain names are rejected. Pass an explicit path such as .my-agent/skills for unsupported agents.')
}

function looksLikePath(value) {
  return value.includes('/') || value.includes('\\') || value.startsWith('.') || value.startsWith('~')
}

function expandHome(value) {
  if (value === '~') return homedir()
  if (value.startsWith('~/') || value.startsWith('~\\')) return join(homedir(), value.slice(2))
  return value
}

const [, , command, ...targetParts] = process.argv

if (command === '--help' || command === '-h') {
  usage()
  process.exit(0)
}

const globalMode = targetParts.includes('-g') || targetParts.includes('--global')
const remainingTargetParts = targetParts.filter((part) => part !== '-g' && part !== '--global')
const unknownFlag = remainingTargetParts.find((part) => part.startsWith('-') && part !== '-')

if (unknownFlag !== undefined) {
  console.error(`Unknown option: ${unknownFlag}`)
  usage()
  process.exit(1)
}

if (command !== 'install' || remainingTargetParts.length === 0) {
  usage()
  process.exit(1)
}

const targetArg = remainingTargetParts.length === 1 ? remainingTargetParts[0] : remainingTargetParts.join(' ')
const normalizedTarget = targetArg.trim().toLowerCase().replace(/[\s_]+/gu, '-')
const preset = presets.get(normalizedTarget)
const targetPath = preset !== undefined
  ? globalMode ? preset.globalTarget : preset.projectTarget
  : targetArg

if (preset === undefined && !looksLikePath(targetArg)) {
  console.error(`Unknown agent preset: ${targetArg}`)
  console.error('Use one of the listed presets, or pass an explicit skills path such as .my-agent/skills.')
  process.exit(1)
}

const targetBase = globalMode ? homedir() : process.cwd()
const target = resolve(targetBase, expandHome(targetPath))
const entries = await readdir(source, { withFileTypes: true })
const skills = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)

await mkdir(target, { recursive: true })

for (const skill of skills) {
  const from = join(source, skill)
  const to = join(target, skill)
  await rm(to, { recursive: true, force: true })
  await cp(from, to, { recursive: true })
}

if (preset !== undefined) {
  console.log(`Resolved ${targetArg}${globalMode ? ' globally' : ''} to ${targetPath}`)
}

console.log(`Installed ${skills.length} SpecWorkflow skills into ${target}`)
