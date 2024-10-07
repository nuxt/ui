import { describe, it, expect } from 'vitest'
import NavigationMenu, { type NavigationMenuProps, type NavigationMenuSlots } from '../../src/runtime/components/NavigationMenu.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/navigation-menu'

describe('NavigationMenu', () => {
  const variants = Object.keys(theme.variants.variant) as any

  const items = [
    [{
      label: 'Documentation',
      icon: 'i-heroicons-book-open',
      children: [{
        label: 'Introduction',
        description: 'Fully styled and customizable components for Nuxt.',
        icon: 'i-heroicons-home'
      }, {
        label: 'Installation',
        description: 'Learn how to install and configure Nuxt UI in your application.',
        icon: 'i-heroicons-cloud-arrow-down'
      }, {
        label: 'Theming',
        description: 'Learn how to customize the look and feel of the components.',
        icon: 'i-heroicons-swatch'
      }, {
        label: 'Shortcuts',
        description: 'Learn how to display and define keyboard shortcuts in your app.',
        icon: 'i-heroicons-computer-desktop'
      }]
    }, {
      label: 'Components',
      icon: 'i-heroicons-cube-transparent',
      active: true,
      children: [{
        label: 'Link',
        icon: 'i-heroicons-document',
        description: 'Use NuxtLink with superpowers.',
        to: '/components/link'
      }, {
        label: 'Modal',
        icon: 'i-heroicons-document',
        description: 'Display a modal within your application.',
        to: '/components/modal'
      }, {
        label: 'NavigationMenu',
        icon: 'i-heroicons-document',
        description: 'Display a list of links.',
        to: '/components/navigation-menu'
      }, {
        label: 'Pagination',
        icon: 'i-heroicons-document',
        description: 'Display a list of pages.',
        to: '/components/pagination'
      }, {
        label: 'Popover',
        icon: 'i-heroicons-document',
        description: 'Display a non-modal dialog that floats around a trigger element.',
        to: '/components/popover'
      }, {
        label: 'Progress',
        icon: 'i-heroicons-document',
        description: 'Show a horizontal bar to indicate task progression.',
        to: '/components/progress'
      }]
    }], [{
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      to: 'https://github.com/nuxt/ui',
      target: '_blank'
    }, {
      label: 'Help',
      icon: 'i-heroicons-question-mark-circle',
      disabled: true
    }]
  ]

  const props = { items }

  it.each([
    // Props
    ['with items', { props }],
    ['with arrow', { props: { ...props, arrow: true } }],
    ['with orientation vertical', { props: { ...props, orientation: 'vertical' as const } }],
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { ...props, variant } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { ...props, variant, color: 'neutral' } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant} highlight`, { props: { ...props, variant, highlight: true } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant} highlight`, { props: { ...props, variant, color: 'neutral', highlight: true } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant} highlight neutral`, { props: { ...props, variant, color: 'neutral', highlight: true, highlightColor: 'neutral' } }]),
    ['with trailingIcon', { props: { ...props, trailingIcon: 'i-heroicons-plus' } }],
    ['with class', { props: { ...props, class: 'w-48' } }],
    ['with ui', { props: { ...props, ui: { itemLeadingIcon: 'size-4' } } }],
    // Slots
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Item trailing slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: NavigationMenuProps<typeof items[number][number]>, slots?: Partial<NavigationMenuSlots<any>> }) => {
    const html = await ComponentRender(nameOrHtml, options, NavigationMenu)
    expect(html).toMatchSnapshot()
  })
})
