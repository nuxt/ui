import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BlogPosts from '../../src/runtime/components/BlogPosts.vue'
import type { BlogPostsProps, BlogPostsSlots } from '../../src/runtime/components/BlogPosts.vue'
import ComponentRender from '../component-render'

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

  it.each([
    // Props
    ['with posts', { props }],
    ['with orientation vertical', { props: { ...props, orientation: 'vertical' as const } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'gap-y-12' } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: BlogPostsProps, slots?: Partial<BlogPostsSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, BlogPosts)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(BlogPosts, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
