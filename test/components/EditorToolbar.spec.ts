import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { Editor } from '@tiptap/vue-3'
import EditorToolbar from '../../src/runtime/components/EditorToolbar.vue'
import type { EditorToolbarProps, EditorToolbarSlots } from '../../src/runtime/components/EditorToolbar.vue'
import ComponentRender from '../component-render'

describe('EditorToolbar', () => {
  const props = { editor: { registerPlugin: vi.fn() } as unknown as Editor }

  it.each([
    // Props
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: '' } }],
    ['with ui', { props: { ...props, ui: {} } }],
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
