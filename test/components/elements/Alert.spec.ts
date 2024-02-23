import { describe, it, expect } from 'vitest'
import { UAlert } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Alert', () => {
  it.each([
    ['basic case', {}],
    ['with title', { props: { title: 'Alert Title' } }],
    ['with icon', { props: { title: 'Alert Title', icon: 'heroicons-information-circle' } }],
    ['with avatar', { props: { title: 'Alert Title', avatar: { src: 'avatar.jpg', alt: 'User Avatar' } } }],
    ['with close button', { props: { title: 'Alert Title', closeButton: { label: 'Close' } } }],
    ['with actions', { props: { title: 'Alert Title', actions: [() => { }] } }],
    ['with custom color', { props: { title: 'Alert Title', color: 'red' } }],
    ['with custom variant', { props: { title: 'Alert Title', variant: 'outline' } }],
    ['with title slot', { slots: { title: () => 'Title slot' } }],
    ['with description slot', { slots: { description: () => 'Description slot' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UAlert.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UAlert)
    expect(html).toMatchSnapshot()
  })
})
