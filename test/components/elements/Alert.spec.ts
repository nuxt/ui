import { describe, it, expect } from 'vitest'
import { UAlert } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import uiAlert from '../../../src/runtime/ui.config/elements/alert'

describe('Alert', () => {
  it.each([
    ['basic case', {}],
    ['with tile', { props: { title: 'Alert Title' }, ui: uiAlert }],
    ['with title slot', { props: { ui: uiAlert }, slots: { title: 'Alert Title slot' } }],
    ['with description', { props: { title: 'Alert Title', description: 'This is an alert description.' }, ui: uiAlert }],
    ['with description slot', { props: { ui: uiAlert }, slots: { title: 'Alert Title', description: 'This is an alert description slot' } }],
    ['with icon', { props: { title: 'Alert Title', icon: 'heroicons-information-circle', ui: uiAlert } }],
    ['with avatar', { props: { title: 'Alert Title', avatar: { src: 'avatar.jpg', alt: 'User Avatar' }, ui: uiAlert } }],
    ['with close button', { props: { title: 'Alert Title', closeButton: { label: 'Close' }, ui: uiAlert } }],
    ['with actions', { props: { title: 'Alert Title', actions: [() => { }], ui: uiAlert } }],
    ['with custom color', { props: { title: 'Alert Title', color: 'red' }, ui: uiAlert }],
    ['with custom variant', { props: { title: 'Alert Title', variant: 'outline' }, ui: uiAlert }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Alert.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UAlert)
    expect(html).toMatchSnapshot()
  })
})
