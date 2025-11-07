import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EditorDragHandle from '../../src/runtime/components/EditorDragHandle.vue'
import type { EditorDragHandleProps, EditorDragHandleSlots } from '../../src/runtime/components/EditorDragHandle.vue'
import ComponentRender from '../component-render'

describe('EditorDragHandle', () => {
  const props = {}

  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: EditorDragHandleProps, slots?: Partial<EditorDragHandleSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, EditorDragHandle)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(EditorDragHandle, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
