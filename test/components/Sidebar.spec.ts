import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Sidebar from '../../src/runtime/components/Sidebar.vue'
import type { SidebarProps, SidebarSlots } from '../../src/runtime/components/Sidebar.vue'
import ComponentRender from '../component-render'

describe('Sidebar', () => {
  it.each([
    // Props
    ['with variant sidebar', { props: { variant: 'sidebar' as const } }],
    ['with variant floating', { props: { variant: 'floating' as const } }],
    ['with variant inset', { props: { variant: 'inset' as const } }],
    ['with collapsible offcanvas', { props: { collapsible: 'offcanvas' as const } }],
    ['with collapsible icon', { props: { collapsible: 'icon' as const } }],
    ['with collapsible none', { props: { collapsible: 'none' as const } }],
    ['with side left', { props: { side: 'left' as const } }],
    ['with side right', { props: { side: 'right' as const } }],
    ['with title', { props: { title: 'Sidebar Title' } }],
    ['with description', { props: { title: 'Sidebar Title', description: 'Sidebar Description' } }],
    ['with close', { props: { title: 'Sidebar Title', close: true, collapsible: 'icon' as const } }],
    ['with mode modal', { props: { mode: 'modal' as const, menu: { portal: false } } }],
    ['with mode slideover', { props: { mode: 'slideover' as const, menu: { portal: false } } }],
    ['with mode drawer', { props: { mode: 'drawer' as const, menu: { portal: false } } }],
    ['with collapsed offcanvas', { props: { open: false, collapsible: 'offcanvas' as const } }],
    ['with collapsed icon', { props: { open: false, collapsible: 'icon' as const } }],
    ['with class', { props: { class: 'custom-class' } }],
    ['with ui', { props: { ui: { body: 'py-4' } } }],
    // Slots
    ['with header slot', { slots: { header: () => 'Header slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with body slot', { slots: { body: () => 'Body slot' } }],
    ['with footer slot', { slots: { footer: () => 'Footer slot' } }],
    ['with content slot', { slots: { content: () => 'Content slot' } }]
  ])('renders %s correctly', async (_: string, options: { props?: SidebarProps, slots?: Partial<SidebarSlots> }) => {
    const html = await ComponentRender(_, options, Sidebar)
    expect(html).toMatchSnapshot()
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
