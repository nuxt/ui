import { describe, it, expect } from 'vitest'
import Button, { type ButtonProps } from '../../src/runtime/components/Button.vue'
import ComponentRender from '../component-render'

describe('Button', () => {
  it.each([
    ['with label', { props: { label: 'Button' } }],
    ['with class', { props: { class: 'rounded-full font-bold' } }],
    ['with size 2xs', { props: { label: 'Button', size: '2xs' as const } }],
    ['with size xs', { props: { label: 'Button', size: 'xs' as const } }],
    ['with size sm', { props: { label: 'Button', size: 'sm' as const } }],
    ['with size md', { props: { label: 'Button', size: 'md' as const } }],
    ['with size lg', { props: { label: 'Button', size: 'lg' as const } }],
    ['with size xl', { props: { label: 'Button', size: 'xl' as const } }],
    ['with color', { props: { label: 'Button', color: 'red' as const } }],
    ['with variant outline', { props: { label: 'Button', variant: 'outline' as const } }],
    ['with variant soft', { props: { label: 'Button', variant: 'soft' as const } }],
    ['with variant subtle', { props: { label: 'Button', variant: 'subtle' as const } }],
    ['with variant ghost', { props: { label: 'Button', variant: 'ghost' as const } }],
    ['with variant link', { props: { label: 'Button', variant: 'link' as const } }],
    ['with icon', { props: { icon: 'i-heroicons-rocket-launch' } }],
    ['with leading and icon', { props: { leading: true, icon: 'i-heroicons-arrow-left' } }],
    ['with leadingIcon', { props: { leadingIcon: 'i-heroicons-arrow-left' } }],
    ['with trailing and icon', { props: { trailing: true, icon: 'i-heroicons-arrow-right' } }],
    ['with trailingIcon', { props: { trailingIcon: 'i-heroicons-arrow-right' } }],
    ['with loading', { props: { loading: true } }],
    ['with loadingIcon', { props: { loading: true, loadingIcon: 'i-heroicons-sparkles' } }],
    ['with disabled', { props: { label: 'Button', disabled: true } }],
    ['with block', { props: { label: 'Button', block: true } }],
    ['with square', { props: { label: 'Button', square: true } }],
    ['with truncate', { props: { label: 'Button', truncate: true } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ButtonProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Button)
    expect(html).toMatchSnapshot()
  })
})
