import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Drawer from '../../src/runtime/components/Drawer.vue'
import theme from '#build/ui/drawer'

describe('Drawer', () => {
  const sides = Object.keys(theme.variants.side) as any

  const props = { open: true, portal: false }

  renderEach(Drawer, [
    // Props
    ['with title', { props: { ...props, title: 'Title' } }],
    ['with description', { props: { ...props, title: 'Title', description: 'Description' } }],
    ...sides.map((side: string) => [`with side ${side}`, { props: { ...props, side, title: 'Title', description: 'Description' } }]),
    ...sides.map((side: string) => [`with side ${side} without inset`, { props: { ...props, side, inset: false, title: 'Title', description: 'Description' } }]),
    ['with handle', { props: { ...props, handle: true, title: 'Title', description: 'Description' } }],
    ['without overlay', { props: { ...props, overlay: false, title: 'Title', description: 'Description' } }],
    ['with close', { props: { ...props, close: true, title: 'Title', description: 'Description' } }],
    ['with closeIcon', { props: { ...props, close: true, closeIcon: 'i-lucide-trash', title: 'Title', description: 'Description' } }],
    ['with class', { props: { ...props, class: 'bg-soft' } }],
    ['with ui', { props: { ...props, ui: { handle: 'w-20' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }],
    ['with header slot', { props, slots: { header: () => 'Header slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }],
    ['with actions slot', { props: { ...props, title: 'Title' }, slots: { actions: () => 'Actions slot' } }],
    ['with close slot', { props, slots: { close: () => 'Close slot' } }],
    ['with body slot', { props, slots: { body: () => 'Body slot' } }],
    ['with footer slot', { props, slots: { footer: () => 'Footer slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Drawer, {
      props: {
        open: true,
        portal: false,
        title: 'Title',
        description: 'Description'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('emits `after:leave` once the animation ends', async () => {
    const wrapper = await mountSuspended(Drawer, { props: { open: false, portal: false } })
    expect(wrapper.emitted('after:leave')).toBeUndefined()

    await wrapper.setProps({ open: true })
    await wrapper.setProps({ open: false })
    wrapper.find('[data-slot="drawer-content"]').element.dispatchEvent(new Event('transitionend'))
    expect(wrapper.emitted('after:leave')).toHaveLength(1)
  })

  it('emits `after:enter` once the open animation ends', async () => {
    const wrapper = await mountSuspended(Drawer, { props: { open: false, portal: false } })

    await wrapper.setProps({ open: true })
    expect(wrapper.emitted('after:enter')).toBeUndefined()

    wrapper.find('[data-slot="drawer-content"]').element.dispatchEvent(new Event('animationend'))
    expect(wrapper.emitted('after:enter')).toHaveLength(1)
  })
})
