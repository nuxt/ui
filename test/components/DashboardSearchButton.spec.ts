import { describe, it, expect } from 'vitest'
import DashboardSearchButton from '../../src/runtime/components/DashboardSearchButton.vue'
import type { DashboardSearchButtonProps } from '../../src/runtime/components/DashboardSearchButton.vue'
import ComponentRender from '../component-render'

describe('DashboardSearchButton', () => {
  it.each([
    // Props
    ['with label', { props: { label: 'Open' } }],
    ['with icon', { props: { icon: 'i-lucide-house' } }],
    ['with kbds', { props: { kbds: ['alt', 'o'] } }],
    ['with collapsed', { props: { collapsed: true } }],
    ['with class', { props: { class: 'w-full' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: DashboardSearchButtonProps }) => {
    const html = await ComponentRender(nameOrHtml, options, DashboardSearchButton)
    expect(html).toMatchSnapshot()
  })
})
