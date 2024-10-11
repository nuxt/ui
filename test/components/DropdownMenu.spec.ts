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
        src: 'https://avatars.githubusercontent.com/u/739984?v=4'
      },
      type: 'label'
    }],
    [{
      label: 'Profile',
      icon: 'i-heroicons-user',
      slot: 'custom',
      select(e: Event) {
        e.preventDefault()
        console.log('Profile clicked')
      }
    }, {
      label: 'Billing',
      icon: 'i-heroicons-credit-card',
      kbds: ['meta', 'b'],
      select() {
        console.log('Billing clicked')
      }
    }, {
      label: 'Settings',
      icon: 'i-heroicons-cog',
      kbds: ['?'],
      select() {
        console.log('Settings clicked')
      }
    }], [{
      label: 'Team',
      icon: 'i-heroicons-users'
    }, {
      label: 'Invite users',
      icon: 'i-heroicons-user-plus',
      children: [[{
        label: 'Invite by email',
        icon: 'i-heroicons-paper-airplane'
      }, {
        label: 'Invite by link',
        icon: 'i-heroicons-link',
        kbds: ['meta', 'i'],
        select(e: Event) {
          e?.preventDefault()
          console.log('Invite by link clicked')
        }
      }], [{
        label: 'More',
        icon: 'i-heroicons-plus-circle',
        children: [{
          label: 'Import from Slack',
          icon: 'i-simple-icons-slack',
          to: 'https://slack.com',
          target: '_blank',
          select(e: Event) {
            e.preventDefault()
            console.log('Import from Slack clicked')
          }
        }, {
          label: 'Import from Trello',
          icon: 'i-simple-icons-trello',
          select(e: Event) {
            e.preventDefault()
            console.log('Import from Trello clicked')
          }
        }, {
          label: 'Import from Asana',
          icon: 'i-simple-icons-asana',
          select(e: Event) {
            e.preventDefault()
            console.log('Import from Asana clicked')
          }
        }]
      }]]
    }, {
      label: 'New team',
      icon: 'i-heroicons-plus',
      kbds: ['meta', 'n'],
      select() {
        console.log('New team clicked')
      }
    }], [{
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      to: 'https://github.com/nuxt/ui',
      target: '_blank',
      select(e: Event) {
        e.preventDefault()
      }
    }, {
      label: 'Support',
      icon: 'i-heroicons-lifebuoy',
      to: '/components/dropdown-menu'
    }, {
      type: 'separator'
    }, {
      label: 'Keyboard Shortcuts',
      icon: 'i-heroicons-key'
    }, {
      label: 'API',
      icon: 'i-heroicons-cube',
      disabled: true
    }], [{
      label: 'Logout',
      icon: 'i-heroicons-arrow-right-start-on-rectangle',
      kbds: ['shift', 'meta', 'q'],
      select() {
        console.log('Logout clicked')
      }
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
