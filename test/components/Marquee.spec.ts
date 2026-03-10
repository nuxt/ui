import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Marquee from '../../src/runtime/components/Marquee.vue'

describe('Marquee', () => {
  renderEach(Marquee, [
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'text-xl' } }],
    ['with pauseOnHover', { props: { pauseOnHover: true } }],
    ['with reverse', { props: { reverse: true } }],
    ['with orientation', { props: { orientation: 'vertical' } }],
    ['with repeat', { props: { repeat: 6 } }],
    ['with overlay off', { props: { overlay: false } }],
    ['with ui', { props: { ui: { content: 'gap-4' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Marquee, {
      slots: {
        default: () => 'Default slot'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
