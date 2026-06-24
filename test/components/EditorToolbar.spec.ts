import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import type { Editor } from '@tiptap/vue-3'
import EditorToolbar from '../../src/runtime/components/EditorToolbar.vue'

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

  renderEach(EditorToolbar, [
    // Props
    ['with as', { props: { ...props, as: 'section' } }],
    ['with layout bubble', { props: { ...props, layout: 'bubble' } }],
    ['with layout floating', { props: { ...props, layout: 'floating' } }],
    ['with class', { props: { ...props, class: 'overflow-x-auto' } }],
    ['with ui', { props: { ...props, ui: { separator: 'bg-default' } } }],
    // Slots
    ['with item slot', { props, slots: { item: () => 'Item slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(EditorToolbar, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
