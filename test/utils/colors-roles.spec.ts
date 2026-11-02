import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'pathe'
import { describe, it, expect } from 'vitest'
import { parseAccentRoles, parseNeutralRoles } from '../../src/runtime/css/colors'

// Tailwind's own minifier, resolved through `@tailwindcss/vite` like the colors plugin tests
const vite = createRequire(join(process.cwd(), 'package.json')).resolve('@tailwindcss/vite')
const { transform } = createRequire(createRequire(vite).resolve('@tailwindcss/node'))('lightningcss')

const source = readFileSync(join(process.cwd(), 'src/runtime/css/accent.css'), 'utf8')
// The shape `accent.css` ships in: no space after `:`, no `;` after the last declaration
const minified = transform({ filename: 'accent.css', code: Buffer.from(source), minify: true }).code.toString()

describe('colors plugin roles', () => {
  it('reads the accent roles from the source and the minified `accent.css`', () => {
    expect(minified).not.toContain('--ui-accent-bg-hover: ')
    expect(parseAccentRoles(source).length).toBeGreaterThan(0)
    expect(parseAccentRoles(minified)).toEqual(parseAccentRoles(source))
  })

  it('reads the neutral roles and their fallbacks from the source and the minified `accent.css`', () => {
    // The minifier drops some spaces after a comma inside a value, which CSS reads the same
    const pairs = (css: string) => parseNeutralRoles(css).map(([role, value]) => [role, value.replace(/,\s+/g, ',')])

    expect(parseNeutralRoles(source).length).toBeGreaterThan(0)
    expect(pairs(minified)).toEqual(pairs(source))
  })
})
