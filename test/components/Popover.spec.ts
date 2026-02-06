import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Popover from '../../src/runtime/components/Popover.vue'
import type { PopoverProps, PopoverSlots } from '../../src/runtime/components/Popover.vue'
import ComponentRender from '../component-render'

describe('Popover', () => {
  const props = { open: true, portal: false }

  it.each([
    // Props
    ['with open', { props }],
    ['with arrow', { props: { ...props, arrow: true } }],
    ['with class', { props: { ...props, class: 'shadow-xl' } }],
    ['with ui', { props: { ...props, ui: { content: 'shadow-xl' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }],
    ['with anchor slot', { props, slots: { anchor: () => 'Anchor slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PopoverProps, slots?: Partial<PopoverSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Popover)
    expect(html).toMatchSnapshot()
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
