import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Shimmer from '../../src/runtime/components/Shimmer.vue'
import type { ShimmerProps } from '../../src/runtime/components/Shimmer.vue'
import ComponentRender from '../component-render'

describe('Shimmer', () => {
  const props = { text: 'Loading...' }

  it.each([
    // Props
    ['with text', { props }],
    ['with as', { props: { ...props, as: 'div' } }],
    ['with duration', { props: { ...props, duration: 3 } }],
    ['with spread', { props: { ...props, spread: 4 } }],
    ['with class', { props: { ...props, class: 'text-lg' } }],
    ['with ui', { props: { ...props, ui: { base: 'font-bold' } } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ShimmerProps }) => {
    const html = await ComponentRender(nameOrHtml, options, Shimmer)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Shimmer, {
      props: {
        text: 'Loading content...'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
