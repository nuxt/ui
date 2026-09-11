import { describe, it, expect } from 'vitest'
import button from '../../src/theme/button'
import { compileThemeClasses } from '../../src/engine/compile-theme'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { extractUiFromAppConfigFile } from '../../src/engine/extract-app-config'
import { defaultOptions, resolveColors } from '../../src/utils/defaults'

describe('stylex engine', () => {
  it('compiles theme class strings to hashed classes and keeps scalar slots', async () => {
    const result = await compileThemeClasses(button({
      ...defaultOptions,
      theme: { ...defaultOptions.theme, colors: resolveColors(undefined) }
    } as any), 'ui-button')

    const base = Array.isArray(result.slots.base) ? result.slots.base.join(' ') : result.slots.base
    expect(base).not.toContain('rounded-md')
    expect(base).toMatch(/\bx[a-z0-9]+\b/)
    expect(result.variants.size.md.leadingAvatarSize).toBe('2xs')
    expect(result.defaultVariants.color).toBe('primary')
    const leading = result.compoundVariants.find((item: any) => item.loading && item.leading)?.class
    expect(typeof leading === 'object' && leading && 'leadingIcon' in leading ? leading.leadingIcon : '').toMatch(/\bx[a-z0-9]+\b/)
  }, 60_000)

  it('extracts app.config ui overrides when class strings contain braces', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'ui-stylex-app-config-'))
    const file = join(dir, 'app.config.ts')
    const source = `
export default defineAppConfig({
  ui: {
    /** comment with a closing brace } inside */
    button: {
      slots: {
        base: "rounded-md before:content-['}'] extra-class"
      }
    }
  }
})
`
    writeFileSync(file, source)
    try {
      const naive = source.slice(source.indexOf('{', source.indexOf('ui:')))
      const naiveEnd = naive.indexOf('}')
      expect(naive.slice(0, naiveEnd + 1)).not.toContain('extra-class')

      expect(await extractUiFromAppConfigFile(file)).toEqual({
        button: {
          slots: {
            base: 'rounded-md before:content-[\'}\'] extra-class'
          }
        }
      })
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('evaluates app.config imports used by class strings', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'ui-stylex-app-config-'))
    writeFileSync(join(dir, 'pg.ts'), `export const pg = { italic: 'italic', grid: 'grid' }\n`)
    const file = join(dir, 'app.config.ts')
    writeFileSync(file, `
import { pg } from './pg'

export default defineAppConfig({
  ui: {
    editor: {
      slots: {
        base: pg.italic
      }
    }
  }
})
`)
    try {
      expect(await extractUiFromAppConfigFile(file)).toEqual({
        editor: {
          slots: {
            base: 'italic'
          }
        }
      })
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
