import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FooterColumns from '../../src/runtime/components/FooterColumns.vue'
import type { FooterColumnsProps, FooterColumnsSlots } from '../../src/runtime/components/FooterColumns.vue'
import ComponentRender from '../component-render'

describe('FooterColumns', () => {
  const columns = [{
    label: 'Community',
    children: [{
      label: 'Nuxters',
      to: 'https://nuxters.nuxt.com',
      target: '_blank',
      icon: 'i-lucide-users'
    }, {
      label: 'Nuxt on GitHub',
      to: 'https://github.com/nuxt',
      target: '_blank'
    }, {
      label: 'Documentation'
    }, {
      label: 'Design Kit'
    }]
  }, {
    label: 'Enterprise',
    children: [{
      label: 'Support'
    }, {
      label: 'Agencies'
    }, {
      label: 'Jobs'
    }, {
      label: 'Sponsors'
    }]
  }, {
    label: 'Solutions',
    children: [{
      label: 'Nuxt Content',
      to: 'https://content.nuxt.com/',
      target: '_blank'
    }, {
      label: 'Nuxt DevTools',
      to: 'https://devtools.nuxt.com/',
      target: '_blank'
    }, {
      label: 'Nuxt Image',
      to: 'https://image.nuxt.com/',
      target: '_blank'
    }, {
      label: 'Nuxt UI',
      to: 'https://ui.nuxt.com/',
      target: '_blank'
    }]
  }]

  const props = { columns }

  it.each([
    // Props
    ['with columns', { props }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'px-10' } }],
    ['with ui', { props: { ...props, ui: { list: 'lg:gap-1.5' } } }],
    // Slots
    ['with left slot', { props, slots: { left: () => 'Left slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with right slot', { props, slots: { right: () => 'Right slot' } }],
    ['with column-label slot', { props, slots: { 'column-label': () => 'Column label slot' } }],
    ['with link slot', { props, slots: { link: () => 'Link slot' } }],
    ['with link-leading slot', { props, slots: { 'link-leading': () => 'Link leading slot' } }],
    ['with link-label slot', { props, slots: { 'link-label': () => 'Link label slot' } }],
    ['with link-trailing slot', { props, slots: { 'link-trailing': () => 'Link trailing slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: FooterColumnsProps, slots?: Partial<FooterColumnsSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, FooterColumns)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(FooterColumns, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
