import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Popover from '../../src/runtime/components/Popover.vue'

const reference = { getBoundingClientRect: () => ({ x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, toJSON: () => ({}) }) as DOMRect }

describe('Popover', () => {
  const props = { open: true, portal: false }

  renderEach(Popover, [
    // Props
    ['with open', { props }],
    ['with arrow', { props: { ...props, arrow: true } }],
    ['with class', { props: { ...props, class: 'shadow-xl' } }],
    ['with ui', { props: { ...props, ui: { content: 'shadow-xl' } } }],
    ['with reference', { props: { ...props, reference }, slots: { content: () => 'Content slot' } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }],
    ['with anchor slot', { props, slots: { anchor: () => 'Anchor slot' } }]
  ])

  it('anchors the content to a custom reference without rendering a trigger', async () => {
    const wrapper = await mountSuspended(Popover, {
      props: { ...props, reference },
      slots: { content: () => 'Tour step' }
    })

    // Content renders, positioned against the reference
    expect(wrapper.find('[data-slot="content"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Tour step')

    // No trigger and no leftover anchor placeholder element
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.find('span[aria-hidden="true"]').exists()).toBe(false)
  })

  it('renders the trigger and anchors to the reference when both are provided', async () => {
    const wrapper = await mountSuspended(Popover, {
      props: { ...props, reference },
      slots: { default: () => 'Trigger', content: () => 'Anchored content' }
    })

    expect(wrapper.text()).toContain('Trigger')
    expect(wrapper.find('[data-slot="content"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Anchored content')
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Popover, {
      props: {
        open: true,
        portal: false,
        arrow: true

      },
      slots: {
        default: () => 'Default Slot',
        content: () => 'Content Slot',
        anchor: () => 'Anchor Slot'
      }
    })

    expect(await axe(wrapper.element, {
      rules: {
        // RekaUI does not handle nor check for aria-dialog-name in their tests either
        // https://github.com/unovue/reka-ui/blob/v2/packages/core/src/Popover/Popover.test.ts
        'aria-dialog-name': {
          enabled: false
        }
      }
    })).toHaveNoViolations()
  })
})
