import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ChatShimmer from '../../src/runtime/components/ChatShimmer.vue'
import { renderEach } from '../component-render'

describe('ChatShimmer', () => {
  const props = {
    label: 'Loading...'
  }

  renderEach(ChatShimmer, [
    // Props
    ['with label', { props }],
    ['with duration', { props: { ...props, duration: 3 } }],
    ['with spread', { props: { ...props, spread: 4 } }],
    ['with class', { props: { ...props, class: 'custom-class' } }],
    ['with ui', { props: { ...props, ui: { base: 'font-bold' } } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ChatShimmer, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
