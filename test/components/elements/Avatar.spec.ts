import { describe, it, expect } from 'vitest'
import { UAvatar } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

// FIXME: Remove skip
describe.skip('Avatar', () => {
  it.each([
    ['with src', { props: { src: 'https://avatars.githubusercontent.com/u/739984?v=4', alt: 'User Avatar' } }],
    ['with src', { props: { src: 'https://avatars.githubusercontent.com/u/739984?v=4', size: 'xl' } }],
    ['with text', { props: { text: 'JD' } }],
    ['with icon', { props: { icon: 'heroicons-user' } }],
    ['with chip', { props: { chipColor: 'gray', chipText: '3' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UAvatar.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UAvatar)
    expect(html).toMatchSnapshot()
  })
})
