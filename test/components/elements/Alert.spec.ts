import { describe, it, expect } from 'vitest'
import { UAlert } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import ui from '../../../src/runtime/ui.config/elements/alert'

describe('Alert', () => {
  it.each([
    ['basic case', {}],
    ['with tile', { props: { title: 'Alert Title' } }],
    ['with title slot', { slots: { title: 'Alert Title slot' } }],
    ['with description', { props: { title: 'Alert Title', description: 'This is an alert description.' } }],
    ['with description slot', { slots: { title: 'Alert Title', description: 'This is an alert description slot' } }],
    ['with icon', { props: { title: 'Alert Title', icon: 'heroicons-information-circle', ui: { icon: { base: ui.icon.base } } } }],
    ['with avatar', { props: { title: 'Alert Title', avatar: { src: 'avatar.jpg', alt: 'User Avatar' }, ui: { avatar: { base: ui.avatar.base } } } }],
    ['with close button', { props: { title: 'Alert Title', closeButton: { label: 'Close' }, ui: { default: { closeButton: ui.default.closeButton } } } }],
    ['with actions', { props: { title: 'Alert Title', actions: [() => { }], ui: { default: { actionButton: { size: ui.default.actionButton.size, color: ui.default.actionButton.color, variant: ui.default.actionButton.variant } } } } }],
    ['with custom color', { props: { title: 'Alert Title', color: 'red' } }],
    ['with custom variant', { props: { title: 'Alert Title', variant: 'outline' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Alert.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UAlert)
    expect(html).toMatchSnapshot()
  })
})
