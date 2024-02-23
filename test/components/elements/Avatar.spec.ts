import { describe, it, expect } from 'vitest'
import { UAvatar } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Avatar', () => {
  it.each([
    // TODO: try to resolve TypeError: 'set' on proxy: trap returned falsish for property 'url'
    ['basic case', {}]
    // ['with src', { props: { src: 'https://avatars.githubusercontent.com/u/739984?v=4', alt: 'User Avatar' } }],
    // ['with text', { props: { text: 'JD' } }],
    // ['with icon', { props: { icon: 'heroicons-user' } }],
    // ['with chip', { props: { chipColor: 'gray', chipText: '3' } }],
    // ['with custom size', { props: { size: 'large' } }],
    // ['with custom class', { props: { class: 'custom-class' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UAvatar.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UAvatar)
    expect(html).toMatchSnapshot()
  })
})
