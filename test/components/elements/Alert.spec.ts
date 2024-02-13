import { describe, it, expect } from 'vitest'
import { UAlert } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Alert', () => {
  it.each([
    ['basic case', {}],
    ['renders with default values correctly', { props: { title: 'Alert Title' } }],
    ['renders with description', { props: { title: 'Alert Title', description: 'This is an alert description.' } }],
    // ['renders with icon', { props: { title: 'Alert Title', icon: 'heroicons-information-circle' } }],
    // ['renders with avatar', { props: { title: 'Alert Title', avatar: { src: 'avatar.jpg', alt: 'User Avatar' } } }],
    // ['renders with close button', { props: { title: 'Alert Title', closeButton: { label: 'Close' } } }],
    //['renders with actions', { props: { title: 'Alert Title', actions: [() => { }] } }],
    ['renders with custom color', { props: { title: 'Alert Title', color: 'red' } }],
    ['renders with custom variant', { props: { title: 'Alert Title', variant: 'outline' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Alert.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UAlert)
    expect(html).toMatchSnapshot()
  })
})
