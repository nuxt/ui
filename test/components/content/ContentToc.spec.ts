import { describe } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import ContentToc from '../../../src/runtime/components/content/ContentToc.vue'
import { renderEach } from '../../component-render'
import theme from '#build/ui/content/content-toc'

describe('ContentToc', () => {
  mockNuxtImport('useScrollspy', () => {
    return () => {
      return {
        activeHeadings: ['installation'],
        updateHeadings: () => {}
      }
    }
  })

  const links = [{
    id: 'installation',
    depth: 2,
    text: 'Installation'
  }, {
    id: 'components',
    depth: 2,
    text: 'Components'
  }, {
    id: 'typography',
    depth: 2,
    text: 'Typography'
  }, {
    id: 'utils',
    depth: 2,
    text: 'Utils',
    children: [{
      id: 'mapcontentnavigation',
      depth: 3,
      text: 'mapContentNavigation'
    }, {
      id: 'findpageheadline',
      depth: 3,
      text: 'findPageHeadline'
    }, {
      id: 'findpagebreadcrumb',
      depth: 3,
      text: 'findPageBreadcrumb'
    }]
  }]

  const highlightVariants = Object.keys(theme.variants.highlightVariant) as any

  const props = { links }

  renderEach(ContentToc, [
    // Props
    ['with links', { props }],
    ['with title', { props: { ...props, title: 'On this page' } }],
    ['with neutral color', { props: { ...props, color: 'neutral' as const } }],
    ['with highlight', { props: { ...props, highlight: true } }],
    ['with highlight neutral color', { props: { ...props, highlight: true, highlightColor: 'neutral' as const } }],
    ...highlightVariants.map((highlightVariant: string) => [`with highlight ${highlightVariant} variant`, { props: { ...props, highlight: true, highlightVariant } }]),
    ...highlightVariants.map((highlightVariant: string) => [`with highlight ${highlightVariant} variant neutral color`, { props: { ...props, highlight: true, highlightVariant, highlightColor: 'neutral' as const } }]),
    ['with trailingIcon', { props: { ...props, trailingIcon: 'i-lucide-plus' } }],
    ['with as', { props: { ...props, as: 'div' } }],
    ['with class', { props: { ...props, class: 'lg:px-8' } }],
    ['with ui', { props: { ...props, ui: { trailingIcon: 'size-6' } } }],
    // Slots
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with trailing slot', { props, slots: { trailing: () => 'Trailing slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }],
    ['with link slot', { props, slots: { link: () => 'Link slot' } }],
    ['with top slot', { props, slots: { top: () => 'Top slot' } }],
    ['with bottom slot', { props, slots: { bottom: () => 'Bottom slot' } }]
  ])
})
