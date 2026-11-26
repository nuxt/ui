import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
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
      props,
      attrs: { 'aria-label': 'Editor' }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()

    wrapper.unmount()
  })

  it('updates editability when the editable prop changes', async () => {
    const modelValue = '<p>Hello</p>'
    const wrapper = await mountSuspended(Editor, { props: { editable: false, modelValue } })
    const editor = wrapper.vm.editor!
    const content = wrapper.get('[contenteditable]')

    expect(content.attributes('contenteditable')).toBe('false')

    await wrapper.setProps({ editable: true })
    expect(content.attributes('contenteditable')).toBe('true')

    await wrapper.setProps({ editable: false })
    expect(content.attributes('contenteditable')).toBe('false')

    await wrapper.setProps({ editable: undefined })
    expect(content.attributes('contenteditable')).toBe('true')

    expect(wrapper.vm.editor).toBe(editor)
    expect(editor.getHTML()).toBe(modelValue)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    wrapper.unmount()
  })

  it('does not update the model when the document is unchanged', async () => {
    const wrapper = await mountSuspended(Editor, {
      props: {
        contentType: 'markdown',
        modelValue: '# Building Modern Interfaces with Nuxt UI',
        placeholder: 'Write something...'
      }
    })
    const editor = wrapper.vm.editor!

    editor.setEditable(false)

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    wrapper.unmount()
  })
})
