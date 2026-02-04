import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DashboardSearchButton from '../../src/runtime/components/DashboardSearchButton.vue'
import type { DashboardSearchButtonProps } from '../../src/runtime/components/DashboardSearchButton.vue'
import ComponentRender from '../component-render'
import { UTheme } from '#components'

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

  test('with theme works', async () => {
    const wrapper = await mountSuspended({
      components: { DashboardSearchButton, UTheme },
      template: `
        <UTheme :ui="{ dashboardSearchButton: { slots: { base: 'test-theme-class' } } }">
          <DashboardSearchButton label="Search" />
        </UTheme>
      `
    })

    expect(wrapper.find('button').classes()).toContain('test-theme-class')
  })
})
