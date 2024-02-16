import { describe, it, expect } from 'vitest'
import { UButton } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import uiButton from '../../../src/runtime/ui.config/elements/button'

describe('Button', () => {
  it.each([
    ['basic case', {}],
    ['with block', { props: { block: true, ui: { block: 'w-fit' } } }],
    ['with label', { props: { label: 'Submit' } }],
    ['with default slot', { slots: { default: 'Default slot' } }],
    ['with loading', { props: { loading: true } }],
    ['with loadingIcon', { props: { loading: true, loadingIcon: 'i-heroicons-sparkles' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with padded', { props: { padded: false, size: 'lg' } }],
    ['with size', { props: { size: 'lg' } }],
    ['with color', { props: { color: 'red' } }],
    ['with variant', { props: { variant: 'outline' } }],
    ['with icon', { props: { icon: 'i-heroicons-academic-cap' } }],
    ['with trailing slot', { slots: { trailing: 'Trailing slot' } }],
    ['with leading slot', { slots: { leading: 'leading slot' } }],
    ['with trailingIcon', { props: { trailing: true, trailingIcon: 'i-heroicons-arrow-right' } }],
    ['with leadingIcon', { props: { leading: true, leadingIcon: 'i-heroicons-arrow-left' } }],
    ['with square', { props: { label: 'submit', square: true, size: 'sm', ui: uiButton } }],
    ['with truncate', { props: { label: 'submit', truncate: true, ui: uiButton } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Button.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UButton)
    expect(html).toMatchSnapshot()
  })
})
