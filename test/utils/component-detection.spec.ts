import { describe, it, expect } from 'vitest'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { defu } from 'defu'
import { getTemplates } from '../../src/templates'
import { defaultOptions, getDefaultConfig, resolveColors } from '../../src/utils/defaults'

const componentDir = join(process.cwd(), 'src/runtime/components')

function buildOptions(componentDetection: boolean | string[]) {
  const options: any = defu({ fonts: false, experimental: { componentDetection } }, defaultOptions)
  options.theme = options.theme || {}
  options.theme.colors = resolveColors(options.theme.colors)
  return options
}

// Drive the real `generateSources` through the Vue integration path (no `nuxt`,
// component dir + scan root threaded in) and return the emitted `@source` lines.
async function sources(componentDetection: boolean, root: string) {
  const options = buildOptions(componentDetection)
  const ui = getDefaultConfig(options.theme)
  const templates = getTemplates(options, ui, undefined, undefined, { root: () => root, componentDir })
  const css = await templates.find(t => t.filename === 'ui.css')!.getContents!({} as any)
  return css.split('\n').filter(line => line.trim().startsWith('@source'))
}

function fixtureUsing(markup: string) {
  const dir = mkdtempSync(join(tmpdir(), 'nuxt-ui-cd-'))
  writeFileSync(join(dir, 'App.vue'), `<template>${markup}</template>\n`)
  return dir
}

describe('vue componentDetection', () => {
  it('scans every theme file when disabled (default)', async () => {
    expect(await sources(false, fixtureUsing('<UButton label="x" />'))).toEqual(['@source "./ui";'])
  })

  it('narrows @source to used components and their dependencies', async () => {
    const emitted = await sources(true, fixtureUsing('<UButton label="x" />'))

    // Button + its dependency closure, not the blanket scan of all ~163 themes.
    expect(emitted).toContain('@source "./ui/button.ts";')
    expect(emitted).toContain('@source "./ui/link.ts";')
    expect(emitted).not.toContain('@source "./ui";')
    expect(emitted.length).toBeLessThan(10)
  })

  it('falls back to scanning everything when no component is detected', async () => {
    expect(await sources(true, fixtureUsing('<div>no nuxt ui here</div>'))).toContain('@source "./ui";')
  })
})
