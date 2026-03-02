import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Header from '../../src/runtime/components/Header.vue'

describe('Header', () => {
  renderEach(Header, [
    // Props
    ['with title', { props: { title: 'Documentation' } }],
    ['with to', { props: { to: '/docs' } }],
    ['with mode modal', { props: { open: true, mode: 'modal', menu: { portal: false } } }],
    ['with mode slideover', { props: { open: true, mode: 'slideover', menu: { portal: false } } }],
    ['with mode drawer', { props: { open: true, mode: 'drawer', menu: { portal: false } } }],
    ['without toggle', { props: { toggle: false } }],
    ['with toggle', { props: { toggle: { color: 'primary', variant: 'solid' } } }],
    ['with toggleSide', { props: { toggleSide: 'left' } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'border-b-0' } }],
    ['with ui', { props: { ui: { container: 'gap-1.5' } } }],
    // Slots
    ['with title slot', { slots: { title: () => 'Title slot' } }],
    ['with left slot', { slots: { left: () => 'Left slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with right slot', { slots: { right: () => 'Right slot' } }],
    ['with toggle slot', { slots: { toggle: () => 'Toggle slot' } }],
    ['with top slot', { slots: { top: () => 'Top slot' } }],
    ['with bottom slot', { slots: { bottom: () => 'Bottom slot' } }],
    ['with body slot', { slots: { body: () => 'Body slot' } }],
    ['with content slot', { slots: { content: () => 'Content slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Header, {
      props: {
        title: 'Documentation',
        to: '/docs'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
