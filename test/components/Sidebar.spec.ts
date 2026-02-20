import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Sidebar from '../../src/runtime/components/Sidebar.vue'
import type { SidebarProps, SidebarSlots } from '../../src/runtime/components/Sidebar.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/sidebar'

describe('Sidebar', () => {
  const variants = Object.keys(theme.variants.variant) as any
  const collapsibles = Object.keys(theme.variants.collapsible) as any
  const sides = Object.keys(theme.variants.side) as any

  it.each([
    // Props
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { variant } }]),
    ...collapsibles.map((collapsible: string) => [`with collapsible ${collapsible}`, { props: { collapsible } }]),
    ...sides.map((side: string) => [`with side ${side}`, { props: { side } }]),
    ['with title', { props: { title: 'Sidebar Title' } }],
    ['with description', { props: { title: 'Sidebar Title', description: 'Sidebar Description' } }],
    ['with close', { props: { title: 'Sidebar Title', close: true, collapsible: 'icon' as const } }],
    ['with mode modal', { props: { mode: 'modal' as const, menu: { portal: false } } }],
    ['with mode slideover', { props: { mode: 'slideover' as const, menu: { portal: false } } }],
    ['with mode drawer', { props: { mode: 'drawer' as const, menu: { portal: false } } }],
    ...collapsibles.filter((c: string) => c !== 'none').map((collapsible: string) => [`with collapsed ${collapsible}`, { props: { open: false, collapsible } }]),
    ['with class', { props: { class: 'custom-class' } }],
    ['with ui', { props: { ui: { body: 'py-4' } } }],
    // Slots
    ['with header slot', { slots: { header: () => 'Header slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with body slot', { slots: { body: () => 'Body slot' } }],
    ['with actions slot', { slots: { actions: () => 'Actions slot' } }],
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
