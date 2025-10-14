import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BlogPost from '../../src/runtime/components/BlogPost.vue'
import type { BlogPostProps, BlogPostSlots } from '../../src/runtime/components/BlogPost.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/blog-post'

describe('BlogPost', () => {
  const variants = Object.keys(theme.variants.variant) as any
  const orientations = Object.keys(theme.variants.orientation) as any

  const author1 = {
    name: 'Benjamin Canac',
    description: 'benjamincanac',
    avatar: { src: 'https://github.com/benjamincanac.png', alt: 'benjamincanac' }
  }

  const author2 = {
    name: 'Sebastien Chopin',
    description: 'atinux',
    avatar: { src: 'https://github.com/atinux.png', alt: 'atinux' }
  }

  const props = {
    title: 'Title',
    description: 'Description',
    image: 'https://picsum.photos/640/360',
    to: 'https://github.com/benjamincanac',
    authors: [author1],
    date: '2024-01-01',
    badge: 'Badge'
  }

  it.each([
    // Props
    ['with title', { props: { title: 'Title' } }],
    ['with description', { props: { description: 'Description' } }],
    ['with to', { props: { to: 'https://github.com/benjamincanac' } }],
    ['with image', { props: { image: 'https://picsum.photos/640/360' } }],
    ['with to & image', { props: { to: 'https://github.com/benjamincanac', image: 'https://picsum.photos/640/360' } }],
    ['with date', { props: { date: '2024-01-01' } }],
    ['with badge', { props: { badge: 'Badge' } }],
    ['with badge object', { props: { badge: { label: 'Badge', color: 'primary' as const } } }],
    ['with author', { props: { authors: [author1] } }],
    ['with authors', { props: { authors: [author1, author2] } }],
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { ...props, variant } }]),
    ...orientations.map((orientation: string) => [`with orientation ${orientation}`, { props: { ...props, orientation } }]),
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'absolute' } }],
    ['with ui', { props: { ...props, ui: { wrapper: 'items-center' } } }],
    // Slots
    ['with date slot', { props, slots: { date: () => 'Date slot' } }],
    ['with badge slot', { props, slots: { badge: () => 'Badge slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }],
    ['with authors slot', { props, slots: { authors: () => 'Authors slot' } }],
    ['with header slot', { props, slots: { header: () => 'Header slot' } }],
    ['with body slot', { props, slots: { body: () => 'Body slot' } }],
    ['with footer slot', { props, slots: { footer: () => 'Footer slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: BlogPostProps, slots?: Partial<BlogPostSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, BlogPost)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(BlogPost, {
      props: {
        ...props,
        authors: [author1, author2]
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
