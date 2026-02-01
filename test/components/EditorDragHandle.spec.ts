import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import type { Editor } from '@tiptap/vue-3'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EditorDragHandle from '../../src/runtime/components/EditorDragHandle.vue'
import type { EditorDragHandleProps, EditorDragHandleSlots } from '../../src/runtime/components/EditorDragHandle.vue'
import ComponentRender from '../component-render'

describe('EditorDragHandle', () => {
  const props = { editor: { registerPlugin: vi.fn() } as unknown as Editor }

  it.each([
    // Props
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'items-start' } }],
    ['with ui', { props: { ...props, ui: { handle: 'px-4' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: EditorDragHandleProps, slots?: Partial<EditorDragHandleSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, EditorDragHandle)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(EditorDragHandle, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
