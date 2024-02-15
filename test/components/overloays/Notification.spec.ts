import { describe, it, expect } from 'vitest'
import { UNotification } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import ui from '../../../src/runtime/ui.config/overlays/notification'

describe('Notification', () => {
  it.each([
    ['basic case', { props: { ui: { default: { closeButton: ui.default.closeButton } } }}],
    // ['with title', { props: { title: 'Notification title', ui: { default: { closeButton: ui.default.closeButton } } }}],
    // ['with description', { props: { description: 'Notification description', ui: { default: { closeButton: ui.default.closeButton } } }}],
    // ['with icon', { props: { icon: 'i-heroicons-academic-cap', ui: { default: { closeButton: ui.default.closeButton } } }}],
    // ['with avatar', { props: { avatar: { src: 'https://repository-images.githubusercontent.com/428329515/43fec891-9030-4601-8233-5d45ba5c6013', alt: 'nuxtui' }, ui: { default: { closeButton: ui.default.closeButton }, avatar: { size: ui.avatar.size } } }}],
    // ['with close button', { props: { closeButton: { label: 'close', color: 'red' }, ui: { default: { closeButton: ui.default.closeButton } } }}],
    // ['with color', { props: {color:'red', ui: { default: { closeButton: ui.default.closeButton } } }}],
    // // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UNotification.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UNotification)
    expect(html).toMatchSnapshot()
  })
})
