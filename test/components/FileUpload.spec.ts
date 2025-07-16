import { describe, it, expect } from 'vitest'
import FileUpload from '../../src/runtime/components/FileUpload.vue'
import type { FileUploadProps, FileUploadSlots } from '../../src/runtime/components/FileUpload.vue'
import ComponentRender from '../component-render'

describe('FileUpload', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: FileUploadProps, slots?: Partial<FileUploadSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, FileUpload)
    expect(html).toMatchSnapshot()
  })
})
