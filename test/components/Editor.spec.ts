import { describe, it, expect, vi, afterEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { Editor as TiptapEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { renderEach } from '../component-render'
import Editor from '../../src/runtime/components/Editor.vue'

describe('Editor', () => {
  const props = {}

  renderEach(Editor, [
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with placeholder', { props: { placeholder: 'Write something...' } }],
    ['with class', { props: { class: 'min-h-80' } }],
    ['with ui', { props: { ui: { base: 'sm:px-14' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Editor, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()

    wrapper.unmount()
  })

  describe('with an external editor', () => {
    const editors: TiptapEditor[] = []
    const createEditor = (content = '<p>External content</p>', options = {}) => {
      const editor = new TiptapEditor({ extensions: [StarterKit], content, ...options })
      editors.push(editor)
      return editor
    }

    afterEach(() => {
      editors.splice(0).forEach(editor => editor.destroy())
    })

    it('renders the provided editor as a shell', async () => {
      const editor = createEditor()
      const wrapper = await mountSuspended(Editor, { props: { editor } })

      expect(wrapper.find('.ProseMirror').exists()).toBe(true)
      expect(wrapper.text()).toContain('External content')

      wrapper.unmount()
    })

    it('injects the theme base classes into the external editor', async () => {
      const editor = createEditor()
      const wrapper = await mountSuspended(Editor, { props: { editor } })

      const injected = (editor.options.editorProps?.attributes as Record<string, string> | undefined)?.class
      expect(injected).toContain('outline-none')

      wrapper.unmount()
    })

    it('does not inject editorProps when opted out with `editor-props` false', async () => {
      const editor = createEditor('<p>External content</p>', {
        editorProps: { attributes: { class: 'custom-class' } }
      })
      const wrapper = await mountSuspended(Editor, { props: { editor, editorProps: false } })

      const injected = (editor.options.editorProps?.attributes as Record<string, string> | undefined)?.class
      expect(injected).toBe('custom-class')
      expect(injected).not.toContain('outline-none')

      wrapper.unmount()
    })

    it('ignores engine props (content owned by the external editor)', async () => {
      // Silence the dev-only warning about inert props.
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const editor = createEditor('<p>External content</p>')
      const wrapper = await mountSuspended(Editor, {
        props: { editor, modelValue: 'ignored value', contentType: 'html' as const }
      })

      // The external editor's content is used; engine props are inert.
      expect(wrapper.text()).toContain('External content')
      expect(wrapper.text()).not.toContain('ignored value')

      warn.mockRestore()
      wrapper.unmount()
    })

    it('renders the fallback slot until the external editor is ready', async () => {
      const wrapper = await mountSuspended(Editor, {
        props: { editor: undefined },
        slots: { fallback: () => 'Loading editor…' }
      })

      expect(wrapper.text()).toContain('Loading editor…')
      expect(wrapper.find('.ProseMirror').exists()).toBe(false)

      await wrapper.setProps({ editor: createEditor('<p>Now ready</p>') })
      await flushPromises()

      expect(wrapper.find('.ProseMirror').exists()).toBe(true)
      expect(wrapper.text()).toContain('Now ready')

      wrapper.unmount()
    })
  })
})
