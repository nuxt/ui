import { describe, it, expect } from 'vitest'
import { UAvatar } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Avatar', () => {
  it.each([
    ['basic case', { props: { src: null, alt: 'User Avatar' } }],
    // ['with src', { props: { src: 'https://avatars.githubusercontent.com/u/739984?v=4', alt: 'User Avatar' } }],
    // ['with text', { props: { text: 'JD' } }],
    // ['with icon', { props: { icon: 'heroicons-user' } }],
    // ['with chip', { props: { chipColor: 'gray', chipText: '3' } }],
    // ['with custom size', { props: { size: 'large' } }],
    // ['with custom class', { props: { class: 'custom-class' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Avatar.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UAvatar)
    expect(html).toMatchSnapshot()
  })
})
