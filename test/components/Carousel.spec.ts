import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, it, expect, vi } from 'vitest'
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
    ['with dots and fade', { props: { ...props, dots: true, fade: true } }],
    ['with dots and multiple items per view', { props: { ...props, dots: true, ui: { item: 'basis-1/3' } } }],
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
  describe('dots before embla init', () => {
    function getDots(wrapper: { findAll: (selector: string) => { attributes: (name: string) => string | undefined }[] }) {
      return wrapper.findAll('[data-slot="carousel-dot"]').map(dot => ({
        selected: dot.attributes('aria-selected'),
        state: dot.attributes('data-state')
      }))
    }

    it('renders one dot per slide on the server with the first one active', async () => {
      const html = await renderToString(createSSRApp({ render: () => h(Carousel, { items, dots: true }) }))

      expect(html.match(/role="tab"/g)).toHaveLength(items.length)
      expect(html.match(/aria-selected="true"/g)).toHaveLength(1)
      expect(html).toMatch(/aria-selected="true"[^>]*data-state="active"/)
    })

    it('hydrates the server dots without mismatch', async () => {
      const render = () => h(Carousel, { items, dots: true, fade: true })
      const container = document.createElement('div')
      container.innerHTML = await renderToString(createSSRApp({ render }))
      document.body.appendChild(container)

      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})
      const app = createSSRApp({ render })
      app.mount(container)

      const messages = [...warn.mock.calls, ...error.mock.calls].flat().join(' ')
      warn.mockRestore()
      error.mockRestore()

      expect(messages).not.toMatch(/hydration/i)
      expect(container.querySelectorAll('[data-slot="carousel-dot"]')).toHaveLength(items.length)

      app.unmount()
      container.remove()
    })

    it.each([
      ['multiple items per view', { ui: { item: 'basis-1/3' } }],
      ['responsive items per view', { ui: { item: 'sm:basis-1/2' } }],
      ['an item per view override', { items: [...items.slice(0, 5), { ...items[5], class: 'basis-1/2' }] }],
      ['slidesToScroll', { slidesToScroll: 2 }],
      ['breakpoints', { breakpoints: { '(min-width: 768px)': { slidesToScroll: 2 } } }],
      ['active false', { active: false }]
    ])('renders no dots before init with %s', async (_, extraProps) => {
      const wrapper = await mountSuspended(Carousel, { props: { items, dots: true, ...extraProps } })

      expect(getDots(wrapper)).toHaveLength(0)
    })

    it.each([
      ['one item per view', {}, items.length],
      ['multiple items per view', { ui: { item: 'basis-1/3' } }, 4]
    ])('replaces the dots with embla scroll snaps on init with %s', async (_, extraProps, expected) => {
      // happy-dom has no layout, so give embla a 300px wide container, slides sized from their basis and no margins
      const width = (el: HTMLElement) => el.dataset.slot === 'carousel-item' && el.classList.contains('basis-1/3') ? 100 : 300
      const offsetWidth = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
        return width(this)
      })
      const offsetLeft = vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function (this: HTMLElement) {
        return this.dataset.slot === 'carousel-item' ? Array.prototype.indexOf.call(this.parentElement!.children, this) * width(this) : 0
      })
      const getComputedStyle = vi.spyOn(window, 'getComputedStyle').mockImplementation(() => ({ getPropertyValue: () => '0px' }) as unknown as CSSStyleDeclaration)

      const wrapper = await mountSuspended(Carousel, { props: { items, dots: true, ...extraProps } })
      const emblaApi = (wrapper.vm as any).emblaApi

      await new Promise(resolve => setTimeout(resolve, 0))
      await nextTick()

      offsetWidth.mockRestore()
      offsetLeft.mockRestore()
      getComputedStyle.mockRestore()

      expect(emblaApi.scrollSnapList()).toHaveLength(expected)
      expect(getDots(wrapper)).toHaveLength(expected)
      expect(getDots(wrapper)[0]).toEqual({ selected: 'true', state: 'active' })

      emblaApi.scrollTo(2, true)
      await nextTick()

      expect(getDots(wrapper)[0]).toEqual({ selected: 'false', state: undefined })
      expect(getDots(wrapper)[2]).toEqual({ selected: 'true', state: 'active' })
      expect(wrapper.emitted('select')?.at(-1)).toEqual([2])

      wrapper.unmount()
    })
  })
})
