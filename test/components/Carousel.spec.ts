import { defineComponent } from 'vue'
import { describe, it, expect } from 'vitest'
import Carousel, { type CarouselProps, type CarouselSlots } from '../../src/runtime/components/Carousel.vue'
import ComponentRender from '../component-render'

const CarouselWrapper = defineComponent({
  components: {
    UCarousel: Carousel as any
  },
  template: `<UCarousel v-slot="{ item }">
  <img :src="item.src" width="300" height="300" class="rounded-lg">
</UCarousel>`
})

describe('Carousel', () => {
  const items = [
    { src: 'https://picsum.photos/600/600?random=1' },
    { src: 'https://picsum.photos/600/600?random=2' },
    { src: 'https://picsum.photos/600/600?random=3' },
    { src: 'https://picsum.photos/600/600?random=4' },
    { src: 'https://picsum.photos/600/600?random=5' },
    { src: 'https://picsum.photos/600/600?random=6' }
  ]

  const props = { items }

  it.each([
    // Props
    ['with items', { props }],
    ['with orientation vertical', { props: { ...props, orientation: 'vertical' as const } }],
    ['with arrows', { props: { ...props, arrows: true } }],
    ['with prev', { props: { ...props, arrows: true, prev: { color: 'primary' as const } } }],
    ['with prevIcon', { props: { ...props, arrows: true, prevIcon: 'i-lucide-arrow-left' } }],
    ['with next', { props: { ...props, arrows: true, next: { color: 'primary' as const } } }],
    ['with nextIcon', { props: { ...props, arrows: true, nextIcon: 'i-lucide-arrow-right' } }],
    ['with dots', { props: { ...props, dots: true } }],
    ['with as', { props: { ...props, as: 'nav' } }],
    ['with class', { props: { ...props, class: 'w-full max-w-xs' } }],
    ['with ui', { props: { ...props, ui: { viewport: 'h-[320px]' } } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: CarouselProps<typeof items[number]>, slots?: Partial<CarouselSlots<typeof items[number]>> }) => {
    const html = await ComponentRender(nameOrHtml, options, CarouselWrapper)
    expect(html).toMatchSnapshot()
  })
})
