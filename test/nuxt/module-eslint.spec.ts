import { mkdtemp, rm } from 'node:fs/promises'
import { join } from 'pathe'
import { defineNuxtModule, loadNuxt } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { afterAll, beforeAll, expect, it } from 'vitest'
import ui from '../../src/module'

type AddonConfig = { imports: { from: string }[], configs: string[] }
let config: AddonConfig | undefined
let rootDir: string | undefined
let nuxt: Nuxt | undefined

beforeAll(async () => {
  rootDir = await mkdtemp(join(process.cwd(), 'node_modules/.nuxt-ui-eslint-'))

  const entryPoint = join(process.cwd(), 'test/fixtures/consumer/minimal/app/assets/css/main.css')

  // Stand in for @nuxt/eslint and inspect the import passed to its config generator.
  const eslint = defineNuxtModule({ meta: { name: '@nuxt/eslint' } })
  nuxt = await loadNuxt({
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
  await nuxt.ready()

  const addons: { name: string, getConfigs: () => AddonConfig }[] = []
  await nuxt.callHook('eslint:config:addons' as any, addons)
  config = addons.find(addon => addon.name === 'nuxt-ui')?.getConfigs()
}, 20000)

afterAll(async () => {
  await nuxt?.close()
  if (rootDir) {
    await rm(rootDir, { recursive: true, force: true })
  }
})

it('registers the ESLint config with a file URL for Node ESM', async () => {
  expect(config?.imports).toEqual([
    { from: expect.stringMatching(/^file:\/\/.*\/eslint\.mjs$/), name: 'default', as: 'nuxtUI' }
  ])
  const { default: nuxtUI } = await import(/* @vite-ignore */ config!.imports[0]!.from)
  expect(nuxtUI).toBeTypeOf('function')
})
