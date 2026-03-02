import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import BlogPosts from '../../src/runtime/components/BlogPosts.vue'

describe('BlogPosts', () => {
  const posts = [{
    title: 'Title',
    description: 'Description',
    date: '2024-12-13T09:32:32.598Z',
    image: {
      src: 'https://picsum.photos/640/360',
      alt: 'Image alt'
    },
    badge: { label: 'Badge' },
    authors: [{
      name: 'Author',
      avatar: {
        src: 'https://i.pravatar.cc/120?img=1'
      }
    }]
  }]

  const props = { posts }

  renderEach(BlogPosts, [
    // Props
    ['with posts', { props }],
    ['with orientation vertical', { props: { ...props, orientation: 'vertical' } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'gap-y-12' } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(BlogPosts, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
