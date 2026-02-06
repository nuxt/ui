import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CommandPalette from '../../src/runtime/components/CommandPalette.vue'
import type { CommandPaletteProps, CommandPaletteSlots } from '../../src/runtime/components/CommandPalette.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/command-palette'

describe('CommandPalette', () => {
  const sizes = Object.keys(theme.variants.size) as any

  const groups = [{
    id: 'actions',
    items: [{
      label: 'Add new file',
      suffix: 'Create a new file in the current directory or workspace.',
      icon: 'i-lucide-file-plus',
      kbds: ['meta', 'N'],
      active: true
    }, {
      label: 'Add new folder',
      suffix: 'Create a new folder in the current directory or workspace.',
      icon: 'i-lucide-folder-plus',
      kbds: ['meta', 'F']
    }, {
      label: 'Add hashtag',
      suffix: 'Add a hashtag to the current item.',
      icon: 'i-lucide-hash',
      kbds: ['meta', 'H'],
      disabled: true
    }, {
      label: 'Add label',
      suffix: 'Add a label to the current item.',
      icon: 'i-lucide-tag',
      kbds: ['meta', 'L'],
      slot: 'custom'
    }]
  }, {
    id: 'labels',
    label: 'Labels',
    items: [{
      label: 'bug',
      chip: {
        color: 'error' as const
      }
    }, {
      label: 'feature',
      chip: {
        color: 'success' as const
      }
    }, {
      label: 'enhancement',
      chip: {
        color: 'info' as const
      }
    }]
  }, {
    id: 'users',
    label: 'Users',
    items: [{
      label: 'benjamincanac',
      avatar: {
        src: 'https://github.com/benjamincanac.png',
        alt: 'Benjamin Canac'
      },
      to: 'https://github.com/benjamincanac',
      target: '_blank'
    }]
  }]

  const groupsWithDescription = [{
    id: 'actions',
    items: [{
      label: 'Create Project',
      description: 'Start a new project from scratch',
      icon: 'i-lucide-folder-plus',
      kbds: ['meta', 'N']
    }, {
      label: 'Open File',
      description: 'Browse and open an existing file',
      icon: 'i-lucide-file',
      kbds: ['meta', 'O']
    }, {
      label: 'Settings',
      description: 'Configure your preferences',
      icon: 'i-lucide-settings',
      kbds: ['meta', ',']
    }]
  }, {
    id: 'recent',
    label: 'Recent Files',
    items: [{
      label: 'index.vue',
      description: '/src/pages/index.vue',
      icon: 'i-lucide-file-code'
    }, {
      label: 'app.vue',
      description: '/app.vue',
      icon: 'i-lucide-file-code'
    }]
  }]

  const props = { groups }

  it.each([
    // Props
    ['with groups', { props }],
    ['with groups with description', { props: { groups: groupsWithDescription } }],
    ['without groups', {}],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ['with modelValue', { props: { ...props, modelValue: groups[2]?.items[0] } }],
    ['with defaultValue', { props: { ...props, defaultValue: groups[2]?.items[0] } }],
    ['with searchTerm', { props: { ...props, searchTerm: 'f' } }],
    ['with searchTerm and preserveGroupOrder', { props: { ...props, searchTerm: 'f', preserveGroupOrder: true } }],
    ['with valueKey', { props: { ...props, valueKey: 'label', defaultValue: 'Add new file' } }],
    ['with by', { props: { ...props, by: 'label', defaultValue: groups[0]?.items[0] } }],
    ['with labelKey', { props: { ...props, labelKey: 'icon' } }],
    ['with descriptionKey', { props: { groups: groupsWithDescription, descriptionKey: 'label' } }],
    ['with placeholder', { props: { ...props, placeholder: 'Search...' } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with icon', { props: { ...props, icon: 'i-lucide-terminal' } }],
    ['with trailingIcon', { props: { ...props, trailingIcon: 'i-lucide-settings' } }],
    ['with childrenIcon', { props: { ...props, childrenIcon: 'i-lucide-arrow-right' } }],
    ['with loading', { props: { ...props, loading: true } }],
    ['with loadingIcon', { props: { ...props, loading: true, loadingIcon: 'i-lucide-loader' } }],
    ['with selectedIcon', { props: { ...props, selectedIcon: 'i-lucide-badge-check', modelValue: groups[2]?.items[0] } }],
    ['with close', { props: { ...props, close: true } }],
    ['with closeIcon', { props: { ...props, close: true, closeIcon: 'i-lucide-trash' } }],
    ['with virtualize', { props: { ...props, virtualize: true } }],
    ['without input', { props: { ...props, input: false } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'divide-accented' } }],
    ['with ui', { props: { ...props, ui: { input: '[&>input]:h-10' } } }],
    // Slots
    ['with empty slot', { props, slots: { empty: () => 'Empty slot' } }],
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-description slot', { props: { groups: groupsWithDescription }, slots: { 'item-description': () => 'Item description slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Item trailing slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }],
    ['with close slot', { props: { ...props, close: true }, slots: { close: () => 'Close slot' } }],
    ['with footer slot', { props, slots: { footer: () => 'Footer slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: CommandPaletteProps, slots?: Partial<CommandPaletteSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, CommandPalette)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(CommandPalette, {
      props: {
        groups,
        close: true,
        modelValue: [groups[2]?.items[0], groups[1]?.items[0]],
        multiple: true
      }
    })

    expect(await axe(wrapper.element, {
      rules: {
        // ARIA input fields must have an accessible name (aria-input-field-name)"
        // Fix any of the following:
        //   aria-label attribute does not exist or is empty
        //   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
        //   Element has no title attribute
        'aria-input-field-name': { enabled: false }
      }
    })).toHaveNoViolations()
  })
})
