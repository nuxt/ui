import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { defu } from 'defu'
import { compile } from 'tailwindcss'
import { describe, expect, it } from 'vitest'
import type { ModuleOptions } from '../../src/module'
import { defaultOptions, resolveColors } from '../../src/utils/defaults'
import { getTemplates } from '../../src/templates'

const runtimeDir = join(process.cwd(), 'src/runtime')
const require = createRequire(import.meta.url)
const tailwindDir = dirname(require.resolve('tailwindcss/package.json'))
const options = defu({}, defaultOptions) as ModuleOptions

options.theme = options.theme || {}
options.theme.colors = resolveColors(options.theme.colors)

async function getTemplateContents(filename: string) {
  const template = getTemplates(options, {}).find(template => template.filename === filename)

  if (!template?.getContents) {
    throw new Error(`Missing ${filename} template`)
  }

  return await template.getContents({} as any)
}

async function compileNuxtUI(css: string) {
  const runtimeCss = await readFile(join(runtimeDir, 'index.css'), 'utf8')
  const baseCss = await readFile(join(runtimeDir, 'base.css'), 'utf8')
  const sourcesCss = await readFile(join(runtimeDir, 'sources.css'), 'utf8')
  const keyframesCss = await readFile(join(runtimeDir, 'keyframes.css'), 'utf8')
  const uiCss = await getTemplateContents('ui.css')
  const uiSourcesCss = await getTemplateContents('ui.sources.css')

  return await compile(css, {
    from: join(process.cwd(), 'app.css'),
    loadStylesheet: async (id, base) => {
      if (id === 'tailwindcss') {
        const path = join(tailwindDir, 'index.css')
        return { path, base: tailwindDir, content: await readFile(path, 'utf8') }
      }

      if (id.startsWith('tailwindcss/')) {
        const path = join(tailwindDir, id.slice('tailwindcss/'.length))
        return { path, base: tailwindDir, content: await readFile(path, 'utf8') }
      }

      if (id.startsWith('./') && base === tailwindDir) {
        const path = join(base, id)
        return { path, base, content: await readFile(path, 'utf8') }
      }

      if (id === '@nuxt/ui') {
        return { path: join(runtimeDir, 'index.css'), base: runtimeDir, content: runtimeCss }
      }

      if (id === './base.css' && base === runtimeDir) {
        return { path: join(runtimeDir, 'base.css'), base: runtimeDir, content: baseCss }
      }

      if (id === './sources.css' && base === runtimeDir) {
        return { path: join(runtimeDir, 'sources.css'), base: runtimeDir, content: sourcesCss }
      }

      if (id === '@nuxt/ui/base') {
        return { path: join(runtimeDir, 'base.css'), base: runtimeDir, content: baseCss }
      }

      if (id === '@nuxt/ui/sources') {
        return { path: join(runtimeDir, 'sources.css'), base: runtimeDir, content: sourcesCss }
      }

      if (id === '#build/ui.css') {
        return { path: join(process.cwd(), '.nuxt/ui.css'), base, content: uiCss }
      }

      if (id === '#build/ui.sources.css') {
        return { path: join(process.cwd(), '.nuxt/ui.sources.css'), base, content: uiSourcesCss }
      }

      if (id === './keyframes.css') {
        return { path: join(runtimeDir, 'keyframes.css'), base: runtimeDir, content: keyframesCss }
      }

      throw new Error(`Unexpected stylesheet import: ${id}`)
    }
  })
}

describe('CSS cascade layers', () => {
  it('allows the runtime stylesheet to be imported into a CSS cascade layer', async () => {
    const baseCss = await readFile(join(runtimeDir, 'base.css'), 'utf8')
    const sourcesCss = await readFile(join(runtimeDir, 'sources.css'), 'utf8')
    const uiCss = await getTemplateContents('ui.css')
    const uiSourcesCss = await getTemplateContents('ui.sources.css')

    expect(baseCss).not.toMatch(/@(theme|source|variant)\b/)
    expect(uiCss).not.toContain('@source')
    expect(uiCss).not.toContain('@theme')
    expect(sourcesCss).toContain('@source')
    expect(sourcesCss).toContain('@variant light')
    expect(uiSourcesCss).toContain('@theme')
    expect(uiSourcesCss).toContain('@source')

    const compiler = await compileNuxtUI('@import "tailwindcss" layer(tailwindcss);\n@import "@nuxt/ui/sources";\n@import "@nuxt/ui/base" layer(tailwindcss);')
    const output = compiler.build(['light:bg-primary', 'dark:bg-primary'])

    expect(output).toContain(':where(.light, .light *)')
    expect(output).toContain(':where(.dark, .dark *)')
    expect(output).not.toContain('@variant light')
  })

  it('keeps the default Nuxt UI import complete', async () => {
    const compiler = await compileNuxtUI('@import "tailwindcss";\n@import "@nuxt/ui";')
    const output = compiler.build(['light:bg-primary', 'dark:bg-primary'])

    expect(output).toContain(':where(.light, .light *)')
    expect(output).toContain(':where(.dark, .dark *)')
  })
})
