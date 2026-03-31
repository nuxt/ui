import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import PageHero from '../../src/runtime/components/PageHero.vue'

describe('PageHero', () => {
  renderEach(PageHero, [
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with title', { props: { title: 'Title' } }],
    ['with description', { props: { description: 'Description' } }],
    ['with links', { props: { links: [{ label: 'Get started' }] } }],
    ['with reverse', { props: { reverse: true } }],
    ['with orientation horizontal', { props: { orientation: 'horizontal' } }],
    ['with orientation horizontal links', { props: { orientation: 'horizontal', links: [{ label: 'Get started' }] } }],
    ['with orientation horizontal reverse', { props: { orientation: 'horizontal', reverse: true } }],
    ['with class', { props: { class: 'absolute' } }],
    ['with ui', { props: { ui: { container: 'max-w-5xl' } } }],
    // Slots
    ['with top slot', { slots: { top: () => 'Top slot' } }],
    ['with header slot', { slots: { header: () => 'Header slot' } }],
    ['with headline slot', { slots: { headline: () => 'Headline slot' } }],
    ['with title slot', { slots: { title: () => 'Title slot' } }],
    ['with description slot', { slots: { description: () => 'Description slot' } }],
    ['with body slot', { slots: { body: () => 'Body slot' } }],
    ['with footer slot', { slots: { footer: () => 'Footer slot' } }],
    ['with links slot', { slots: { links: () => 'Links slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with bottom slot', { slots: { bottom: () => 'Bottom slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(PageHero, {
      props: {
        title: 'Title',
        description: 'Description',
        links: [{ label: 'Get Started', to: '/start' }, { label: 'Learn More', to: '/learn' }]
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
