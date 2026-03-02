import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Chip from '../../src/runtime/components/Chip.vue'
import theme from '#build/ui/chip'

describe('Chip', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const positions = Object.keys(theme.variants.position) as any

  renderEach(Chip, [
    // Props
    ['with text', { props: { text: 'Text' } }],
    ['with inset', { props: { inset: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...positions.map((position: string) => [`with position ${position}`, { props: { position } }]),
    ['with color neutral', { props: { color: 'neutral' } }],
    ['without show', { props: { show: false } }],
    ['with as', { props: { as: 'span' } }],
    ['with class', { props: { class: 'mx-auto' } }],
    ['with ui', { props: { ui: { base: 'text-muted' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with content slot', { slots: { content: () => 'Content slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Chip, {
      props: {
        text: 'Text'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
