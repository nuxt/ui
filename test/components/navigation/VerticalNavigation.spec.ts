import { describe, it, expect } from 'vitest'
import { UVerticalNavigation } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('VerticalNavigation', () => {
  it.each([
    ['with links', { props: { links: [ { label: 'Home', labelClass: 'text-sm', icon: 'i-heroicons-academic-cap', iconClass: 'w-5 h-5' }, { label: 'Settings', badge: 'badge' }, { label: 'About', avatar: { src: 'https://repository-images.githubusercontent.com/428329515/43fec891-9030-4601-8233-5d45ba5c6013', alt: 'nuxtui' } }] } }],
    ['with icon slot', { slots: { icon: () => 'Icon slot' }, props: { links: [ { label: 'Home', labelClass: 'text-sm', icon: 'i-heroicons-academic-cap', iconClass: 'w-5 h-5' }, { label: 'Settings', badge: 'badge' }, { label: 'About', avatar: { src: 'https://repository-images.githubusercontent.com/428329515/43fec891-9030-4601-8233-5d45ba5c6013', alt: 'nuxtui' } }] } }],
    ['with avatar slot', { slots: { avatar: () => 'Avatar slot' }, props: { links: [ { label: 'Home', labelClass: 'text-sm', icon: 'i-heroicons-academic-cap', iconClass: 'w-5 h-5' }, { label: 'Settings', badge: 'badge' }, { label: 'About', avatar: { src: 'https://repository-images.githubusercontent.com/428329515/43fec891-9030-4601-8233-5d45ba5c6013', alt: 'nuxtui' } }] } }],
    ['with badge slot', { slots: { badge: () => 'Badge slot' }, props: { links: [ { label: 'Home', labelClass: 'text-sm', icon: 'i-heroicons-academic-cap', iconClass: 'w-5 h-5' }, { label: 'Settings', badge: 'badge' }, { label: 'About', avatar: { src: 'https://repository-images.githubusercontent.com/428329515/43fec891-9030-4601-8233-5d45ba5c6013', alt: 'nuxtui' } }] } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UVerticalNavigation.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UVerticalNavigation)
    expect(html).toMatchSnapshot()
  })
})
