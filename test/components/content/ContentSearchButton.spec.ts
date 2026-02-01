import { describe, it, expect, test } from 'vitest'
import ContentSearchButton from '../../../src/runtime/components/content/ContentSearchButton.vue'
import type { ContentSearchButtonProps } from '../../../src/runtime/components/content/ContentSearchButton.vue'
import ComponentRender from '../../component-render'
import { UTheme } from '#components'

describe('DashboardSearchButton', () => {
  it.each([
    // Props
    ['with label', { props: { label: 'Open' } }],
    ['with icon', { props: { icon: 'i-lucide-house' } }],
    ['with kbds', { props: { kbds: ['alt', 'o'] } }],
    ['without collapsed', { props: { collapsed: false } }],
    ['with class', { props: { class: 'w-full' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ContentSearchButtonProps }) => {
    const html = await ComponentRender(nameOrHtml, options, ContentSearchButton)
    expect(html).toMatchSnapshot()
  })

  test('with theme works', async () => {
    const { mountSuspended } = await import('@nuxt/test-utils/runtime')
    const wrapper = await mountSuspended({
      components: { ContentSearchButton, UTheme },
      template: `
        <UTheme :theme="{ contentSearchButton: { slots: { base: 'test-theme-class' } } }">
          <ContentSearchButton />
        </UTheme>
      `
    })

    expect(wrapper.find('button').classes()).toContain('test-theme-class')
  })
})
