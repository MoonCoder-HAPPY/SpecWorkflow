#!/usr/bin/env node
import { cp, mkdir, readdir, rm } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'skill-package')

const presetGroups = [
  {
    target: '.agents/skills',
    aliases: [
      'agent',
      'agents',
      'agent-skills',
      'agents-md',
      'amp',
      'antigravity',
      'codex',
      'gemini',
      'gemini-cli',
      'google-antigravity',
      'goose',
      'openai',
      'sourcegraph-amp',
      'zed',
    ],
    label: 'codex, gemini, goose, zed, amp -> .agents/skills',
  },
  {
    target: '.github/skills',
    aliases: ['copilot', 'github-copilot', 'vs-code', 'vscode'],
    label: 'copilot, vscode                   -> .github/skills',
  },
  {
    target: '.cursor/skills',
    aliases: ['cursor', 'cursor-agent', 'cursor-native'],
    label: 'cursor                            -> .cursor/skills',
  },
  {
    target: '.claude/skills',
    aliases: ['claude', 'claude-code', 'claudecode'],
    label: 'claude, claude-code                 -> .claude/skills',
  },
  {
    target: '.dsh/skills',
    aliases: ['deepseek', 'deepseek-harness', 'dsh'],
    label: 'dsh, deepseek                      -> .dsh/skills',
  },
  {
    target: '.opencode/skills',
    aliases: ['open-code', 'opencode'],
    label: 'opencode                           -> .opencode/skills',
  },
  {
    target: '.windsurf/skills',
    aliases: ['cascade', 'windsurf'],
    label: 'windsurf, cascade                  -> .windsurf/skills',
  },
  {
    target: '.cline/skills',
    aliases: ['claudine', 'cline'],
    label: 'cline, claudine                    -> .cline/skills',
  },
  {
    target: '.roo/skills',
    aliases: ['roo', 'roo-code', 'roocode'],
    label: 'roo, roo-code                      -> .roo/skills',
  },
  {
    target: '.qwen/skills',
    aliases: ['qwen', 'qwen-code', 'qwencode'],
    label: 'qwen, qwen-code                    -> .qwen/skills',
  },
  {
    target: '.kiro/skills',
    aliases: ['kiro'],
    label: 'kiro                               -> .kiro/skills',
  },
  {
    target: '.kilo/skills',
    aliases: ['kilo', 'kilo-code', 'kilocode'],
    label: 'kilo, kilo-code                    -> .kilo/skills',
  },
  {
    target: '.augment/skills',
    aliases: ['auggie', 'augment', 'augment-code', 'augmentcode'],
    label: 'augment, auggie                    -> .augment/skills',
  },
  {
    target: 'skills',
    aliases: ['openclaw', 'claw'],
    label: 'openclaw                           -> skills',
  },
]

const presets = new Map()

for (const group of presetGroups) {
  for (const alias of group.aliases) {
    presets.set(alias, group.target)
  }
}

function usage() {
  console.error('Usage:')
  console.error('  npx specworkflow install codex')
  console.error('  npx specworkflow install claude-code')
  console.error('  npx specworkflow install cursor')
  console.error('  npx specworkflow install copilot')
  console.error('  npx specworkflow install dsh')
  console.error('  npx specworkflow install <project-skills-dir>')
  console.error('')
  console.error('Presets:')
  for (const group of presetGroups) {
    console.error(`  ${group.label}`)
  }
  console.error('')
  console.error('Unknown plain names are rejected. Pass an explicit path such as .my-agent/skills for unsupported agents.')
}

function looksLikePath(value) {
  return value.includes('/') || value.includes('\\') || value.startsWith('.') || value.startsWith('~')
}

const [, , command, ...targetParts] = process.argv

if (command === '--help' || command === '-h') {
  usage()
  process.exit(0)
}

if (command !== 'install' || targetParts.length === 0) {
  usage()
  process.exit(1)
}

const targetArg = targetParts.length === 1 ? targetParts[0] : targetParts.join(' ')
const normalizedTarget = targetArg.trim().toLowerCase().replace(/[\s_]+/gu, '-')
const targetPath = presets.get(normalizedTarget) ?? targetArg

if (!presets.has(normalizedTarget) && !looksLikePath(targetArg)) {
  console.error(`Unknown agent preset: ${targetArg}`)
  console.error('Use one of the listed presets, or pass an explicit project-level skills path such as .my-agent/skills.')
  process.exit(1)
}

const target = resolve(process.cwd(), targetPath)
const entries = await readdir(source, { withFileTypes: true })
const skills = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)

await mkdir(target, { recursive: true })

for (const skill of skills) {
  const from = join(source, skill)
  const to = join(target, skill)
  await rm(to, { recursive: true, force: true })
  await cp(from, to, { recursive: true })
}

if (presets.has(normalizedTarget)) {
  console.log(`Resolved ${targetArg} to ${targetPath}`)
}

console.log(`Installed ${skills.length} SpecWorkflow skills into ${target}`)
