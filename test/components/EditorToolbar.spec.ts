import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EditorToolbar from '../../src/runtime/components/EditorToolbar.vue'
import type { EditorToolbarProps, EditorToolbarSlots } from '../../src/runtime/components/EditorToolbar.vue'
import ComponentRender from '../component-render'

describe('EditorToolbar', () => {
  const props = {}

  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: EditorToolbarProps, slots?: Partial<EditorToolbarSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, EditorToolbar)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(EditorToolbar, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
