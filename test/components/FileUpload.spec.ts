import { describe, it, expect } from 'vitest'
import FileUpload from '../../src/runtime/components/FileUpload.vue'
import type { FileUploadProps, FileUploadSlots } from '../../src/runtime/components/FileUpload.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/file-upload'

describe('FileUpload', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any
  const layouts = Object.keys(theme.variants.layout) as any

  const modelValue = [new File(['foo'], 'file1.txt', { type: 'text/plain' })]

  it.each([
    // Props
    ['with id', { props: { id: 'id' } }],
    ['with name', { props: { name: 'name' } }],
    ['with icon', { props: { icon: 'i-lucide-image' } }],
    ['with label', { props: { label: 'Drop your image here' } }],
    ['with description', { props: { description: 'SVG, PNG, JPG or GIF (max. 2MB)' } }],
    ['with neutral color', { props: { color: 'neutral' } }],
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { variant } }]),
    ...layouts.map((layout: string) => [`with layout ${layout}`, { props: { layout } }]),
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ['with required', { props: { required: true } }],
    ['with disabled', { props: { disabled: true } }],
    ['with accept', { props: { accept: 'image/*' } }],
    ['with multiple', { props: { multiple: true } }],
    ['without dropzone', { props: { dropzone: false } }],
    ['without interactive', { props: { interactive: false } }],
    ['with required', { props: { required: true } }],
    ['with disabled', { props: { disabled: true } }],
    ['with fileIcon', { props: { modelValue, fileIcon: 'i-lucide-house' } }],
    ['with fileDelete', { props: { modelValue, fileDelete: { color: 'primary' } } }],
    ['with fileDeleteIcon', { props: { modelValue, fileDeleteIcon: 'i-lucide-trash' } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'w-full gap-4' } }],
    ['with ui', { props: { ui: { base: 'rounded-xl' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with label slot', { slots: { label: () => 'Label slot' } }],
    ['with description slot', { slots: { description: () => 'Description slot' } }],
    ['with actions slot', { slots: { actions: () => 'Actions slot' } }],
    ['with files slot', { props: { modelValue }, slots: { files: () => 'Files slot' } }],
    ['with files-top slot', { props: { modelValue }, slots: { 'files-top': () => 'Files top slot' } }],
    ['with files-bottom slot', { props: { modelValue }, slots: { 'files-bottom': () => 'Files bottom slot' } }],
    ['with file slot', { props: { modelValue }, slots: { file: () => 'File slot' } }],
    ['with file-leading slot', { props: { modelValue }, slots: { 'file-leading': () => 'File leading slot' } }],
    ['with file-name slot', { props: { modelValue }, slots: { 'file-name': () => 'File name slot' } }],
    ['with file-size slot', { props: { modelValue }, slots: { 'file-size': () => 'File size slot' } }],
    ['with file-trailing slot', { props: { modelValue }, slots: { 'file-trailing': () => 'File trailing slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: FileUploadProps, slots?: Partial<FileUploadSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, FileUpload)
    expect(html).toMatchSnapshot()
  })
})
