import { describe, it, expect } from 'vitest'
import Avatar, { type AvatarProps, type AvatarSlots } from '../../src/runtime/components/Avatar.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/avatar'

describe('Avatar', () => {
  const sizes = Object.keys(theme.variants.size) as any

  it.each([
    // Props
    ['with src', { props: { src: 'https://github.com/benjamincanac.png' } }],
    ['with alt', { props: { alt: 'Benjamin Canac' } }],
    ['with text', { props: { text: '+1' } }],
    ['with icon', { props: { icon: 'i-lucide-image' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { src: 'https://github.com/benjamincanac.png', size } }]),
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'bg-[var(--ui-bg)]' } }],
    ['with ui', { props: { ui: { fallback: 'font-bold' } } }],
    // Slots
    ['with default slot', { slots: { default: '🇫🇷' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: AvatarProps, slots?: AvatarSlots }) => {
    const html = await ComponentRender(nameOrHtml, options, Avatar)
    expect(html).toMatchSnapshot()
  })
})
