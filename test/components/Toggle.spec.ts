import { describe, it, expect } from 'vitest'
import Toggle from '../../src/runtime/components/Toggle.vue'
import type { ToggleProps } from '../../src/runtime/components/Toggle.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/button'

describe('Toggle', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any
  const colors = Object.keys(theme.variants.color) as any

  it.each([
    // Props
    ['with label', { props: { label: 'Toggle' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { label: 'Toggle', size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { label: 'Toggle', variant } }]),
    ...colors.map((color: string) => [`with neutral color ${color}`, { props: { label: 'Toggle', color } }]),
    ['with icon', { props: { icon: 'i-lucide-rocket' } }],
    ['with leading and icon', { props: { leading: true, icon: 'i-lucide-arrow-left' } }],
    ['with leadingIcon', { props: { leadingIcon: 'i-lucide-arrow-left' } }],
    ['with trailing and icon', { props: { trailing: true, icon: 'i-lucide-arrow-right' } }],
    ['with trailingIcon', { props: { trailingIcon: 'i-lucide-arrow-right' } }],
    ['with class', { props: { label: 'Toggle', class: 'rounded-none' } }],
    ['with ui', { props: { label: 'Toggle', ui: { base: 'rounded-none' } } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ToggleProps }) => {
    const html = await ComponentRender(nameOrHtml, options, Toggle)
    expect(html).toMatchSnapshot()
  })
})
