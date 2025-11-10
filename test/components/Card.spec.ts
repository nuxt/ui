import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Card from '../../src/runtime/components/Card.vue'
import type { CardProps, CardSlots } from '../../src/runtime/components/Card.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/card'

describe('Card', () => {
  const variants = Object.keys(theme.variants.variant) as any
  const sizes = Object.keys(theme.variants.size) as any

  const slots = {
    default: () => 'Default slot',
    header: () => 'Header slot',
    footer: () => 'Footer slot'
  }

  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { variant } }]),
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size }, slots }]),
    ['with class', { props: { class: 'rounded-xl' } }],
    ['with ui', { props: { ui: { body: 'font-bold' } } }],
    // Slots
    ['with default slot', { slots: { default: slots.default }, props: { size: 'md' } }],
    ['with header slot', { slots: { header: slots.header }, props: { size: 'md' } }],
    ['with footer slot', { slots: { footer: slots.footer }, props: { size: 'md' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: CardProps, slots?: Partial<CardSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Card)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Card)

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
