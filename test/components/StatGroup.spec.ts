import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import StatGroup from '../../src/runtime/components/StatGroup.vue'
import type { StatGroupProps, StatGroupSlots } from '../../src/runtime/components/StatGroup.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/stat-group'

describe('StatGroup', () => {
  const gaps = Object.keys(theme.variants.gap) as any

  it.each([
    // Props
    ['with title', { props: { title: 'Dashboard' } }],
    ['with cols 1', { props: { cols: 1 } }],
    ['with cols 2', { props: { cols: 2 } }],
    ['with cols 3', { props: { cols: 3 } }],
    ['with cols 4', { props: { cols: 4 } }],
    ...gaps.map((gap: string) => [`with gap ${gap}`, { props: { gap } }]),
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'w-full' } }],
    ['with ui', { props: { ui: { root: 'p-4' } } }],
    // Slots
    ['with title slot', { slots: { title: () => 'Custom Title' } }],
    ['with actions slot', { slots: { actions: () => 'Actions' } }],
    ['with header slot', { slots: { header: () => 'Custom Header' } }],
    ['with default slot', { slots: { default: () => 'Content' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: StatGroupProps, slots?: Partial<StatGroupSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, StatGroup)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(StatGroup, {
      props: {
        title: 'Dashboard Overview'
      },
      slots: {
        header: () => 'Custom Header',
        title: () => 'Custom Title',
        actions: () => 'Actions',
        default: () => 'Content'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
