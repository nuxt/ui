import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'pathe'
import { defineNuxtModule, loadNuxt } from '@nuxt/kit'
import { expect, it } from 'vitest'
import ui from '../../src/module'

it('registers the ESLint config with a file URL for Node ESM', { timeout: 20000 }, async ({ onTestFinished }) => {
  const rootDir = await mkdtemp(join(process.cwd(), 'node_modules/.nuxt-ui-eslint-'))
  onTestFinished(() => rm(rootDir, { recursive: true, force: true }))

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

  const addons: { name: string, getConfigs: () => { imports: { from: string }[] } }[] = []
  await nuxt.callHook('eslint:config:addons' as any, addons)

  expect(addons.find(addon => addon.name === 'nuxt-ui')?.getConfigs().imports).toEqual([
    { from: expect.stringMatching(/^file:\/\/.*\/eslint\.mjs$/), name: 'default', as: 'nuxtUI' }
  ])
})
