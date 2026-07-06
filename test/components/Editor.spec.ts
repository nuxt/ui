import { describe, it, expect, vi, afterEach } from 'vitest'
import { shallowRef } from 'vue'
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

  it('applies the prose classes on the content wrapper', async () => {
    const wrapper = await mountSuspended(Editor, { props })

    const content = wrapper.find('[data-slot="content"]')
    expect(content.classes()).toContain('[&_:where(.ProseMirror_p)]:leading-7')

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

    it('never mutates the external editor options', async () => {
      const editorProps = { attributes: { class: 'custom-class' } }
      const editor = createEditor('<p>External content</p>', { editorProps })
      // `options.element` is set by `EditorContent` when mounting the editor.
      const { element: _, ...originalOptions } = { ...editor.options }
      const wrapper = await mountSuspended(Editor, { props: { editor } })

      expect(editor.options.editorProps).toBe(editorProps)
      const { element: __, ...currentOptions } = { ...editor.options }
      expect(currentOptions).toEqual(originalOptions)

      wrapper.unmount()
    })

    it('applies the prose classes on the content wrapper', async () => {
      const editor = createEditor()
      const wrapper = await mountSuspended(Editor, { props: { editor } })

      const content = wrapper.find('[data-slot="content"]')
      expect(content.classes()).toContain('[&_:where(.ProseMirror_p)]:leading-7')

      wrapper.unmount()
    })

    it('does not apply the prose classes with `prose` false', async () => {
      const editor = createEditor()
      const wrapper = await mountSuspended(Editor, { props: { editor, prose: false } })

      const content = wrapper.find('[data-slot="content"]')
      expect(content.classes()).not.toContain('[&_:where(.ProseMirror_p)]:leading-7')

      wrapper.unmount()
    })

    it('applies fallthrough attributes on the content wrapper', async () => {
      const editor = createEditor()
      const wrapper = await mountSuspended(Editor, {
        props: { editor },
        attrs: { 'aria-label': 'Notes' }
      })

      expect(wrapper.find('[data-slot="content"]').attributes('aria-label')).toBe('Notes')

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

    it('does not destroy the external editor on unmount', async () => {
      const editor = createEditor()
      const wrapper = await mountSuspended(Editor, { props: { editor } })

      wrapper.unmount()

      expect(editor.isDestroyed).toBe(false)
    })

    it('accepts the editor as a ref', async () => {
      const editor = createEditor()
      const wrapper = await mountSuspended(Editor, { props: { editor: shallowRef(editor) } })

      expect(wrapper.find('.ProseMirror').exists()).toBe(true)
      expect(wrapper.text()).toContain('External content')

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
