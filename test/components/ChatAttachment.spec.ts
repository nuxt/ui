import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ChatAttachment from '../../src/runtime/components/ChatAttachment.vue'
import { renderEach } from '../component-render'
import theme from '#build/ui/chat-attachment'

describe('ChatAttachment', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const orientations = Object.keys(theme.variants.orientation) as any

  const props = { name: 'report.pdf', type: 'application/pdf' }
  const image = { name: 'photo.png', type: 'image/png', url: 'https://picsum.photos/200' }

  renderEach(ChatAttachment, [
    // Props
    ['with name', { props }],
    ['with image', { props: image }],
    ['with description', { props: { ...props, description: 'Upload failed' } }],
    ['with status uploading', { props: { ...props, status: 'uploading' } }],
    ['with status error', { props: { ...props, status: 'error' } }],
    ['with image status uploading', { props: { ...image, status: 'uploading' } }],
    ['with removable', { props: { ...props, removable: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ...orientations.map((orientation: string) => [`with orientation ${orientation}`, { props: { ...image, orientation, removable: true } }]),
    ['with icon', { props: { ...props, icon: 'i-lucide-file-text' } }],
    ['with errorIcon', { props: { ...props, status: 'error', errorIcon: 'i-lucide-circle-x' } }],
    ['with loadingIcon', { props: { ...props, status: 'uploading', loadingIcon: 'i-lucide-loader' } }],
    ['with removeIcon', { props: { ...props, removable: true, removeIcon: 'i-lucide-trash' } }],
    ['with as', { props: { ...props, as: 'li' } }],
    ['with class', { props: { ...props, class: 'w-40' } }],
    ['with ui', { props: { ...props, ui: { name: 'font-medium' } } }]
  ])

  it('reads the name and size from the file', async () => {
    const wrapper = await mountSuspended(ChatAttachment, {
      props: { file: new File(['a'.repeat(2048)], 'notes.txt', { type: 'text/plain' }) }
    })

    expect(wrapper.find('[data-slot="name"]').text()).toBe('notes.txt')
    expect(wrapper.find('[data-slot="description"]').text()).toBe('TXT · 2KB')
  })

  it('emits remove when the remove button is clicked', async () => {
    const wrapper = await mountSuspended(ChatAttachment, {
      props: { ...props, removable: true }
    })

    const button = wrapper.find('[data-slot="remove"]')
    expect(button.attributes('aria-label')).toBe('Remove report.pdf')

    await button.trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ChatAttachment, {
      props: { ...image, removable: true }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
