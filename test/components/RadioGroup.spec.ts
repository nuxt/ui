import { describe, it, expect } from 'vitest'
import { defu } from 'defu'
import RadioGroup, { type RadioGroupProps } from '../../src/runtime/components/RadioGroup.vue'
import ComponentRender from '../component-render'

const defaultOptions = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' }
]

describe('RadioGroup', () => {
  it.each([
    ['basic case', {}],
    ['with default value', { props: { defaultValue: '1' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with description', { props: { options: defaultOptions.map((opt, count) => ({ ...opt, description: `Description ${count}` })) } }],
    ['with required', { props: { legend: 'Legend', required: true } }],
    ['with custom color', { props: { color: 'red' as const } }],
    ['with size 2xs', { props: { size: '2xs' as const } }],
    ['with size xs', { props: { size: 'xs' as const } }],
    ['with size sm', { props: { size: 'sm' as const } }],
    ['with size md', { props: { size: 'md' as const } }],
    ['with size lg', { props: { size: 'lg' as const } }],
    ['with size xl', { props: { size: 'xl' as const } }],
    ['with class', { props: { class: 'bg-red-500' } }],
    ['with ui', { props: { ui: {} } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: RadioGroupProps<any>, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, defu(options, { props: { options: defaultOptions } }), RadioGroup)
    expect(html).toMatchSnapshot()
  })
})
