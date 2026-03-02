import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import PageFeature from '../../src/runtime/components/PageFeature.vue'
import theme from '#build/ui/page-feature'

describe('PageFeature', () => {
  const orientations = Object.keys(theme.variants.orientation) as any

  const props = {
    title: 'Title',
    description: 'Description',
    icon: 'i-lucide-house'
  }

  renderEach(PageFeature, [
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with icon', { props: { icon: 'i-lucide-house' } }],
    ['with title', { props: { title: 'Title' } }],
    ['with description', { props: { description: 'Description' } }],
    ['with to', { props: { to: 'https://github.com/benjamincanac' } }],
    ...orientations.map((orientation: string) => [`with orientation ${orientation}`, { props: { ...props, orientation } }]),
    ['with class', { props: { ...props, class: 'rounded-xl' } }],
    ['with ui', { props: { ...props, ui: { title: 'font-bold' } } }],
    // Slots
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }],
    ['with default slot', { props, slots: { default: () => 'Default slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(PageFeature, {
      props: {
        title: 'Title',
        description: 'Description',
        icon: 'i-lucide-star',
        to: 'https://github.com/benjamincanac'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
