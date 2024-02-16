import { describe, it, expect } from 'vitest'
import { UHorizontalNavigation } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import uiHorizontalNavigation from '../../../src/runtime/ui.config/navigation/horizontalNavigation'

describe('HorizontalNavigation', () => {
  it.each([
    ['basic case', {}],
    ['with links', { props: { links: [ { label: 'Home', labelClass: 'text-sm', icon: 'i-heroicons-academic-cap', iconClass: 'w-5 h-5' }, { label: 'Settings', badge: 'badge' },{ label: 'About', avatar: { src: 'https://repository-images.githubusercontent.com/428329515/43fec891-9030-4601-8233-5d45ba5c6013', alt: 'nuxtui' }  }], ui: uiHorizontalNavigation } }],
    ['with avatar slot', { slots: { avatar: 'Avatar slot' }, props: { links: [ { label: 'Home', labelClass: 'text-sm', icon: 'i-heroicons-academic-cap', iconClass: 'w-5 h-5' }, { label: 'Settings', badge: 'badge' },{ label: 'About', avatar: { src: 'https://repository-images.githubusercontent.com/428329515/43fec891-9030-4601-8233-5d45ba5c6013', alt: 'nuxtui' }  }], ui: uiHorizontalNavigation } }],
    ['with icon slot', { slots: { avatar: 'Icon slot' }, props: { links: [ { label: 'Home', labelClass: 'text-sm', icon: 'i-heroicons-academic-cap', iconClass: 'w-5 h-5' }, { label: 'Settings', badge: 'badge' },{ label: 'About', avatar: { src: 'https://repository-images.githubusercontent.com/428329515/43fec891-9030-4601-8233-5d45ba5c6013', alt: 'nuxtui' }  }], ui: uiHorizontalNavigation } }],
    ['with badge slot', { slots: { avatar: 'Badge slot' }, props: { links: [ { label: 'Home', labelClass: 'text-sm', icon: 'i-heroicons-academic-cap', iconClass: 'w-5 h-5' }, { label: 'Settings', badge: 'badge' },{ label: 'About', avatar: { src: 'https://repository-images.githubusercontent.com/428329515/43fec891-9030-4601-8233-5d45ba5c6013', alt: 'nuxtui' }  }], ui: uiHorizontalNavigation } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof HorizontalNavigation.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UHorizontalNavigation)
    expect(html).toMatchSnapshot()
  })
})
