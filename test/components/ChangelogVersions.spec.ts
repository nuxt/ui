import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import ChangelogVersions from '../../src/runtime/components/ChangelogVersions.vue'

describe('ChangelogVersions', () => {
  const versions = [{
    title: 'Title 1',
    description: 'Description 1',
    date: '2024-12-13T09:32:32.598Z',
    image: {
      src: 'https://picsum.photos/640/360',
      alt: 'Image alt'
    },
    badge: { label: 'Badge' },
    authors: [{
      name: 'benjamincanac',
      avatar: {
        src: 'https://github.com/benjamincanac.png',
        alt: 'benjamincanac'
      }
    }]
  }]

  const props = { versions }

  renderEach(ChangelogVersions, [
    // Props
    ['with versions', { props }],
    ['without indicator', { props: { ...props, indicator: false } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'absolute' } }],
    ['with ui', { props: { ...props, ui: { indicator: 'bg-primary' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with indicator slot', { props, slots: { indicator: () => 'Indicator slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ChangelogVersions, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
