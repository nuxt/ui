import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import NumberCounter from '../../src/runtime/components/NumberCounter.vue'
import type { NumberCounterProps } from '../../src/runtime/components/NumberCounter.vue'
import ComponentRender from '../component-render'

describe('NumberCounter', () => {
  it.each([
    // Props
    ['with value', { props: { value: 1024 } }],
    ['with format', { props: { format: { notation: 'compact' } as const } }],
    ['with prefix', { props: { prefix: '$' } }],
    ['with suffix', { props: { suffix: '$' } }],
    ['with willChange', { props: { willChange: true } }],
    ['with class', { props: { class: 'text-primary' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: Partial<NumberCounterProps> }) => {
    const html = await ComponentRender(nameOrHtml, options, NumberCounter)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(NumberCounter, {
      props: {
        value: 1024
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
