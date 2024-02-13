import { describe, it, expect } from 'vitest'
import { UNotification } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Notification', () => {
  it.each([
    ['basic case', {}],
    // ['with id', { id: 'myID' }],
    // ['with title', { title: 'Title' }],
    // ['with description', { description: 'Description' }],
    // ['with icon', { icon: 'i-heroicons-academic-cap' }],
    // ['with avatar', { avatar: { src: 'https://repository-images.githubusercontent.com/428329515/43fec891-9030-4601-8233-5d45ba5c6013', alt: 'nuxtui' } }],
    // ['with closeButton', { closeButton: { label: 'Close', variant: 'outline', color: 'red' } }],
    // ['with timeout', { timeout: 1000 }],
    // ['with actions', { actions: [{ id: '4', title: 'action' }] }],
    // ['with callback', { callback: () => { } }],
    // ['with color', { color: 'gray' }],
    // // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Notification.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UNotification)
    expect(html).toMatchSnapshot()
  })
})
