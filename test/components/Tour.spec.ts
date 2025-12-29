import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Tour from '../../src/runtime/components/Tour.vue'
import type { TourProps, TourSlots } from '../../src/runtime/components/Tour.vue'
import ComponentRender from '../component-render'

describe('Tour', () => {
  const steps = [
    {
      target: '#test-target',
      title: 'Step 1',
      description: 'First step description',
      body: 'Step body content'
    },
    {
      target: '#test-target-2',
      title: 'Step 2',
      description: 'Second step description'
    }
  ]

  const props = { open: true, portal: false, steps }

  it.each([
    // Props
    ['with open', { props }],
    ['with initialStep', { props: { ...props, initialStep: 1 } }],
    ['with loop', { props: { ...props, loop: true } }],
    ['without arrow', { props: { ...props, arrow: false } }],
    ['without close', { props: { ...props, close: false } }],
    ['without dismissible', { props: { ...props, dismissible: false } }],
    ['with class', { props: { ...props, class: 'shadow-xl' } }],
    ['with ui', { props: { ...props, ui: { content: 'shadow-xl' } } }],
    // Steps with custom props
    ['with step arrow', { props: { ...props, steps: [{ target: '#test-target', title: 'Step', arrow: false }] } }],
    ['with step nextLabel', { props: { ...props, steps: [{ target: '#test-target', title: 'Step', nextLabel: 'Continue' }] } }],
    ['with step prevLabel', { props: { ...props, steps: [{ target: '#test-target', title: 'Step', prevLabel: 'Back' }] } }],
    ['with step finishLabel', { props: { ...props, steps: [{ target: '#test-target', title: 'Step', finishLabel: 'Done' }] } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }],
    ['with body slot', { props, slots: { body: () => 'Body slot' } }],
    ['with footer slot', { props, slots: { footer: () => 'Footer slot' } }],
    ['with actions slot', { props, slots: { actions: () => 'Actions slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: TourProps, slots?: Partial<TourSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Tour)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Tour, {
      props: {
        open: true,
        portal: false,
        steps: [
          {
            target: '#test-target',
            title: 'Tour Step',
            description: 'This is a tour step description',
            body: 'Additional body content'
          }
        ]
      }
    })

    expect(await axe(wrapper.element, {
      rules: {
        // RekaUI does not handle nor check for aria-dialog-name in their tests either
        'aria-dialog-name': {
          enabled: false
        }
      }
    })).toHaveNoViolations()
  })
})
