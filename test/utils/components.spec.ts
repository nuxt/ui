import { describe, it, expect, afterAll } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, realpathSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { detectUsedComponents, resolveExtraScanDirs } from '../../src/utils/components'

const componentDir = join(process.cwd(), 'src/runtime/components')

const fixtureDirs: string[] = []

function fixtureUsing(markup: string) {
  const dir = mkdtempSync(join(tmpdir(), 'nuxt-ui-cd-'))
  fixtureDirs.push(dir)
  writeFileSync(join(dir, 'App.vue'), `<template>${markup}</template>\n`)
  return dir
}

// `realpathSync` because module resolution returns real paths and macOS puts
// `tmpdir()` behind a `/private` symlink.
function fixtureRoot() {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'nuxt-ui-cd-')))
  fixtureDirs.push(dir)
  return dir
}

function fixturePackage(root: string, name: string, contents = 'module.exports = {}\n') {
  const dir = join(root, 'node_modules', name)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name, main: 'index.js' }))
  writeFileSync(join(dir, 'index.js'), contents)
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

  it('detects usage inside a scanned package directory', async () => {
    // The dir itself sits in `node_modules`: the ignore patterns apply to paths
    // relative to it, so its files are still scanned.
    const pkgDir = fixturePackage(fixtureRoot(), 'my-lib', 'export { UAlert } from "#components"\n')

    expect(await detectUsedComponents([pkgDir], 'U', componentDir)).toContain('Alert')
  })
})

describe('resolveExtraScanDirs', () => {
  it('resolves scanPackages to their package directory', () => {
    const root = fixtureRoot()
    const pkgDir = fixturePackage(root, 'my-lib')

    expect(resolveExtraScanDirs(root, ['my-lib'])).toEqual([pkgDir])
  })

  it('resolves scoped packages', () => {
    const root = fixtureRoot()
    const pkgDir = fixturePackage(root, '@scope/my-lib')

    expect(resolveExtraScanDirs(root, ['@scope/my-lib'])).toEqual([pkgDir])
  })

  it('skips packages that cannot be resolved', () => {
    expect(resolveExtraScanDirs(fixtureRoot(), ['missing-lib'])).toEqual([])
  })

  it('keeps component dirs outside the root and drops the ones inside', () => {
    const root = fixtureRoot()
    const outside = fixtureRoot()
    mkdirSync(join(root, 'src', 'components'), { recursive: true })

    expect(resolveExtraScanDirs(root, undefined, ['src/components', outside])).toEqual([outside])
  })

  it('resolves glob dirs from their static prefix', () => {
    const root = fixtureRoot()
    const outside = fixtureRoot()
    mkdirSync(join(outside, 'components'), { recursive: true })

    expect(resolveExtraScanDirs(root, undefined, [`${outside}/components/**`])).toEqual([join(outside, 'components')])
  })
})
