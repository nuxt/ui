import { expect, it } from 'vitest'
import { Linter } from 'eslint'
import nuxtUI from '../../src/eslint'

it('suggests the primary alias for green by default', () => {
  const config = nuxtUI({
    entryPoint: 'test/fixtures/consumer/minimal/app/assets/css/main.css',
    rules: { 'no-conflicting-classes': 'off' }
  })
  const messages = new Linter().verify('const classes = "bg-green-500"', config)

  expect(messages).toMatchObject([
    { ruleId: 'better-tailwindcss/no-restricted-classes', message: expect.stringContaining('use `bg-primary-500` instead') }
  ])
})

it('suggests semantic aliases for custom palette classes', () => {
  const config = nuxtUI({
    entryPoint: 'test/fixtures/consumer/minimal/app/assets/css/main.css',
    colors: { primary: 'brand', secondary: 'primary' },
    rules: { 'no-conflicting-classes': 'off' }
  })
  const messages = new Linter().verify(
    'const classes = "bg-brand-500 hover:bg-brand-500/50 bg-primary-500"',
    config
  )

  expect(messages).toMatchObject([
    { ruleId: 'better-tailwindcss/no-restricted-classes', message: expect.stringContaining('use `bg-primary-500` instead') },
    { ruleId: 'better-tailwindcss/no-restricted-classes', message: expect.stringContaining('use `hover:bg-primary-500/50` instead') }
  ])
})

it('only warns on classes with a shade when a custom palette shares a utility name', () => {
  const config = nuxtUI({
    entryPoint: 'test/fixtures/consumer/minimal/app/assets/css/main.css',
    colors: { primary: 'cover' },
    rules: { 'no-conflicting-classes': 'off' }
  })
  const messages = new Linter().verify('const classes = "bg-cover bg-cover-500"', config)

  expect(messages).toMatchObject([
    { ruleId: 'better-tailwindcss/no-restricted-classes', message: expect.stringContaining('use `bg-primary-500` instead') }
  ])
})

it.each([
  ['linear', 'bg-linear-50 hover:bg-linear-50/oklab', 'text-linear-500', 'text-primary-500'],
  ['conic', 'bg-conic-50', 'text-conic-500', 'text-primary-500'],
  ['offset', 'outline-offset-50 md:-outline-offset-50! ring-offset-50', 'bg-offset-500', 'bg-primary-500'],
  ['spacing', 'border-spacing-50', 'bg-spacing-500', 'bg-primary-500'],
  ['spacing-x', 'border-spacing-x-50', 'bg-spacing-x-500', 'bg-primary-500'],
  ['x', 'border-x-50 divide-x-50', 'bg-x-500', 'bg-primary-500']
])('preserves numeric utilities when the custom palette is %s', (palette, utilities, color, suggestion) => {
  const config = nuxtUI({
    entryPoint: 'test/fixtures/consumer/minimal/app/assets/css/main.css',
    colors: { primary: palette },
    rules: { 'no-conflicting-classes': 'off' }
  })
  const messages = new Linter().verify(`const classes = "${utilities} ${color}"`, config)

  expect(messages).toMatchObject([
    { ruleId: 'better-tailwindcss/no-restricted-classes', message: expect.stringContaining(`use \`${suggestion}\` instead`) }
  ])
})
