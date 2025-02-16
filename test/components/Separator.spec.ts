import { describe, it, expect } from 'vitest'
import Separator, { type SeparatorProps, type SeparatorSlots } from '../../src/runtime/components/Separator.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/separator'

describe('Separator', () => {
  const types = Object.keys(theme.variants.type) as any
  const sizes = Object.keys(theme.variants.size) as any

  it.each([
    // Props
    ['with label', { props: { label: '+1' } }],
    ['with icon', { props: { icon: 'i-lucide-image' } }],
    ['with avatar', { props: { avatar: { src: 'https://github.com/benjamincanac.png' } } }],
    ['with orientation vertical', { props: { orientation: 'vertical' as const } }],
    ['with decorative', { props: { decorative: true } }],
    ...types.map((type: string) => [`with type ${type}`, { props: { type } }]),
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ['with color primary', { props: { color: 'primary' } }],
    ['with as', { props: { as: 'span' } }],
    ['with class', { props: { class: 'flex-row-reverse' } }],
    ['with ui', { props: { ui: { label: 'text-lg' } } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: SeparatorProps, slots?: Partial<SeparatorSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Separator)
    expect(html).toMatchSnapshot()
  })
})
