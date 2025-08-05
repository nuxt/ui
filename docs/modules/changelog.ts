import { defineNuxtModule, addTemplate } from '@nuxt/kit'
import Git from 'simple-git'

interface CommitInfo {
  components?: string[]
  version?: string
  hash: string
  date: string
  message: string
  refs?: string
  body?: string
  author_name: string
  author_email: string
}

export default defineNuxtModule({
  meta: {
    name: 'changelog'
  },
  async setup() {
    const count = 1000
    const git = Git({ maxConcurrentProcesses: 200 })

    const logs = (await git.log({ maxCount: count })).all.filter((i) => {
      return i.message.includes('chore(release)')
        || i.message.includes('!')
        || i.message.startsWith('feat')
        || i.message.startsWith('fix')
    }) as CommitInfo[]

    for (const log of logs) {
      if (log.message.includes('chore(release)')) {
        log.version = log.message.split(' ')[1]?.trim()
        continue
      }

      const raw = await git.raw(['diff-tree', '--no-commit-id', '--name-only', '-r', log.hash])
      delete log.body
      const files = raw.replace(/\\/g, '/').trim().split('\n')

      log.components = [...new Set(files.map(i => i.match(/^src\/runtime\/components\/(\w+)\.vue$/)?.[1]?.toLowerCase()).filter(Boolean) as string[])]
    }

    const result = logs.filter(i => i.components?.length || i.version)

    addTemplate({
      filename: 'changelog.ts',
      getContents: () => `export interface CommitInfo {
  components?: string[]
  version?: string
  hash: string
  date: string
  message: string
  refs?: string
  body?: string
  author_name: string
  author_email: string
}

export const changelog: CommitInfo[] = ${JSON.stringify(result, null, 2)}`,
      write: true
    })
  }
})
