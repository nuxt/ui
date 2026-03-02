import { defineComponent } from 'vue'
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Carousel from '../../src/runtime/components/Carousel.vue'

const CarouselWrapper = defineComponent({
  components: {
    UCarousel: Carousel as any
  },
  template: `<UCarousel v-slot="{ item }">
  <img :src="item.src" :alt="item.alt" width="300" height="300" class="rounded-lg">
</UCarousel>`
})

describe('Carousel', () => {
  const items = [
    { src: 'https://picsum.photos/600/600?random=1', alt: 'Image 1' },
    { src: 'https://picsum.photos/600/600?random=2', alt: 'Image 2' },
    { src: 'https://picsum.photos/600/600?random=3', alt: 'Image 3' },
    { src: 'https://picsum.photos/600/600?random=4', alt: 'Image 4' },
    { src: 'https://picsum.photos/600/600?random=5', alt: 'Image 5' },
    { src: 'https://picsum.photos/600/600?random=6', alt: 'Image 6' }
  ]

  const props = { items }

  renderEach(CarouselWrapper, [
    // Props
    ['with items', { props }],
    ['with orientation vertical', { props: { ...props, orientation: 'vertical' } }],
    ['with arrows', { props: { ...props, arrows: true } }],
    ['with prev', { props: { ...props, arrows: true, prev: { color: 'primary' } } }],
    ['with prevIcon', { props: { ...props, arrows: true, prevIcon: 'i-lucide-arrow-left' } }],
    ['with next', { props: { ...props, arrows: true, next: { color: 'primary' } } }],
    ['with nextIcon', { props: { ...props, arrows: true, nextIcon: 'i-lucide-arrow-right' } }],
    ['with dots', { props: { ...props, dots: true } }],
    ['with as', { props: { ...props, as: 'nav' } }],
    ['with class', { props: { ...props, class: 'w-full max-w-xs' } }],
    ['with ui', { props: { ...props, ui: { viewport: 'h-[320px]' } } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(CarouselWrapper, {
      props: {
        items,
        arrows: true,
        dots: true
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
