import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { Editor } from '@tiptap/vue-3'
import EditorToolbar from '../../src/runtime/components/EditorToolbar.vue'
import type { EditorToolbarProps, EditorToolbarSlots } from '../../src/runtime/components/EditorToolbar.vue'
import ComponentRender from '../component-render'

describe('EditorToolbar', () => {
  const items = [[{
    'icon': 'i-lucide-heading',
    'aria-label': 'Headings',
    'content': {
      align: 'start'
    },
    'items': [{
      kind: 'heading',
      level: 1,
      icon: 'i-lucide-heading-1',
      label: 'Heading 1'
    }, {
      kind: 'heading',
      level: 2,
      icon: 'i-lucide-heading-2',
      label: 'Heading 2'
    }, {
      kind: 'heading',
      level: 3,
      icon: 'i-lucide-heading-3',
      label: 'Heading 3'
    }, {
      kind: 'heading',
      level: 4,
      icon: 'i-lucide-heading-4',
      label: 'Heading 4'
    }]
  }], [{
    'kind': 'mark',
    'mark': 'bold',
    'icon': 'i-lucide-bold',
    'aria-label': 'Bold'
  }, {
    'kind': 'mark',
    'mark': 'italic',
    'icon': 'i-lucide-italic',
    'aria-label': 'Italic'
  }, {
    'kind': 'mark',
    'mark': 'underline',
    'icon': 'i-lucide-underline',
    'aria-label': 'Underline'
  }, {
    'kind': 'mark',
    'mark': 'strike',
    'icon': 'i-lucide-strikethrough',
    'aria-label': 'Strikethrough'
  }, {
    'kind': 'mark',
    'mark': 'code',
    'icon': 'i-lucide-code',
    'aria-label': 'Code'
  }]]
  const props = { editor: { registerPlugin: vi.fn() } as unknown as Editor, items }

  it.each([
    // Props
    ['with as', { props: { ...props, as: 'section' } }],
    ['with layout bubble', { props: { ...props, layout: 'bubble' as const } }],
    ['with layout floating', { props: { ...props, layout: 'floating' as const } }],
    ['with class', { props: { ...props, class: 'overflow-x-auto' } }],
    ['with ui', { props: { ...props, ui: { separator: 'bg-default' } } }],
    // Slots
    ['with item slot', { props, slots: { item: () => 'Item slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: EditorToolbarProps, slots?: Partial<EditorToolbarSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, EditorToolbar)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(EditorToolbar, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
