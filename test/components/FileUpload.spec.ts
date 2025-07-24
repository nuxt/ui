import { describe, it, expect, vi, test } from 'vitest'
import { mount } from '@vue/test-utils'
import FileUpload from '../../src/runtime/components/FileUpload.vue'
import type { FileUploadProps, FileUploadSlots } from '../../src/runtime/components/FileUpload.vue'
import ComponentRender from '../component-render'
import { renderForm } from '../utils/form'
import type { FormInputEvents } from '../../src/module'
import theme from '#build/ui/file-upload'

// Mock URL.createObjectURL to return deterministic blob URLs
URL.createObjectURL = vi.fn((file: File | Blob) => {
  if (file instanceof File) {
    return `blob:mock-url-${file.name}`
  }
  return 'blob:mock-url-blob'
})

async function setFilesOnInput(input: any, files: File[]) {
  // Create a DataTransfer and add files
  const data = new DataTransfer()
  files.forEach(file => data.items.add(file))
  // Set files property via Object.defineProperty
  Object.defineProperty(input.element, 'files', {
    value: data.files,
    writable: false,
    configurable: true
  })
  // Trigger change event
  await input.trigger('change')
}

describe('FileUpload', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any
  const layouts = Object.keys(theme.variants.layout) as any
  const positions = Object.keys(theme.variants.position) as any

  const modelValue = [new File([], 'file.txt', { type: 'text/plain' })]

  const props = { modelValue }

  it.each([
    // Props
    ['with modelValue', { props }],
    ['with id', { props: { id: 'id' } }],
    ['with name', { props: { name: 'name' } }],
    ['with icon', { props: { icon: 'i-lucide-image' } }],
    ['with label', { props: { label: 'Drop your image here' } }],
    ['with description', { props: { description: 'SVG, PNG, JPG or GIF (max. 2MB)' } }],
    ['with neutral color', { props: { color: 'neutral' } }],
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { ...props, variant } }]),
    ...layouts.map((layout: string) => [`with layout ${layout}`, { props: { ...props, layout } }]),
    ...layouts.map((layout: string) => [`with layout ${layout} multiple`, { props: { ...props, layout, multiple: true } }]),
    ...positions.map((position: string) => [`with position ${position}`, { props: { ...props, position } }]),
    ...positions.map((position: string) => [`with position ${position} multiple`, { props: { ...props, position, multiple: true } }]),
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ...sizes.map((size: string) => [`with size ${size} variant button`, { props: { ...props, size, variant: 'button' } }]),
    ['with required', { props: { required: true } }],
    ['with disabled', { props: { disabled: true } }],
    ['with accept', { props: { accept: 'image/*' } }],
    ['with multiple', { props: { ...props, multiple: true } }],
    ['without dropzone', { props: { dropzone: false } }],
    ['without interactive', { props: { interactive: false } }],
    ['with required', { props: { required: true } }],
    ['with disabled', { props: { disabled: true } }],
    ['with fileIcon', { props: { ...props, fileIcon: 'i-lucide-house' } }],
    ['with fileDelete', { props: { ...props, fileDelete: { color: 'primary' } } }],
    ['with fileDeleteIcon', { props: { ...props, fileDeleteIcon: 'i-lucide-trash' } }],
    ['with ariaLabel', { attrs: { 'aria-label': 'Aria label' } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'w-full gap-4' } }],
    ['with ui', { props: { ui: { base: 'rounded-xl' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with label slot', { props, slots: { label: () => 'Label slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }],
    ['with actions slot', { props, slots: { actions: () => 'Actions slot' } }],
    ['with files slot', { props, slots: { files: () => 'Files slot' } }],
    ['with files-top slot', { props, slots: { 'files-top': () => 'Files top slot' } }],
    ['with files-bottom slot', { props, slots: { 'files-bottom': () => 'Files bottom slot' } }],
    ['with file slot', { props, slots: { file: () => 'File slot' } }],
    ['with file-leading slot', { props, slots: { 'file-leading': () => 'File leading slot' } }],
    ['with file-name slot', { props, slots: { 'file-name': () => 'File name slot' } }],
    ['with file-size slot', { props, slots: { 'file-size': () => 'File size slot' } }],
    ['with file-trailing slot', { props, slots: { 'file-trailing': () => 'File trailing slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: FileUploadProps, slots?: Partial<FileUploadSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, FileUpload)
    expect(html).toMatchSnapshot()
  })

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = mount(FileUpload)
      const input = wrapper.find('input')
      const file1 = new File(['foo'], 'file1.txt', { type: 'text/plain' })
      const file2 = new File(['bar'], 'file2.txt', { type: 'text/plain' })
      await setFilesOnInput(input, [file1, file2])
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    test('change event', async () => {
      const wrapper = mount(FileUpload)
      const input = wrapper.find('input')
      const file1 = new File(['foo'], 'file1.txt', { type: 'text/plain' })
      const file2 = new File(['bar'], 'file2.txt', { type: 'text/plain' })
      await setFilesOnInput(input, [file1, file2])
      expect(wrapper.emitted('change')).toBeTruthy()
    })
  })

  describe.skip('form integration', async () => {
    async function createForm(validateOn?: FormInputEvents[]) {
      const wrapper = await renderForm({
        props: {
          validateOn,
          validateOnInputDelay: 0,
          async validate(state: any) {
            const files = Array.isArray(state.value) ? state.value : []
            if (!files.length || files.some((f: any) => f.file.name !== 'valid')) {
              return [{ name: 'value', message: 'Error message' }]
            }
            return []
          }
        },
        slotTemplate: `
        <UFormField name="value">
          <UFileUpload v-model="state.value" id="input" />
        </UFormField>
        `
      })
      const input = wrapper.find('#input')
      return {
        wrapper,
        input
      }
    }

    test('validate on change works', async () => {
      const { input, wrapper } = await createForm(['change'])
      await setFilesOnInput(input, [new File(['foo'], 'invalid.txt', { type: 'text/plain' })])
      await input.trigger('change')
      expect(wrapper.text()).toContain('Error message')

      await setFilesOnInput(input, [new File(['foo'], 'valid', { type: 'text/plain' })])
      await input.trigger('change')
      expect(wrapper.text()).not.toContain('Error message')
    })

    test('validate on input works', async () => {
      const { input, wrapper } = await createForm(['input'])
      await setFilesOnInput(input, [new File(['foo'], 'invalid.txt', { type: 'text/plain' })])
      expect(wrapper.text()).toContain('Error message')

      await setFilesOnInput(input, [new File(['foo'], 'valid', { type: 'text/plain' })])
      expect(wrapper.text()).not.toContain('Error message')
    })
  })
})
