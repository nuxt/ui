import { describe, expect, it } from 'vitest'
import { readAppConfigColors } from '../../src/utils/eslint'

describe('readAppConfigColors', () => {
  it.each([
    ['a plain object', `export default defineAppConfig({ ui: { colors: { primary: 'blue', neutral: "zinc" } } })`, { primary: 'blue', neutral: 'zinc' }],
    ['quoted keys', `ui: { colors: { 'brand-accent': 'pink', "tertiary": \`indigo\` } }`, { 'brand-accent': 'pink', 'tertiary': 'indigo' }],
    ['hyphens and digits in palettes', `ui: { colors: { primary: 'my-brand', secondary: 'brand2', } }`, { primary: 'my-brand', secondary: 'brand2' }],
    ['a URL inside a string', `export default defineAppConfig({ link: 'https://ui.nuxt.com', ui: { colors: { primary: 'blue' } } })`, { primary: 'blue' }],
    ['a trailing comment that holds another value', `ui: {\n  colors: {\n    'primary': 'my-brand', // primary: 'green'\n    secondary: 'brand2'\n  }\n}`, { primary: 'my-brand', secondary: 'brand2' }],
    ['a block comment', `ui: { colors: { /* primary: 'red', */ primary: 'blue' } }`, { primary: 'blue' }],
    ['CRLF line endings', `ui: {\r\n  colors: {\r\n    primary: 'blue', // neutral: 'slate'\r\n    neutral: 'zinc'\r\n  }\r\n}`, { primary: 'blue', neutral: 'zinc' }]
  ])('reads %s', (_, code, colors) => {
    expect(readAppConfigColors(code)).toEqual(colors)
  })

  it('leaves out a value that is not a string literal', () => {
    expect(readAppConfigColors(`ui: { colors: { primary: isDark ? 'sky' : 'blue', neutral: 'zinc' } }`)).toEqual({ neutral: 'zinc' })
  })
})
