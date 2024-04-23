import { describe, it, expect } from 'vitest'
import DropdownMenu, { type DropdownMenuProps, type DropdownMenuSlots } from '../../src/runtime/components/DropdownMenu.vue'
import ComponentRender from '../component-render'

describe('DropdownMenu', () => {
  const items = [{
    label: 'Profile',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    }
  }, {
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    kbds: ['E']
  }, {
    label: 'Duplicate',
    icon: 'i-heroicons-document-duplicate-20-solid',
    kbds: ['D'],
    disabled: true,
    slot: 'custom'
  }]

  const props = { open: true, portal: false, items }

  it.each([
    // Props
    ['with items', { props }],
    ['with class', { props: { ...props, class: 'min-w-96' } }],
    ['with ui', { props: { ...props, ui: { linkLeadingIcon: 'size-4' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with label slot', { props, slots: { label: () => 'Label slot' } }],
    ['with trailing slot', { props, slots: { trailing: () => 'Trailing slot' } }],
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: DropdownMenuProps<typeof items[number]>, slots?: Partial<DropdownMenuSlots<typeof items[number]>> }) => {
    const html = await ComponentRender(nameOrHtml, options, DropdownMenu)
    expect(html).toMatchSnapshot()
  })
})
