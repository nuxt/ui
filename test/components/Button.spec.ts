import { describe, it, expect } from 'vitest'
import { UButton } from '#components'
import ComponentRender from './component-render'

describe('Button', () => {
  it.each([
    ['with label', { props: { label: 'Button' } }],
    ['with size', { props: { label: 'Button', size: 'lg' } }],
    ['with color', { props: { label: 'Button', color: 'red' } }],
    ['with variant', { props: { label: 'Button', variant: 'outline' } }],
    ['with icon', { props: { icon: 'i-heroicons-academic-cap' } }],
    ['with trailingIcon', { props: { trailing: true, trailingIcon: 'i-heroicons-arrow-right' } }],
    ['with leadingIcon', { props: { leading: true, leadingIcon: 'i-heroicons-arrow-left' } }],
    ['with loading', { props: { loading: true } }],
    ['with loadingIcon', { props: { loading: true, loadingIcon: 'i-heroicons-sparkles' } }],
    ['with disabled', { props: { label: 'Button', disabled: true } }],
    ['with padded', { props: { label: 'Button', padded: false } }],
    ['with block', { props: { label: 'Button', block: true } }],
    ['with square', { props: { label: 'Button', square: true } }],
    ['with truncate', { props: { label: 'Button', truncate: true } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: typeof UButton.props) => {
    const html = await ComponentRender(nameOrHtml, options, UButton)
    expect(html).toMatchSnapshot()
  })
})
