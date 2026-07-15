import { describe, it, expect, afterAll } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { detectUsedComponents } from '../../src/utils/components'

const componentDir = join(process.cwd(), 'src/runtime/components')

const fixtureDirs: string[] = []

function fixtureUsing(markup: string) {
  const dir = mkdtempSync(join(tmpdir(), 'nuxt-ui-cd-'))
  fixtureDirs.push(dir)
  writeFileSync(join(dir, 'App.vue'), `<template>${markup}</template>\n`)
  return dir
}

afterAll(() => {
  for (const dir of fixtureDirs) {
    rmSync(dir, { recursive: true, force: true })
  }
})

describe('detectUsedComponents', () => {
  it('detects used components and resolves their dependencies', async () => {
    const detected = await detectUsedComponents([fixtureUsing('<UButton label="x" />')], 'U', componentDir)

    // Button + its dependency closure, nothing else.
    expect(detected).toContain('Button')
    expect(detected).toContain('Link')
    expect(detected).not.toContain('Table')
    expect(detected!.size).toBeLessThan(10)
  })

  it('detects lazy components', async () => {
    const detected = await detectUsedComponents([fixtureUsing('<LazyUTooltip text="x" />')], 'U', componentDir)

    expect(detected).toContain('Tooltip')
  })

  it('always includes components from includeComponents', async () => {
    const detected = await detectUsedComponents([fixtureUsing('<div>no nuxt ui here</div>')], 'U', componentDir, ['Modal'])

    expect(detected).toContain('Modal')
    expect(detected).toContain('Button')
  })

  it('skips files in nested node_modules and dist directories', async () => {
    const dir = fixtureUsing('<UButton label="x" />')
    const nested = join(dir, 'packages', 'foo', 'node_modules', 'pkg')
    const dist = join(dir, 'packages', 'foo', 'dist')
    mkdirSync(nested, { recursive: true })
    mkdirSync(dist, { recursive: true })
    writeFileSync(join(nested, 'index.js'), 'export const UAlert = 1\n')
    writeFileSync(join(dist, 'out.js'), 'export const UTable = 1\n')

    const detected = await detectUsedComponents([dir], 'U', componentDir)

    expect(detected).toContain('Button')
    expect(detected).not.toContain('Alert')
    expect(detected).not.toContain('Table')
  })

  it('returns undefined when no component is detected', async () => {
    expect(await detectUsedComponents([fixtureUsing('<div>no nuxt ui here</div>')], 'U', componentDir)).toBeUndefined()
  })
})
