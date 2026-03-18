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
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()

    wrapper.unmount()
  })
})
