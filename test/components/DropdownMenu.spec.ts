import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { AppConfig } from '@nuxt/schema'
import DropdownMenu from '../../src/runtime/components/DropdownMenu.vue'
import type { DropdownMenuProps, DropdownMenuSlots } from '../../src/runtime/components/DropdownMenu.vue'
import type { ComponentConfig } from '../../src/runtime/types/tv'
import ComponentRender from '../component-render'
import { expectSlotProps } from '../utils/types'
import theme from '#build/ui/dropdown-menu'

type DropdownMenu = ComponentConfig<typeof theme, AppConfig, 'dropdownMenu'>

describe('DropdownMenu', () => {
  const sizes = Object.keys(theme.variants.size) as any

  const items = [
    [{
      label: 'My account',
      avatar: {
        src: 'https://github.com/benjamincanac.png',
        alt: 'Benjamín Canac'
      },
      type: 'label'
    }],
    [{
      label: 'Profile',
      icon: 'i-lucide-user',
      slot: 'custom'
    }, {
      label: 'Billing',
      icon: 'i-lucide-credit-card',
      kbds: ['meta', 'b']
    }, {
      label: 'Settings',
      icon: 'i-lucide-cog',
      kbds: ['?']
    }], [{
      label: 'Team',
      icon: 'i-lucide-users'
    }, {
      label: 'Invite users',
      icon: 'i-lucide-user-plus',
      children: [[{
        label: 'Invite by email',
        icon: 'i-lucide-send-horizontal'
      }, {
        label: 'Invite by link',
        icon: 'i-lucide-link',
        kbds: ['meta', 'i']
      }], [{
        label: 'More',
        icon: 'i-lucide-circle-plus',
        children: [{
          label: 'Import from Slack',
          icon: 'i-simple-icons-slack',
          to: 'https://slack.com',
          target: '_blank'
        }, {
          label: 'Import from Trello',
          icon: 'i-simple-icons-trello'
        }, {
          label: 'Import from Asana',
          icon: 'i-simple-icons-asana'
        }]
      }]]
    }, {
      label: 'New team',
      icon: 'i-lucide-plus',
      kbds: ['meta', 'n']
    }], [{
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      to: 'https://github.com/nuxt/ui',
      target: '_blank'
    }, {
      label: 'Support',
      icon: 'i-lucide-life-buoy',
      to: '/components/dropdown-menu'
    }, {
      type: 'separator'
    }, {
      label: 'Keyboard Shortcuts',
      icon: 'i-lucide-key-round'
    }, {
      label: 'API',
      icon: 'i-lucide-box',
      disabled: true
    }], [{
      label: 'Logout',
      color: 'error',
      icon: 'i-lucide-log-out',
      kbds: ['shift', 'meta', 'q']
    }]
  ]

  const itemsWithDescription = [
    [{
      label: 'My account',
      description: 'Account settings',
      avatar: {
        src: 'https://github.com/benjamincanac.png'
      },
      type: 'label'
    }],
    [{
      label: 'Profile',
      description: 'View your profile',
      icon: 'i-lucide-user',
      slot: 'custom'
    }, {
      label: 'Billing',
      description: 'Manage billing',
      icon: 'i-lucide-credit-card',
      kbds: ['meta', 'b']
    }]
  ]

  const props = { open: true, portal: false, items }

  it.each([
    // Props
    ['with items', { props }],
    ['with items with description', { props: { ...props, items: itemsWithDescription } }],
    ['with labelKey', { props: { ...props, labelKey: 'icon' } }],
    ['with descriptionKey', { props: { ...props, descriptionKey: 'description' } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with arrow', { props: { ...props, arrow: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ['with externalIcon', { props: { ...props, externalIcon: 'i-lucide-external-link' } }],
    ['without externalIcon', { props: { ...props, externalIcon: false } }],
    ['with class', { props: { ...props, class: 'min-w-96' } }],
    ['with ui', { props: { ...props, ui: { itemLeadingIcon: 'size-4' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-description slot', { props: { ...props, items: itemsWithDescription }, slots: { 'item-description': () => 'Item description slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Item trailing slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: DropdownMenuProps, slots?: Partial<DropdownMenuSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, DropdownMenu)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(DropdownMenu, {
      props
    })

    expect(await axe(wrapper.element, {
      rules: {
        // "Certain ARIA roles must contain particular children (aria-required-children)"
        //
        // Fix any of the following:
        //  Element has children which are not allowed: img[tabindex]
        'aria-required-children': { enabled: false }
      }
    })).toHaveNoViolations()
  })

  test('should have the correct types', () => {
    // normal
    expectSlotProps('item', () => DropdownMenu({
      items: [{ label: 'foo', value: 'bar' }]
    })).toEqualTypeOf<{ item: { label: string, value: string }, index: number, active?: boolean, ui: DropdownMenu['ui'] }>()

    // groups
    expectSlotProps('item', () => DropdownMenu({
      items: [[{ label: 'foo', value: 'bar' }]]
    })).toEqualTypeOf<{ item: { label: string, value: string }, index: number, active?: boolean, ui: DropdownMenu['ui'] }>()

    // custom
    expectSlotProps('item', () => DropdownMenu({
      items: [{ label: 'foo', value: 'bar', custom: 'nice' }]
    })).toEqualTypeOf<{ item: { label: string, value: string, custom: string }, index: number, active?: boolean, ui: DropdownMenu['ui'] }>()

    // custom + groups
    expectSlotProps('item', () => DropdownMenu({
      items: [[{ label: 'foo', value: 'bar', custom: 'nice' }]]
    })).toEqualTypeOf<{ item: { label: string, value: string, custom: string }, index: number, active?: boolean, ui: DropdownMenu['ui'] }>()
  })
})
