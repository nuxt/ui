import { describe, it, expect } from 'vitest'
import Alert, { type AlertProps } from '../../src/runtime/components/Alert.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/alert'

describe('Alert', () => {
  const colors = Object.keys(theme.variants.color) as any
  const variants = Object.keys(theme.variants.variant) as any

  it.each([
    // Props
    ['with title', { props: { title: 'Title' } }],
    ['with description', { props: { title: 'Title', description: 'Description' } }],
    ['with icon', { props: { title: 'Title', icon: 'i-heroicons-light-bulb' } }],
    ['with avatar', { props: { title: 'Title', avatar: { src: 'https://avatars.githubusercontent.com/u/739984?v=4' } } }],
    ['with as', { props: { title: 'Title', as: 'article' } }],
    ...colors.map((color: string) => [`with color ${color}`, { props: { label: 'Badge', color } }]),
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { label: 'Badge', color: 'primary', variant } }]),
    ['with class', { props: { class: 'w-48' } }],
    ['with ui', { props: { ui: { title: 'font-bold' } } }],
    // Slots
    ['with leading slot', { slots: { title: () => 'Leading slot' } }],
    ['with title slot', { slots: { title: () => 'Title slot' } }],
    ['with description slot', { slots: { description: () => 'Description slot' } }],
    ['with close slot', { slots: { close: () => 'Close slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: AlertProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Alert)
    expect(html).toMatchSnapshot()
  })
})
