import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Repeater from '../../src/runtime/components/Repeater.vue'
import ComponentRender from '../component-render'
import theme from '../../src/theme/repeater'

vi.mock('@vueuse/integrations/useSortable', () => ({
  useSortable: () => ({ stop: vi.fn() })
}))

type LooseTestOptions = {
  props?: Record<string, any>
  slots?: Record<string, any>
}

type TestCase = [string, LooseTestOptions]

describe('Repeater', () => {
  const variants = Object.keys(theme.variants.variant) as any
  const sizes = Object.keys(theme.variants.size) as any

  const items = [
    { id: 1, text: 'Item 1', status: 'done' },
    { id: 2, text: 'Item 2', status: 'pending' },
    { id: 3, text: 'Item 3', status: 'todo' }
  ]

  const props = { modelValue: items }

  const testCases: TestCase[] = [
    ['with items', { props }],
    ['empty list', { props: { modelValue: [] } }],
    ['with class', { props: { ...props, class: 'w-full max-w-md' } }],
    ['with ui', { props: { ...props, ui: { item: 'bg-red-500' } } }],
    ['drag disabled', { props: { ...props, dragEnabled: false } }],
    ['without add button', { props: { ...props, addButton: false } }],
    ['custom add label', { props: { ...props, addButtonLabel: 'New Entry' } }],
    ['without remove button', { props: { ...props, removeButton: false } }],
    ['with sort buttons', { props: { ...props, sortButtons: true } }],
    ['disabled state', { props: { ...props, disabled: true } }],
    ['max items reached', { props: { modelValue: items, maxItems: 3 } }],
    ['min items reached', { props: { modelValue: [items[0]], minItems: 1 } }],
    ['custom icons', {
      props: {
        ...props,
        sortButtons: true,
        handleIcon: 'i-heroicons-cursor-arrow-rays',
        addIcon: 'i-heroicons-plus-circle',
        removeIcon: 'i-heroicons-x-mark',
        sortUpIcon: 'i-heroicons-arrow-up',
        sortDownIcon: 'i-heroicons-arrow-down'
      }
    }],
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { ...props, variant } }] as TestCase),
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }] as TestCase),
    ['with default slot', {
      props,
      slots: {
        default: ({ item }: any) => `Custom Content: ${item.text}`
      }
    }],
    ['with header slot', {
      props,
      slots: {
        header: ({ index }: any) => `Header #${index + 1}`
      }
    }],
    ['with header-actions slot', {
      props,
      slots: {
        'header-actions': () => 'Action'
      }
    }],
    ['with footer slot', {
      props: { ...props, sortButtons: true },
      slots: {
        footer: ({ item }: any) => `Status: ${item.status}`
      }
    }],
    ['with actions slot', {
      props,
      slots: {
        actions: () => 'Custom Actions'
      }
    }],
    ['with empty slot', {
      props: { modelValue: [] },
      slots: {
        empty: () => 'List is empty!'
      }
    }],
    ['with add-button slot', {
      props,
      slots: {
        'add-button': () => 'Custom Add Button'
      }
    }]
  ]

  it.each(testCases)('renders %s correctly', async (nameOrHtml, options) => {
    const html = await ComponentRender(nameOrHtml, options as any, Repeater)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Repeater, {
      props: {
        modelValue: items,
        sortButtons: true,
        addButtonLabel: 'Add Item'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
