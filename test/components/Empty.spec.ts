import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Empty from '../../src/runtime/components/Empty.vue'
import type { EmptyProps, EmptySlots } from '../../src/runtime/components/Empty.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/empty'

describe('Empty', () => {
  const variants = Object.keys(theme.variants.variant) as any
  const sizes = Object.keys(theme.variants.size) as any

  const props = {
    icon: 'i-lucide-file',
    title: 'Title',
    description: 'Description',
    actions: [{ icon: 'i-lucide-plus', label: 'Add' }]
  }

  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with icon', { props: { icon: 'i-lucide-file' } }],
    ['with avatar', { props: { avatar: { src: 'https://github.com/benjamincanac.png' } } }],
    ['with title', { props: { icon: 'i-lucide-file', title: 'Title' } }],
    ['with description', { props: { icon: 'i-lucide-file', title: 'Title', description: 'Description' } }],
    ['with actions', { props: { icon: 'i-lucide-file', title: 'Title', description: 'Description', actions: [{ icon: 'i-lucide-plus', label: 'Add' }] } }],
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { ...props, variant } }]),
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ['with class', { props: { ...props, class: 'gap-6' } }],
    ['with ui', { props: { ...props, ui: {} } }],
    // Slots
    ['with header slot', { props, slots: { header: () => 'Header slot' } }],
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }],
    ['with body slot', { props, slots: { body: () => 'Body slot' } }],
    ['with actions slot', { props, slots: { actions: () => 'Actions slot' } }],
    ['with footer slot', { props, slots: { footer: () => 'Footer slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: EmptyProps, slots?: Partial<EmptySlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Empty)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Empty, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
