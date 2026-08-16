import { fileURLToPath } from 'node:url'
import { FileSystemSkillProvider } from '@deepseek-ai/dsh-skill-filesystem'

export const name = 'specworkflow'
export const inject = ['skills']

export function apply(ctx) {
  const skillDir = fileURLToPath(new URL('./skill-package', import.meta.url))
  ctx.skills.registerProvider((control) =>
    new FileSystemSkillProvider(ctx, control, {
      providerName: 'specworkflow',
      customSkillDirs: [skillDir],
    }),
  )
}
