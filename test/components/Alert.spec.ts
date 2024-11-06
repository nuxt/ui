import { describe, it, expect } from 'vitest'
import Alert, { type AlertProps, type AlertSlots } from '../../src/runtime/components/Alert.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/alert'

describe('Alert', () => {
  const variants = Object.keys(theme.variants.variant) as any

  const props = { title: 'Alert' }

  it.each([
    // Props
    ['with title', { props }],
    ['with description', { props: { ...props, description: 'Description' } }],
    ['with icon', { props: { ...props, icon: 'i-lucide-lightbulb' } }],
    ['with avatar', { props: { ...props, avatar: { src: 'https://github.com/benjamincanac.png' } } }],
    ['with close', { props: { ...props, close: true } }],
    ['with closeIcon', { props: { ...props, close: true, closeIcon: 'i-lucide-trash' } }],
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { ...props, variant } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { ...props, variant, color: 'neutral' } }]),
    ['with as', { props: { ...props, as: 'article' } }],
    ['with class', { props: { ...props, class: 'w-48' } }],
    ['with ui', { props: { ...props, ui: { title: 'font-bold' } } }],
    // Slots
    ['with leading slot', { props, slots: { title: () => 'Leading slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }],
    ['with close slot', { props, slots: { close: () => 'Close slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: AlertProps, slots?: Partial<AlertSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Alert)
    expect(html).toMatchSnapshot()
  })
})
