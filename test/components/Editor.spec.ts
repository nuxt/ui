import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Editor from '../../src/runtime/components/Editor.vue'
import type { EditorProps, EditorSlots } from '../../src/runtime/components/Editor.vue'
import ComponentRender from '../component-render'

describe('Editor', () => {
  const props = {}

  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with placeholder', { props: { placeholder: 'Write something...' } }],
    ['with class', { props: { class: 'min-h-80' } }],
    ['with ui', { props: { ui: { base: 'sm:px-14' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: EditorProps, slots?: Partial<EditorSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Editor)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Editor, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()

    wrapper.unmount()
  })
})
