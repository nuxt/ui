import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import EditorSuggestionMenu from '../../src/runtime/components/EditorSuggestionMenu.vue'

describe('EditorSuggestionMenu', () => {
  it('renders an accessible listbox', async ({ onTestFinished }) => {
    const container = document.createElement('div')
    const element = document.createElement('div')
    container.appendChild(element)
    document.body.appendChild(container)
    onTestFinished(() => container.remove())

    const editor = new Editor({ element, extensions: [StarterKit] })
    onTestFinished(() => editor.destroy())

    const wrapper = await mountSuspended(EditorSuggestionMenu, {
      props: {
        editor,
        items: [[
          { type: 'label', label: 'Style' },
          { kind: 'paragraph', label: 'Paragraph' },
          { kind: 'heading', level: 1, label: 'Heading 1' }
        ], [
          { type: 'label', label: 'Insert' },
          { kind: 'horizontalRule', label: 'Divider' },
          { type: 'separator' },
          { kind: 'blockquote', label: 'Quote' }
        ]]
      }
    })
    onTestFinished(() => wrapper.unmount())

    await vi.waitFor(() => expect(editor.state.plugins.some(plugin => (plugin as any).key.startsWith('suggestionMenu'))).toBe(true))
    editor.commands.focus()
    editor.commands.insertContent('/')

    const listbox = await vi.waitFor(() => {
      const el = container.querySelector('[role=listbox]')
      expect(el).not.toBeNull()
      return el as HTMLElement
    })

    expect(listbox.getAttribute('aria-label')).toBe('Suggestions')

    const groups = listbox.querySelectorAll('[role=group]')
    expect(groups).toHaveLength(2)
    expect([...groups].map(group => document.getElementById(group.getAttribute('aria-labelledby')!)?.textContent)).toEqual(['Style', 'Insert'])

    expect(listbox.querySelector('[role=separator]')).toBeNull()

    expect(await axe(listbox)).toHaveNoViolations()
  })
})
