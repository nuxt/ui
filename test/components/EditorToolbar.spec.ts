import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { computed, nextTick } from 'vue'
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

  function createMockEditor() {
    const listeners = new Map<string, Set<() => void>>()

    return {
      isEditable: true,
      registerPlugin: vi.fn(),
      on: vi.fn((event: string, callback: () => void) => {
        if (!listeners.has(event)) {
          listeners.set(event, new Set())
        }

        listeners.get(event)?.add(callback)
      }),
      off: vi.fn((event: string, callback: () => void) => {
        listeners.get(event)?.delete(callback)
      }),
      emit(event: string) {
        for (const callback of listeners.get(event) || []) {
          callback()
        }
      }
    } as unknown as Editor & { emit: (event: string) => void }
  }

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

  it('avoids recomputing handler state on unrelated rerenders', async () => {
    const editor = createMockEditor()
    const isActive = vi.fn(() => false)
    const canExecute = vi.fn(() => true)
    const isDisabled = vi.fn(() => false)

    const wrapper = await mountSuspended(EditorToolbar, {
      props: {
        editor,
        items: [[{
          'kind': 'customAction',
          'icon': 'i-lucide-wand-sparkles',
          'aria-label': 'Custom action'
        } as any]]
      },
      global: {
        provide: {
          editorHandlers: computed(() => ({
            customAction: {
              isActive,
              canExecute,
              isDisabled,
              execute: () => ({
                run: () => true
              })
            }
          }))
        }
      }
    })

    const initialIsActiveCalls = isActive.mock.calls.length
    const initialCanExecuteCalls = canExecute.mock.calls.length
    const initialIsDisabledCalls = isDisabled.mock.calls.length

    await wrapper.setProps({ class: 'overflow-x-auto' })
    await nextTick()

    expect(isActive).toHaveBeenCalledTimes(initialIsActiveCalls)
    expect(canExecute).toHaveBeenCalledTimes(initialCanExecuteCalls)
    expect(isDisabled).toHaveBeenCalledTimes(initialIsDisabledCalls)

    editor.emit('transaction')
    await nextTick()

    expect(isActive).toHaveBeenCalledTimes(initialIsActiveCalls + 1)
    expect(canExecute).toHaveBeenCalledTimes(initialCanExecuteCalls + 1)
    expect(isDisabled).toHaveBeenCalledTimes(initialIsDisabledCalls + 1)
  })
})
