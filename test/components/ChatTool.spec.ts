import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ChatTool from '../../src/runtime/components/ChatTool.vue'
import { renderEach } from '../component-render'

describe('ChatTool', () => {
  const props = {
    text: 'Searching components'
  }

  renderEach(ChatTool, [
    // Props
    ['with text', { props }],
    ['with suffix', { props: { ...props, suffix: 'Button' } }],
    ['with streaming', { props: { ...props, streaming: true } }],
    ['with icon', { props: { ...props, icon: 'i-lucide-search' } }],
    ['with loading', { props: { ...props, loading: true } }],
    ['with loading and loadingIcon', { props: { ...props, loading: true, loadingIcon: 'i-lucide-loader' } }],
    ['with variant inline', { props: { ...props, variant: 'inline' } }],
    ['with variant card', { props: { ...props, variant: 'card' } }],
    ['with defaultOpen', { props: { ...props, defaultOpen: true } }],
    ['with chevron leading', { props: { ...props, chevron: 'leading' } }],
    ['with chevron leading and icon', { props: { ...props, chevron: 'leading', icon: 'i-lucide-search' } }],
    ['with chevron leading, icon and content', { props: { ...props, chevron: 'leading', icon: 'i-lucide-search' }, slots: { default: () => 'Tool output content' } }],
    ['with chevronIcon', { props: { ...props, chevronIcon: 'i-lucide-arrow-down' } }],
    ['with class', { props: { ...props, class: 'my-5' } }],
    ['with ui', { props: { ...props, ui: { body: 'text-muted' } } }],
    ['with actions', { props: { ...props, actions: [{ label: 'Approve' }, { label: 'Deny', color: 'neutral' as const, variant: 'soft' as const }] } }],
    ['with actions variant card', { props: { ...props, variant: 'card' as const, actions: [{ label: 'Approve' }, { label: 'Deny' }] } }],
    ['with actions and content', { props: { ...props, actions: [{ label: 'Approve' }, { label: 'Deny' }] }, slots: { default: () => 'Tool output content' } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Tool output content' } }],
    ['with actions slot', { props, slots: { actions: () => 'Custom actions' } }]
  ])

  it('auto-opens when actions and content are present', async () => {
    const wrapper = await mountSuspended(ChatTool, {
      props: { ...props, actions: [{ label: 'Approve' }] },
      slots: { default: () => 'Tool output content' }
    })

    expect(wrapper.find('[data-slot="root"]').attributes('data-state')).toBe('open')
  })

  it('does not auto-open when there is no content', async () => {
    const wrapper = await mountSuspended(ChatTool, {
      props: { ...props, actions: [{ label: 'Approve' }] }
    })

    expect(wrapper.find('[data-slot="root"]').attributes('data-state')).toBe('closed')
  })

  it('does not auto-open when defaultOpen is explicitly set', async () => {
    const wrapper = await mountSuspended(ChatTool, {
      props: { ...props, actions: [{ label: 'Approve' }], defaultOpen: false },
      slots: { default: () => 'Tool output content' }
    })

    expect(wrapper.find('[data-slot="root"]').attributes('data-state')).toBe('closed')
  })

  it('calls the action onClick when the action button is clicked', async () => {
    const onClick = vi.fn()
    const wrapper = await mountSuspended(ChatTool, {
      props: { ...props, actions: [{ label: 'Approve', onClick }] }
    })

    await wrapper.find('[data-slot="actions"] button').trigger('click')

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not render the actions without actions', async () => {
    const wrapper = await mountSuspended(ChatTool, {
      props
    })

    expect(wrapper.find('[data-slot="actions"]').exists()).toBe(false)
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ChatTool, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
