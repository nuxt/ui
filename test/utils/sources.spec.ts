import { cpSync, mkdirSync, mkdtempSync, readdirSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'
import { join } from 'pathe'
import { describe, it, expect, afterAll } from 'vitest'
import { getTemplates } from '../../src/templates'
import { defaultOptions, getDefaultConfig } from '../../src/utils/defaults'

// Tailwind's compiler and scanner, resolved through `@tailwindcss/vite`, which depends on both
const vite = createRequire(join(process.cwd(), 'package.json')).resolve('@tailwindcss/vite')
const load = (name: string) => import(pathToFileURL(createRequire(vite).resolve(name)).href)

const runtime = join(process.cwd(), 'src/runtime')
// Its real path, as the module resolves it (`/var` is a symlink on macOS)
const app = realpathSync(mkdtempSync(join(tmpdir(), 'nuxt-ui-sources-')))
// Installed the way users get it: under `node_modules`, which Tailwind treats as ignored
const dist = join(app, 'node_modules/@nuxt/ui/dist')

mkdirSync(join(dist, 'runtime/components'), { recursive: true })
for (const file of readdirSync(runtime).filter(file => file.endsWith('.css'))) {
  cpSync(join(runtime, file), join(dist, 'runtime', file))
}
cpSync(join(runtime, 'theme'), join(dist, 'runtime/theme'), { recursive: true })
symlinkSync(join(process.cwd(), 'node_modules/tailwindcss'), join(app, 'node_modules/tailwindcss'))

afterAll(() => rmSync(app, { recursive: true, force: true }))

async function build(overrides: Record<string, any>, vue?: { detectedComponents?: Set<string> }) {
  const options = { ...defaultOptions, ...overrides, theme: { ...defaultOptions.theme } }
  const templates = getTemplates(options as any, getDefaultConfig(options.theme), undefined, (...paths: string[]) => join(dist, ...paths), vue)
  for (const filename of ['ui.css', 'ui.base.css']) {
    writeFileSync(join(app, filename), await templates.find(template => template.filename === filename)!.getContents!({} as any))
  }

  const { compile } = await load('@tailwindcss/node')
  const { Scanner } = await load('@tailwindcss/oxide')
  const compiler = await compile(`@import "tailwindcss";\n@import "${join(dist, 'runtime/index.css')}";`, {
    base: app,
    onDependency: () => {},
    customCssResolver: async (id: string) => id.startsWith('#build/') ? join(app, id.slice('#build/'.length)) : undefined
  })

  return compiler.build(new Scanner({ sources: compiler.sources }).scan()) as string
}

// `animate-pulse` only comes from the Skeleton theme
describe('package sources', () => {
  it('scans every theme by default', async () => {
    expect(await build({})).toContain('.animate-pulse')
  })

  it('leaves out the themes detection didn\'t find', async () => {
    const css = await build({ experimental: { componentDetection: true } }, { detectedComponents: new Set(['Button']) })

    expect(css).toContain('.rounded-md')
    expect(css).not.toContain('.animate-pulse')
  })
})
