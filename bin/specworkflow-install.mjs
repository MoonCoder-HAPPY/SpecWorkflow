#!/usr/bin/env node
import { cp, mkdir, readdir, rm } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'skill-package')

function usage() {
  console.error('Usage: npx specworkflow install <project-skills-dir>')
  console.error('Example: npx specworkflow install .agents/skills')
}

const [, , command, targetArg] = process.argv

if (command !== 'install' || targetArg === undefined) {
  usage()
  process.exit(1)
}

const target = resolve(process.cwd(), targetArg)
const entries = await readdir(source, { withFileTypes: true })
const skills = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)

await mkdir(target, { recursive: true })

for (const skill of skills) {
  const from = join(source, skill)
  const to = join(target, skill)
  await rm(to, { recursive: true, force: true })
  await cp(from, to, { recursive: true })
}

console.log(`Installed ${skills.length} SpecWorkflow skills into ${target}`)
