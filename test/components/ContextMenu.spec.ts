import { h, defineComponent } from 'vue'
import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { AppConfig } from '@nuxt/schema'
import ContextMenu from '../../src/runtime/components/ContextMenu.vue'
import type { ContextMenuProps, ContextMenuSlots } from '../../src/runtime/components/ContextMenu.vue'
import type { ComponentConfig } from '../../src/runtime/types/tv'
import { expectSlotProps } from '../utils/types'
import theme from '#build/ui/context-menu'

type ContextMenu = ComponentConfig<typeof theme, AppConfig, 'contextMenu'>

const ContextMenuWrapper = defineComponent({
  components: {
    UContextMenu: ContextMenu as any
  },
  inheritAttrs: false,
  template: `<UContextMenu v-bind="$attrs">
<span>Right Click</span>

 <template v-for="(_, name) in $slots" #[name]="slotData">
    <slot :name="name" v-bind="slotData" />
  </template>
</UContextMenu>`
})

describe('ContextMenu', () => {
  const sizes = Object.keys(theme.variants.size) as any

  const items = [
    [{
      label: 'Appearance',
      children: [{
        label: 'System',
        icon: 'i-lucide-monitor'
      }, {
        label: 'Light',
        icon: 'i-lucide-sun'
      }, {
        label: 'Dark',
        icon: 'i-lucide-moon'
      }]
    }], [{
      label: 'Show Sidebar',
      color: 'primary',
      kbds: ['meta', 'S']
    }, {
      label: 'Show Toolbar',
      kbds: ['shift', 'meta', 'D']
    }, {
      label: 'Collapse Pinned Tabs',
      disabled: true
    }], [{
      label: 'Refresh the Page'
    }, {
      label: 'Clear Cookies and Refresh'
    }, {
      label: 'Clear Cache and Refresh'
    }, {
      type: 'separator' as const
    }, {
      label: 'Developer',
      children: [[{
        label: 'View Source',
        kbds: ['option', 'meta', 'U']
      }, {
        label: 'Developer Tools',
        kbds: ['option', 'meta', 'I']
      }], [{
        label: 'Inspect Elements',
        kbds: ['option', 'meta', 'C']
      }], [{
        label: 'JavaScript Console',
        kbds: ['option', 'meta', 'J'],
        slot: 'custom'
      }]]
    }], [{
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      to: 'https://github.com/nuxt/ui',
      target: '_blank'
    }]
  ]

  const itemsWithDescription = [
    [{
      label: 'Profile',
      description: 'View and edit your profile',
      icon: 'i-lucide-user',
      children: [{
        label: 'Settings',
        description: 'Configure your preferences',
        icon: 'i-lucide-settings'
      }, {
        label: 'Logout',
        description: 'Sign out of your account',
        icon: 'i-lucide-log-out'
      }]
    }], [{
      label: 'Dashboard',
      description: 'Main overview page',
      color: 'primary',
      kbds: ['meta', 'D']
    }, {
      label: 'Analytics',
      description: 'View detailed statistics',
      kbds: ['shift', 'meta', 'A']
    }]
  ]

  const props = { portal: false, items }

  it.each([
    // Props
    ['with items', { props }],
    ['with items with description', { props: { ...props, items: itemsWithDescription } }],
    ['with labelKey', { props: { ...props, labelKey: 'icon' } }],
    ['with descriptionKey', { props: { ...props, items: itemsWithDescription, descriptionKey: 'label' } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ['with externalIcon', { props: { ...props, externalIcon: 'i-lucide-external-link' } }],
    ['without externalIcon', { props: { ...props, externalIcon: false } }],
    ['with class', { props: { ...props, class: 'min-w-96' } }],
    ['with ui', { props: { ...props, ui: { itemLeadingIcon: 'size-4' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => h('span', 'Default slot') } }],
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-description slot', { props: { ...props, items: itemsWithDescription }, slots: { 'item-description': () => 'Item description slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Item trailing slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ContextMenuProps, slots?: Partial<ContextMenuSlots> }) => {
    const wrapper = await mountSuspended(ContextMenuWrapper, options as any)

    await wrapper.find('span').trigger('click.right')

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ContextMenuWrapper, {
      props
    })

    await wrapper.find('span').trigger('click.right')

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  test('should have the correct types', () => {
    // normal
    expectSlotProps('item', () => ContextMenu({
      items: [{ label: 'foo', value: 'bar' }]
    })).toEqualTypeOf<{ item: { label: string, value: string }, index: number, active?: boolean, ui: ContextMenu['ui'] }>()

    // groups
    expectSlotProps('item', () => ContextMenu({
      items: [[{ label: 'foo', value: 'bar' }]]
    })).toEqualTypeOf<{ item: { label: string, value: string }, index: number, active?: boolean, ui: ContextMenu['ui'] }>()

    // custom
    expectSlotProps('item', () => ContextMenu({
      items: [{ label: 'foo', value: 'bar', custom: 'nice' }]
    })).toEqualTypeOf<{ item: { label: string, value: string, custom: string }, index: number, active?: boolean, ui: ContextMenu['ui'] }>()

    // custom + groups
    expectSlotProps('item', () => ContextMenu({
      items: [[{ label: 'foo', value: 'bar', custom: 'nice' }]]
    })).toEqualTypeOf<{ item: { label: string, value: string, custom: string }, index: number, active?: boolean, ui: ContextMenu['ui'] }>()
  })
})
