import { describe, it, expect } from 'vitest'
import DropdownMenu, { type DropdownMenuProps } from '../../src/runtime/components/DropdownMenu.vue'
import ComponentRender from '../component-render'

const items = [{
  label: 'Profile',
  avatar: {
    src: 'https://avatars.githubusercontent.com/u/739984?v=4'
  }
}, {
  label: 'Edit',
  icon: 'i-heroicons-pencil-square-20-solid',
  shortcuts: ['E']
}, {
  label: 'Duplicate',
  icon: 'i-heroicons-document-duplicate-20-solid',
  shortcuts: ['D'],
  disabled: true
}]

describe('DropdownMenu', () => {
  it.each([
    ['basic case', { props: { open: true, portal: false, items } }],
    ['with class', { props: { open: true, portal: false, items, class: 'min-w-96' } }],
    ['with ui', { props: { open: true, portal: false, items, ui: { itemLeadingIcon: 'size-4' } } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: DropdownMenuProps<typeof items[number]>, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, DropdownMenu)
    expect(html).toMatchSnapshot()
  })
})
