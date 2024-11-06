import { describe, it, expect } from 'vitest'
import DropdownMenu, { type DropdownMenuProps, type DropdownMenuSlots } from '../../src/runtime/components/DropdownMenu.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/dropdown-menu'

describe('DropdownMenu', () => {
  const sizes = Object.keys(theme.variants.size) as any

  const items = [
    [{
      label: 'My account',
      avatar: {
        src: 'https://github.com/benjamincanac.png'
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

  const props = { open: true, portal: false, items }

  it.each([
    // Props
    ['with items', { props }],
    ['with labelKey', { props: { ...props, labelKey: 'icon' } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with arrow', { props: { ...props, arrow: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ['with class', { props: { ...props, class: 'min-w-96' } }],
    ['with ui', { props: { ...props, ui: { itemLeadingIcon: 'size-4' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Item trailing slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: DropdownMenuProps<typeof items[number][number]>, slots?: Partial<DropdownMenuSlots<any>> }) => {
    const html = await ComponentRender(nameOrHtml, options, DropdownMenu)
    expect(html).toMatchSnapshot()
  })
})
