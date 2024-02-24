import { describe, it, expect } from 'vitest'
import { UNotification } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Notification', () => {
  it.each([
    ['basic case', {}],
    ['with title', { props: { title: 'Notification title' } }],
    ['with description', { props: { description: 'Notification description' } }],
    ['with icon', { props: { icon: 'i-heroicons-academic-cap' } }],
    ['with avatar', { props: { avatar: { src: 'https://repository-images.githubusercontent.com/428329515/43fec891-9030-4601-8233-5d45ba5c6013', alt: 'nuxtui' } } }],
    ['with close button', { props: { closeButton: { label: 'close', color: 'red' } } }],
    ['with color', { props: { color: 'red' } }]
    // // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UNotification.props>) => {
    let html = await ComponentRender(nameOrHtml, options, UNotification)
    // avoid test failure due to width variations
    html = html.replace('style="width: 100%;"', '')
    html = html.replace('style="width: 100.02%;"', '')
    expect(html).toMatchSnapshot()
  })
})
