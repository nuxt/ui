import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
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
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])

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
