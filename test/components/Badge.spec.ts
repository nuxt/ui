import { describe, it, expect } from 'vitest'
import Badge, { type BadgeProps, type BadgeSlots } from '../../src/runtime/components/Badge.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/badge'

describe('Badge', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any

  it.each([
    // Props
    ['with label', { props: { label: 'Badge' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { label: 'Badge', size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { label: 'Badge', variant } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { label: 'Badge', variant, color: 'neutral' } }]),
    ['with icon', { props: { icon: 'i-lucide-rocket' } }],
    ['with leading and icon', { props: { leading: true, icon: 'i-lucide-arrow-left' } }],
    ['with leadingIcon', { props: { leadingIcon: 'i-lucide-arrow-left' } }],
    ['with trailing and icon', { props: { trailing: true, icon: 'i-lucide-arrow-right' } }],
    ['with trailingIcon', { props: { trailingIcon: 'i-lucide-arrow-right' } }],
    ['with avatar', { props: { avatar: { src: 'https://github.com/benjamincanac.png' } } }],
    ['with avatar and leadingIcon', { props: { avatar: { src: 'https://github.com/benjamincanac.png' }, leadingIcon: 'i-lucide-arrow-left' } }],
    ['with avatar and trailingIcon', { props: { avatar: { src: 'https://github.com/benjamincanac.png' }, trailingIcon: 'i-lucide-arrow-right' } }],
    ['with as', { props: { label: 'Badge', as: 'div' } }],
    ['with class', { props: { label: 'Badge', class: 'rounded-full font-bold' } }],
    ['with ui', { props: { label: 'Badge', ui: { label: 'font-bold' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: BadgeProps, slots?: Partial<BadgeSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Badge)
    expect(html).toMatchSnapshot()
  })
})
