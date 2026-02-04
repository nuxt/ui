import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ChatPromptSubmit from '../../src/runtime/components/ChatPromptSubmit.vue'
import type { ChatPromptSubmitProps } from '../../src/runtime/components/ChatPromptSubmit.vue'
import ComponentRender from '../component-render'
import { UTheme } from '#components'

describe('ChatPromptSubmit', () => {
  const statuses = ['ready', 'submitted', 'streaming', 'error'] as any

  it.each([
    // Props
    ['with icon', { props: { icon: 'i-lucide-send' } }],
    ...statuses.map((status: string) => [`with status ${status}`, { props: { status } }]),
    ['with class', { props: { class: '' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ChatPromptSubmitProps }) => {
    const html = await ComponentRender(nameOrHtml, options, ChatPromptSubmit)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ChatPromptSubmit, {
      props: {
        status: 'ready'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  test('with theme works', async () => {
    const wrapper = await mountSuspended({
      components: { ChatPromptSubmit, UTheme },
      template: `
        <UTheme :ui="{ chatPromptSubmit: { slots: { base: 'test-theme-class' } } }">
          <ChatPromptSubmit status="ready" />
        </UTheme>
      `
    })

    expect(wrapper.find('button').classes()).toContain('test-theme-class')
  })
})
