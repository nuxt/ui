import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import DashboardSearchButton from '../../src/runtime/components/DashboardSearchButton.vue'

describe('DashboardSearchButton', () => {
  renderEach(DashboardSearchButton, [
    // Props
    ['with label', { props: { label: 'Open' } }],
    ['with icon', { props: { icon: 'i-lucide-house' } }],
    ['with kbds', { props: { kbds: ['alt', 'o'] } }],
    ['with collapsed', { props: { collapsed: true } }],
    ['with class', { props: { class: 'w-full' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(DashboardSearchButton, {
      props: {
        label: 'Open',
        icon: 'i-lucide-house',
        kbds: ['alt', 'o']
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
