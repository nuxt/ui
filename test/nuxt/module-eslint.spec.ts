import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'pathe'
import { defineNuxtModule, loadNuxt } from '@nuxt/kit'
import { expect, it } from 'vitest'
import type { TestContext } from 'vitest'
import ui from '../../src/module'

async function getESLintAddon(onTestFinished: TestContext['onTestFinished'], appConfig?: string) {
  const rootDir = await mkdtemp(join(process.cwd(), 'node_modules/.nuxt-ui-eslint-'))
  onTestFinished(() => rm(rootDir, { recursive: true, force: true }))

  if (appConfig) {
    await mkdir(join(rootDir, 'app'))
    await writeFile(join(rootDir, 'app/app.config.ts'), appConfig)
  }

  const entryPoint = join(rootDir, 'main.css')
  await writeFile(entryPoint, '@import "tailwindcss";\n')

  // Stand in for @nuxt/eslint and inspect the import passed to its config generator.
  const eslint = defineNuxtModule({ meta: { name: '@nuxt/eslint' } })
  const nuxt = await loadNuxt({
    cwd: rootDir,
    rcFile: false,
    ready: false,
    overrides: {
      workspaceDir: rootDir,
      telemetry: false,
      modules: [eslint, ui],
      ui: { eslint: { entryPoint }, fonts: false, colorMode: false }
    }
  })
  onTestFinished(() => nuxt.close())

  await nuxt.ready()

  const addons: { name: string, getConfigs: () => { imports: { from: string }[], configs: string[] } }[] = []
  await nuxt.callHook('eslint:config:addons' as any, addons)

  return addons.find(addon => addon.name === 'nuxt-ui')?.getConfigs()
}

it('registers the ESLint config with a file URL for Node ESM', { timeout: 20000 }, async ({ onTestFinished }) => {
  const config = await getESLintAddon(onTestFinished)

  expect(config?.imports).toEqual([
    { from: expect.stringMatching(/^file:\/\/.*\/eslint\.mjs$/), name: 'default', as: 'nuxtUI' }
  ])
})

it('passes a hyphenated palette from app.config.ts to ESLint', { timeout: 20000 }, async ({ onTestFinished }) => {
  const config = await getESLintAddon(onTestFinished, `
    export default defineAppConfig({
      ui: { colors: { primary: 'my-brand' } }
    })
  `)

  const options = JSON.parse(config?.configs[0]?.slice('...nuxtUI('.length, -1) ?? '{}')
  expect(options).toMatchObject({ colors: { primary: 'my-brand' } })
})
