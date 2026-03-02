import { describe } from 'vitest'
import ContentNavigation from '../../../src/runtime/components/content/ContentNavigation.vue'
import { renderEach } from '../../component-render'
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

  renderEach(ContentNavigation<typeof navigation[number]>, [
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
    ['with link slot', { props, slots: { link: () => 'Link slot' } }],
    ['with link-leading slot', { props, slots: { 'link-leading': () => 'Link leading slot' } }],
    ['with link-title slot', { props, slots: { 'link-title': () => 'Link title slot' } }],
    ['with link-trailing slot', { props, slots: { 'link-trailing': () => 'Link trailing slot' } }]
  ])
})
