import { onErrorCaptured } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { renderEach } from '../component-render'
import { ULink as Link } from '#components'

describe('Link', () => {
  renderEach(Link, [
    // Props
    ['with as', { props: { as: 'div' } }],
    ['with to', { props: { to: '/' } }],
    ['with type', { props: { type: 'submit' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with activeClass', { props: { active: true, activeClass: 'text-highlighted' } }],
    ['with inactiveClass', { props: { active: false, inactiveClass: 'hover:text-primary' } }],
    ['with raw', { props: { raw: true } }],
    ['with raw activeClass', { props: { raw: true, active: true, activeClass: 'text-highlighted' } }],
    ['with raw inactiveClass', { props: { raw: true, active: false, inactiveClass: 'hover:text-primary' } }],
    ['with class', { props: { class: 'font-medium' } }],
    ['with external to', { props: { to: 'https://example.com' } }],
    ['with external to and target', { props: { to: 'https://example.com', target: '_blank' } }],
    ['with internal to and target', { props: { to: '/about', target: '_blank' } }],
    ['with internal to object and target', { props: { to: { path: '/about' }, target: '_blank' } }],
    ['with internal to and rel', { props: { to: '/about', rel: 'nofollow' } }],
    ['with internal to and noRel', { props: { to: '/about', rel: 'nofollow', noRel: true } }],
    ['with external to and rel', { props: { to: 'https://example.com', rel: 'nofollow' } }],
    ['with external prop', { props: { to: '/api/download', external: true } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])

  it('propagates async click handler errors to onErrorCaptured', async () => {
    const onError = vi.fn(() => false)
    const wrapper = await mountSuspended({
      components: { Link },
      setup() {
        onErrorCaptured(onError)

        return { onClick: () => Promise.reject(new Error('click error')) }
      },
      template: `
        <Link @click="onClick"> Click </Link>
      `
    })

    wrapper.find('button').trigger('click')
    await flushPromises()

    expect(onError).toHaveBeenCalledOnce()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Link, {
      props: {
        to: '/'
      },
      slots: {
        default: () => 'Home'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
