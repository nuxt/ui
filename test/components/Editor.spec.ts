import { describe, it, expect, vi } from 'vitest'
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

  it('calls onCreate and onUpdate props', async () => {
    const onCreate = vi.fn()
    const onUpdate = vi.fn()
    const created = new Promise(resolve => onCreate.mockImplementation(resolve))
    const wrapper = await mountSuspended(Editor, {
      props: {
        modelValue: '<p>Hello</p>',
        onCreate,
        onUpdate
      }
    })
    const editor = wrapper.vm.editor!

    await created

    expect(onCreate).toHaveBeenCalledTimes(1)

    editor.commands.setContent('<p>Hello world</p>')

    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('update:modelValue')).toEqual([['<p>Hello world</p>']])

    wrapper.unmount()
  })
})
