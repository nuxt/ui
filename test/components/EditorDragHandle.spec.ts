import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { Editor } from '@tiptap/vue-3'
import { renderEach } from '../component-render'
import EditorDragHandle from '../../src/runtime/components/EditorDragHandle.vue'

describe('EditorDragHandle', () => {
  const props = { editor: { registerPlugin: vi.fn() } as unknown as Editor }

  renderEach(EditorDragHandle, [
    // Props
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'items-start' } }],
    ['with ui', { props: { ...props, ui: { handle: 'px-4' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(EditorDragHandle, {
      props
    })

    expect(await wrapper.axe()).toHaveNoViolations()
  })
})
