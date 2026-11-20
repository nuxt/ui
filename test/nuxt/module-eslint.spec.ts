import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'pathe'
import { defineNuxtModule, loadNuxt } from '@nuxt/kit'
import { afterAll, beforeAll, expect, it } from 'vitest'
import ui from '../../src/module'

type AddonConfig = { imports: { from: string }[], configs: string[] }
let config: AddonConfig | undefined

beforeAll(async () => {
  const rootDir = await mkdtemp(join(process.cwd(), 'node_modules/.nuxt-ui-eslint-'))
  afterAll(() => rm(rootDir, { recursive: true, force: true }))

  await mkdir(join(rootDir, 'app'))
  await writeFile(join(rootDir, 'app/app.config.ts'), `
    export default defineAppConfig({ ui: { colors: { primary: 'my-brand' } } })
  `)

  const entryPoint = join(process.cwd(), 'test/fixtures/consumer/minimal/app/assets/css/main.css')

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
  afterAll(() => nuxt.close())

  await nuxt.ready()

  const addons: { name: string, getConfigs: () => AddonConfig }[] = []
  await nuxt.callHook('eslint:config:addons' as any, addons)
  config = addons.find(addon => addon.name === 'nuxt-ui')?.getConfigs()
}, 20000)

it('registers the ESLint config with a file URL for Node ESM', () => {
  expect(config?.imports).toEqual([
    { from: expect.stringMatching(/^file:\/\/.*\/eslint\.mjs$/), name: 'default', as: 'nuxtUI' }
  ])
})

it('passes a hyphenated palette from app.config.ts to ESLint', () => {
  const options = JSON.parse(config?.configs[0]?.slice('...nuxtUI('.length, -1) ?? '{}')
  expect(options).toMatchObject({ colors: { primary: 'my-brand' } })
})
