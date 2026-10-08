import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Sidebar from '../../src/runtime/components/Sidebar.vue'
import Slideover from '../../src/runtime/components/Slideover.vue'
import { renderEach } from '../component-render'
import theme from '#build/ui/sidebar'

describe('Sidebar', () => {
  const variants = Object.keys(theme.variants.variant) as any
  const collapsibles = Object.keys(theme.variants.collapsible) as any
  const sides = Object.keys(theme.variants.side) as any
  const breakpoints = Object.keys(theme.variants.breakpoint) as any

  renderEach(Sidebar, [
    // Props
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { variant } }]),
    ...collapsibles.map((collapsible: string) => [`with collapsible ${collapsible}`, { props: { collapsible } }]),
    ...sides.map((side: string) => [`with side ${side}`, { props: { side } }]),
    ...breakpoints.map((breakpoint: string) => [`with breakpoint ${breakpoint}`, { props: { breakpoint } }]),
    ['with title', { props: { title: 'Sidebar Title' } }],
    ['with description', { props: { title: 'Sidebar Title', description: 'Sidebar Description' } }],
    ['with close', { props: { title: 'Sidebar Title', close: true, collapsible: 'icon' as const } }],
    ['with mode modal', { props: { mode: 'modal' as const, menu: { portal: false } } }],
    ['with mode slideover', { props: { mode: 'slideover' as const, menu: { portal: false } } }],
    ['with mode drawer', { props: { mode: 'drawer' as const, menu: { portal: false } } }],
    ...collapsibles.filter((c: string) => c !== 'none').map((collapsible: string) => [`with collapsed ${collapsible}`, { props: { open: false, collapsible } }]),
    ['with rail', { props: { rail: true, collapsible: 'icon' as const } }],
    ['with class', { props: { class: 'bg-elevated/50' } }],
    ['with ui', { props: { ui: { body: 'py-0' } } }],
    // Slots
    ['with header slot', { slots: { header: () => 'Header slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with actions slot', { slots: { actions: () => 'Actions slot' } }],
    ['with footer slot', { slots: { footer: () => 'Footer slot' } }],
    ['with content slot', { slots: { content: () => 'Content slot' } }]
  ])

  it('mounts the mobile menu once opened', async () => {
    const wrapper = await mountSuspended(Sidebar, { props: { open: false, breakpoint: '2xl', menu: { portal: false } }, slots: { default: () => 'Default slot' } })

    expect(wrapper.findComponent(Slideover).exists()).toBe(false)

    await wrapper.setProps({ open: true })
    await vi.dynamicImportSettled()

    expect(wrapper.find('[role="dialog"]').text()).toContain('Default slot')
  })

  it('mounts the mobile menu before opening with `unmountOnHide: false`', async () => {
    const wrapper = await mountSuspended(Sidebar, { props: { breakpoint: '2xl', menu: { portal: false, unmountOnHide: false } }, slots: { default: () => 'Default slot' } })
    await vi.dynamicImportSettled()

    expect(wrapper.find('[role="dialog"]').text()).toContain('Default slot')
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Sidebar, {
      props: {
        variant: 'sidebar',
        collapsible: 'icon'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
