import { describe, it, expect, afterAll, vi } from 'vitest'
import { consola } from 'consola'
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

  it('ignores declaration files', async () => {
    const dir = fixtureUsing('<UButton label="x" />')
    // `components.d.ts` declares every component ever rendered: scanning it
    // would keep anything used once detected forever.
    writeFileSync(join(dir, 'components.d.ts'), `UTable: typeof import('./Table.vue')['default']\n`)

    const detected = await detectUsedComponents([dir], 'U', componentDir)

    expect(detected).toContain('Button')
    expect(detected).not.toContain('Table')
  })

  it('always includes components from includeComponents', async () => {
    const detected = await detectUsedComponents([fixtureUsing('<div>no nuxt ui here</div>')], 'U', componentDir, ['Modal'])

    expect(detected).toContain('Modal')
    expect(detected).toContain('Button')
  })

  it('ignores identifiers that only look like components', async () => {
    // `URL` matches the pattern as `RL`, `UUID` as `UID`: junk names must not
    // defeat the include-everything fallback, which would blank every theme.
    const junk = fixtureUsing('<div />')
    writeFileSync(join(junk, 'vite.config.ts'), `import { fileURLToPath, URL } from 'node:url'\ntype UUID = string\n`)

    expect(await detectUsedComponents([junk], 'U', componentDir)).toBeUndefined()

    const mixed = fixtureUsing('<UButton label="x" />')
    writeFileSync(join(mixed, 'vite.config.ts'), `import { fileURLToPath, URL } from 'node:url'\n`)
    const detected = await detectUsedComponents([mixed], 'U', componentDir)

    expect(detected).toContain('Button')
    expect(detected).not.toContain('RL')
  })

  it('detects kebab-case component tags', async () => {
    const detected = await detectUsedComponents([fixtureUsing('<u-alert title="x" /><lazy-u-tooltip text="y" />')], 'U', componentDir)

    expect(detected).toContain('Alert')
    expect(detected).toContain('Tooltip')
    expect(detected).toContain('Button')
  })

  it('detects kebab-case and PascalCase usage in the same file', async () => {
    const detected = await detectUsedComponents([fixtureUsing('<UCard><u-badge label="x" /></UCard>')], 'U', componentDir)

    expect(detected).toContain('Card')
    expect(detected).toContain('Badge')
  })

  it('detects kebab-case tags with a custom prefix', async () => {
    const detected = await detectUsedComponents([fixtureUsing('<nx-alert title="x" />')], 'Nx', componentDir)

    expect(detected).toContain('Alert')
    expect(detected).toContain('Button')
  })

  it('warns on unknown includeComponents names without poisoning detection', async () => {
    const warn = vi.spyOn(consola, 'warn').mockImplementation(() => {})

    expect(await detectUsedComponents([fixtureUsing('<div />')], 'U', componentDir, ['Dropdown'])).toBeUndefined()
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Dropdown'))

    warn.mockRestore()
  })

  it('resolves dependencies of components shadowed by prose themes', async () => {
    // `prose/Tabs.vue` shares its basename with `Tabs.vue`: the graph must keep
    // the regular component's dependency set, not the prose one's.
    const detected = await detectUsedComponents([fixtureUsing('<UTabs :items="[]" />')], 'U', componentDir)

    expect(detected).toContain('Icon')
    expect(detected).toContain('Avatar')
    expect(detected).toContain('Badge')
  })

  it('resolves internal dependencies with a custom prefix', async () => {
    // Nuxt UI's own components reference each other with `U` regardless of the
    // configured prefix: the graph pass must not use the user prefix.
    const detected = await detectUsedComponents([fixtureUsing('<XAlert title="x" />')], 'X', componentDir)

    expect(detected).toContain('Alert')
    expect(detected).toContain('Button')
    expect(detected).toContain('Icon')
  })

  it('scans the dist directory of a scanned package', async () => {
    // Published packages ship their code in `dist/` as `.mjs`: the project
    // build-output ignores must not apply to `scanPackages` directories.
    const root = fixtureRoot()
    const pkgDir = fixturePackage(root, 'dist-lib')
    mkdirSync(join(pkgDir, 'dist'), { recursive: true })
    writeFileSync(join(pkgDir, 'dist', 'index.mjs'), `export const render = () => h(UChip)\n`)

    expect(await detectUsedComponents([pkgDir], 'U', componentDir)).toContain('Chip')
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
