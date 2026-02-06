import { describe, it, expect } from 'vitest'
import ContentNavigation from '../../../src/runtime/components/content/ContentNavigation.vue'
import type { ContentNavigationProps, ContentNavigationSlots } from '../../../src/runtime/components/content/ContentNavigation.vue'
import ComponentRender from '../../component-render'
import theme from '#build/ui/content/content-navigation'

describe('ContentNavigation', () => {
  const variants = Object.keys(theme.variants.variant) as any

  const navigation = [{
    title: 'Getting Started',
    path: '/getting-started',
    badge: 'New',
    children: [{
      title: 'Introduction',
      path: '/getting-started',
      active: true
    }, {
      title: 'Installation',
      path: '/getting-started/installation'
    }, {
      title: 'Theming',
      path: '/getting-started/theming'
    }, {
      title: 'Structure',
      path: '/getting-started/structure'
    }, {
      title: 'Content',
      path: '/getting-started/content'
    }]
  }, {
    title: 'Components',
    path: '/components',
    children: [{
      title: 'ContentNavigation',
      path: '/components/content-navigation'
    }, {
      title: 'ContentSearch',
      path: '/components/content-search'
    }, {
      title: 'ContentSurround',
      path: '/components/content-surround'
    }, {
      title: 'ContentToc',
      path: '/components/content-toc'
    }]
  }]

  const props = { navigation }

  it.each([
    // Props
    ['with navigation', { props }],
    ['with defaultOpen', { props, defaultOpen: true }],
    ['without defaultOpen', { props, defaultOpen: false }],
    ['without collapsible', { props, collapsible: false }],
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { ...props, variant } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { ...props, variant, color: 'neutral' } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant} highlight`, { props: { ...props, variant, highlight: true } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant} highlight`, { props: { ...props, variant, color: 'neutral', highlight: true } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant} highlight neutral`, { props: { ...props, variant, color: 'neutral', highlight: true, highlightColor: 'neutral' } }]),
    ['with trailingIcon', { props: { ...props, trailingIcon: 'i-lucide-plus' } }],
    ['with class', { props: { ...props, class: 'w-48' } }],
    ['with ui', { props: { ...props, ui: { itemLeadingIcon: 'size-4' } } }],
    // Slots
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Item trailing slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ContentNavigationProps, slots?: Partial<ContentNavigationSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, ContentNavigation)
    expect(html).toMatchSnapshot()
  })
})
