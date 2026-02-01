import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Chip from '../../src/runtime/components/Chip.vue'
import type { ChipProps, ChipSlots } from '../../src/runtime/components/Chip.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/chip'
import { UTheme } from '#components'

describe('Chip', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const positions = Object.keys(theme.variants.position) as any

  it.each([
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
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ChipProps, slots?: Partial<ChipSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Chip)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Chip, {
      props: {
        text: 'Text'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  test('with theme works', async () => {
    const wrapper = await mountSuspended({
      components: { Chip, UTheme },
      template: `
        <UTheme :theme="{ chip: { slots: { base: 'test-theme-class' } } }">
          <Chip text="5" />
        </UTheme>
      `
    })

    expect(wrapper.find('span').classes()).toContain('test-theme-class')
  })
})
