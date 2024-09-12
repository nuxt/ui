import { describe, it, expect } from 'vitest'
import Button, { type ButtonProps, type ButtonSlots } from '../../src/runtime/components/Button.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/button'

describe('Button', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any

  it.each([
    // Props
    ['with label', { props: { label: 'Button' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { label: 'Button', size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { label: 'Button', variant } }]),
    ...variants.map((variant: string) => [`with gray variant ${variant}`, { props: { label: 'Button', variant, color: 'gray' } }]),
    ['with icon', { props: { icon: 'i-heroicons-rocket-launch' } }],
    ['with leading and icon', { props: { leading: true, icon: 'i-heroicons-arrow-left' } }],
    ['with leadingIcon', { props: { leadingIcon: 'i-heroicons-arrow-left' } }],
    ['with trailing and icon', { props: { trailing: true, icon: 'i-heroicons-arrow-right' } }],
    ['with trailingIcon', { props: { trailingIcon: 'i-heroicons-arrow-right' } }],
    ['with loading', { props: { loading: true } }],
    ['with loadingIcon', { props: { loading: true, loadingIcon: 'i-heroicons-sparkles' } }],
    ['with disabled', { props: { label: 'Button', disabled: true } }],
    ['with disabled and with link', { props: { label: 'Button', disabled: true, to: '/link' } }],
    ['with block', { props: { label: 'Button', block: true } }],
    ['with square', { props: { label: 'Button', square: true } }],
    ['with class', { props: { class: 'rounded-full font-bold' } }],
    ['with ui', { props: { ui: { label: 'font-bold' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ButtonProps, slots?: Partial<ButtonSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Button)
    expect(html).toMatchSnapshot()
  })
})
