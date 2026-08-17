import { defineComponent } from 'vue'
import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { TooltipProvider } from 'reka-ui'
import { renderEach } from '../component-render'
import type { AppConfig } from '@nuxt/schema'
import NavigationMenu from '../../src/runtime/components/NavigationMenu.vue'
import Tooltip from '../../src/runtime/components/Tooltip.vue'
import type { ComponentConfig } from '../../src/runtime/types/tv'
import { expectSlotProps } from '../utils/types'
import theme from '#build/ui/navigation-menu'

type NavigationMenu = ComponentConfig<typeof theme, AppConfig, 'navigationMenu'>

describe('NavigationMenu', () => {
  const variants = Object.keys(theme.variants.variant) as any

  const items = [
    [{
      label: 'Links',
      type: 'label'
    }, {
      label: 'Documentation',
      icon: 'i-lucide-book-open',
      badge: 10,
      children: [{
        label: 'Introduction',
        description: 'Fully styled and customizable components for Nuxt.',
        icon: 'i-lucide-house'
      }, {
        label: 'Installation',
        description: 'Learn how to install and configure Nuxt UI in your application.',
        icon: 'i-lucide-cloud-download'
      }, {
        label: 'Theming',
        description: 'Learn how to customize the look and feel of the components.',
        icon: 'i-lucide-swatch-book'
      }, {
        label: 'Shortcuts',
        description: 'Learn how to display and define keyboard shortcuts in your app.',
        icon: 'i-lucide-monitor'
      }]
    }, {
      label: 'Components',
      icon: 'i-lucide-box',
      active: true,
      children: [{
        label: 'Link',
        icon: 'i-lucide-file',
        description: 'Use NuxtLink with superpowers.',
        to: '/components/link'
      }, {
        label: 'Modal',
        icon: 'i-lucide-file',
        description: 'Display a modal within your application.',
        to: '/components/modal'
      }, {
        label: 'NavigationMenu',
        icon: 'i-lucide-file',
        description: 'Display a list of links.',
        to: '/components/navigation-menu'
      }, {
        label: 'Pagination',
        icon: 'i-lucide-file',
        description: 'Display a list of pages.',
        to: '/components/pagination'
      }, {
        label: 'Popover',
        icon: 'i-lucide-file',
        description: 'Display a non-modal dialog that floats around a trigger element.',
        to: '/components/popover'
      }, {
        label: 'Progress',
        icon: 'i-lucide-file',
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
      icon: 'i-lucide-circle-help',
      disabled: true
    }]
  ]

  const props = { items }

  renderEach(NavigationMenu, [
    // Props
    ['with items', { props }],
    ['with modelValue', { props: { ...props, modelValue: 'item-0' } }],
    ['with defaultValue', { props: { ...props, defaultValue: 'item-0' } }],
    ['with valueKey', { props: { ...props, valueKey: 'label', defaultValue: 'Documentation' } }],
    ['with labelKey', { props: { ...props, labelKey: 'icon' } }],
    ['with arrow', { props: { ...props, arrow: true, modelValue: 'item-0' } }],
    ['with orientation vertical', { props: { ...props, orientation: 'vertical', modelValue: 'item-0' } }],
    ['with orientation vertical and collapsed', { props: { ...props, orientation: 'vertical', modelValue: 'item-0', collapsed: true } }],
    ['with content orientation vertical', { props: { ...props, contentOrientation: 'vertical', modelValue: 'item-0' } }],
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { ...props, variant } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { ...props, variant, color: 'neutral' } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant} highlight`, { props: { ...props, variant, highlight: true } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant} highlight`, { props: { ...props, variant, color: 'neutral', highlight: true } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant} highlight neutral`, { props: { ...props, variant, color: 'neutral', highlight: true, highlightColor: 'neutral' } }]),
    ['with chip', { props: { items: [[{ label: 'Guide', icon: 'i-lucide-book-open', chip: true }, { label: 'Components', icon: 'i-lucide-box', chip: { color: 'error' } }]] } }],
    ['with trailingIcon', { props: { ...props, trailingIcon: 'i-lucide-plus' } }],
    ['with externalIcon', { props: { ...props, externalIcon: 'i-lucide-external-link' } }],
    ['without externalIcon', { props: { ...props, externalIcon: false } }],
    ['with unmountOnHide', { props: { ...props, unmountOnHide: false } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'w-48' } }],
    ['with ui', { props: { ...props, ui: { itemLeadingIcon: 'size-4' } } }],
    // Slots
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Item trailing slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(NavigationMenu, {
      props: {
        items,
        modelValue: 'item-0'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  describe('tooltip', () => {
    const NavigationMenuWrapper = defineComponent({
      components: { TooltipProvider, UNavigationMenu: NavigationMenu },
      inheritAttrs: false,
      template: `<TooltipProvider><UNavigationMenu v-bind="$attrs" /></TooltipProvider>`
    })

    const plain = { label: 'Dashboard', icon: 'i-lucide-house' }
    const tooltipped = { label: 'Reports', icon: 'i-lucide-chart-column', tooltip: { text: 'Upgrade to Pro' } }

    async function renderMenu(attrs: any) {
      return await mountSuspended(NavigationMenuWrapper, { attrs })
    }

    async function countTooltips(attrs: any) {
      return (await renderMenu(attrs)).findAllComponents(Tooltip).length
    }

    test('shows an item tooltip when vertical and not collapsed', async () => {
      expect(await countTooltips({ items: [plain, tooltipped], orientation: 'vertical' })).toBe(1)
    })

    test('shows an item tooltip when vertical and collapsed', async () => {
      expect(await countTooltips({ items: [plain, tooltipped], orientation: 'vertical', collapsed: true })).toBe(1)
    })

    test('shows an item tooltip when horizontal', async () => {
      expect(await countTooltips({ items: [plain, tooltipped], orientation: 'horizontal' })).toBe(1)
    })

    test('shows no tooltip when no item opts in', async () => {
      expect(await countTooltips({ items: [plain], orientation: 'vertical' })).toBe(0)
    })

    test('keeps the global tooltip prop scoped to collapsed menus', async () => {
      expect(await countTooltips({ items: [plain, plain], orientation: 'vertical', tooltip: true })).toBe(0)
      expect(await countTooltips({ items: [plain, plain], orientation: 'vertical', tooltip: true, collapsed: true })).toBe(2)
    })

    test('an item tooltip overrides the label as content', async () => {
      const wrapper = await renderMenu({
        items: [{ ...tooltipped, tooltip: { text: 'Upgrade to Pro', open: true, portal: false } }],
        orientation: 'vertical'
      })

      expect(wrapper.text()).toContain('Upgrade to Pro')
    })

    test('an item tooltip falls back to the label as content', async () => {
      const wrapper = await renderMenu({
        items: [{ ...plain, tooltip: { open: true, portal: false } }],
        orientation: 'vertical'
      })

      expect(wrapper.text()).toContain('Dashboard')
    })

    // A parent item renders an accordion trigger, and the tooltip trigger merges onto the same
    // element, so assert the accordion through `aria-expanded` rather than the shared `data-state`.
    test('keeps the accordion trigger working on a parent item', async () => {
      const wrapper = await renderMenu({
        items: [{ ...tooltipped, children: [{ label: 'Usage' }] }],
        orientation: 'vertical'
      })

      expect(wrapper.find('[data-slot="link"]').attributes('aria-expanded')).toBe('false')

      await wrapper.find('[data-slot="link"]').trigger('click')

      expect(wrapper.find('[data-slot="link"]').attributes('aria-expanded')).toBe('true')
      expect(wrapper.find('[data-slot="item"]').attributes('data-state')).toBe('open')
    })
  })

  test('should have the correct types', () => {
    // normal
    expectSlotProps('item', () => NavigationMenu({
      items: [{ label: 'foo', value: 'bar' }]
    })).toEqualTypeOf<{ item: { label: string, value: string }, index: number, active: boolean, ui: NavigationMenu['ui'] }>()

    // groups
    expectSlotProps('item', () => NavigationMenu({
      items: [[{ label: 'foo', value: 'bar' }]]
    })).toEqualTypeOf<{ item: { label: string, value: string }, index: number, active: boolean, ui: NavigationMenu['ui'] }>()

    // custom
    expectSlotProps('item', () => NavigationMenu({
      items: [{ label: 'foo', value: 'bar', custom: 'nice' }]
    })).toEqualTypeOf<{ item: { label: string, value: string, custom: string }, index: number, active: boolean, ui: NavigationMenu['ui'] }>()

    // custom + groups
    expectSlotProps('item', () => NavigationMenu({
      items: [[{ label: 'foo', value: 'bar', custom: 'nice' }]]
    })).toEqualTypeOf<{ item: { label: string, value: string, custom: string }, index: number, active: boolean, ui: NavigationMenu['ui'] }>()
  })
})
