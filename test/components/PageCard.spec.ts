import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PageCard from '../../src/runtime/components/PageCard.vue'
import type { PageCardProps, PageCardSlots } from '../../src/runtime/components/PageCard.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/page-card'

describe('PageCard', () => {
  const variants = Object.keys(theme.variants.variant) as any
  const orientations = Object.keys(theme.variants.orientation) as any
  const highlightColors = Object.keys(theme.variants.highlightColor) as any
  const spotlightColors = Object.keys(theme.variants.spotlightColor) as any

  const props = {
    title: 'Title',
    description: 'Description',
    icon: 'i-lucide-house'
  }

  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with icon', { props: { icon: 'i-lucide-house' } }],
    ['with title', { props: { title: 'Title' } }],
    ['with description', { props: { description: 'Description' } }],
    ['with to', { props: { to: 'https://github.com/benjamincanac' } }],
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { ...props, variant } }]),
    ...variants.map((variant: string) => [`with variant ${variant} to`, { props: { ...props, variant, to: 'https://github.com/benjamincanac' } }]),
    ...variants.map((variant: string) => [`with variant ${variant} highlight`, { props: { ...props, variant, highlight: true } }]),
    ...orientations.map((orientation: string) => [`with orientation ${orientation}`, { props: { ...props, orientation } }]),
    ...orientations.map((orientation: string) => [`with orientation ${orientation} reverse`, { props: { ...props, orientation, reverse: true } }]),
    ['with highlight', { props: { ...props, highlight: true } }],
    ...highlightColors.map((highlightColor: string) => [`with highlight color ${highlightColor}`, { props: { ...props, highlight: true, highlightColor } }]),
    ['with highlight color neutral', { props: { ...props, highlight: true, highlightColor: 'neutral' } }],
    ['with spotlight', { props: { ...props, spotlight: true } }],
    ...spotlightColors.map((spotlightColor: string) => [`with spotlight color ${spotlightColor}`, { props: { ...props, spotlight: true, spotlightColor } }]),
    ['with spotlight color neutral', { props: { ...props, spotlight: true, spotlightColor: 'neutral' } }],
    ['with class', { props: { ...props, class: 'rounded-xl' } }],
    ['with ui', { props: { ...props, ui: { title: 'font-bold' } } }],
    // Slots
    ['with header slot', { props, slots: { header: () => 'Header slot' } }],
    ['with body slot', { props, slots: { body: () => 'Body slot' } }],
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }],
    ['with footer slot', { props, slots: { footer: () => 'Footer slot' } }],
    ['with default slot', { props, slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PageCardProps, slots?: Partial<PageCardSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, PageCard)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(PageCard, {
      props: {
        title: 'Title',
        description: 'Description',
        icon: 'i-lucide-card',
        to: 'https://github.com/benjamincanac'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
