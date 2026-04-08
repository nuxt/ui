import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, nextTick, ref } from 'vue'
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

  it('avoids serializing markdown twice for internal v-model updates', async () => {
    const wrapper = await mountSuspended(defineComponent({
      components: { Editor },
      setup() {
        const modelValue = ref('# Nuxt UI\n\nEditor content')

        return {
          modelValue
        }
      },
      template: '<Editor v-model="modelValue" content-type="markdown" />'
    }))

    const editorWrapper = (wrapper as any).getComponent(Editor)
    const exposedEditor = (editorWrapper.vm as { editor?: any }).editor
    const editor = exposedEditor?.commands ? exposedEditor : exposedEditor?.value

    expect(editor).toBeTruthy()

    const getMarkdown = vi.spyOn(editor, 'getMarkdown')
    getMarkdown.mockClear()

    editor.commands.setContent('# Nuxt UI', { contentType: 'markdown' })

    await nextTick()
    await nextTick()

    expect(getMarkdown).toHaveBeenCalledTimes(1)
  })
})
