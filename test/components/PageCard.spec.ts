import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import PageCard from '../../src/runtime/components/PageCard.vue'
import theme from '#build/ui/page-card'
import { requestIdleCallback } from '../../src/runtime/utils/prefetch'

describe('PageCard', () => {
  const variants = Object.keys(theme.variants.variant) as any
  const orientations = Object.keys(theme.variants.orientation) as any
  const highlightColors = Object.keys(theme.variants.highlightColor) as any
  const spotlightColors = Object.keys(theme.variants.spotlightColor) as any

  const props = {
    title: 'Title',
    description: 'Description',
    icon: 'i-lucide-house'
  }

  renderEach(PageCard, [
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with as object', { props: { title: 'Title', as: { root: 'section', title: 'h3' } } }],
    ['with icon', { props: { icon: 'i-lucide-house' } }],
    ['with title', { props: { title: 'Title' } }],
    ['with description', { props: { description: 'Description' } }],
    ['with to', { props: { to: 'https://github.com/benjamincanac' } }],
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { ...props, variant } }]),
    ...variants.map((variant: string) => [`with variant ${variant} to`, { props: { ...props, variant, to: 'https://github.com/benjamincanac' } }]),
    ...variants.map((variant: string) => [`with variant ${variant} highlight`, { props: { ...props, variant, highlight: true } }]),
    ...orientations.map((orientation: string) => [`with orientation ${orientation}`, { props: { ...props, orientation } }]),
    ...orientations.map((orientation: string) => [`with orientation ${orientation} reverse`, { props: { ...props, orientation, reverse: true } }]),
    ['with highlight', { props: { ...props, highlight: true } }],
    ...highlightColors.map((highlightColor: string) => [`with highlight color ${highlightColor}`, { props: { ...props, highlight: true, highlightColor } }]),
    ['with highlight color neutral', { props: { ...props, highlight: true, highlightColor: 'neutral' } }],
    ['with spotlight', { props: { ...props, spotlight: true } }],
    ...spotlightColors.map((spotlightColor: string) => [`with spotlight color ${spotlightColor}`, { props: { ...props, spotlight: true, spotlightColor } }]),
    ['with spotlight color neutral', { props: { ...props, spotlight: true, spotlightColor: 'neutral' } }],
    ['with class', { props: { ...props, class: 'rounded-xl' } }],
    ['with ui', { props: { ...props, ui: { title: 'font-bold' } } }],
    // Slots
    ['with header slot', { props, slots: { header: () => 'Header slot' } }],
    ['with body slot', { props, slots: { body: () => 'Body slot' } }],
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }],
    ['with footer slot', { props, slots: { footer: () => 'Footer slot' } }],
    ['with default slot', { props, slots: { default: () => 'Default slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(PageCard, {
      props: {
        title: 'Title',
        description: 'Description',
        icon: 'i-lucide-card',
        to: 'https://github.com/benjamincanac'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('forwards attrs to root when `to` prop is absent', async () => {
    const wrapper = await mountSuspended(PageCard, {
      props: { title: 'Title' },
      attrs: { 'aria-label': 'test-label', 'data-testid': 'test-id' }
    })
    expect(wrapper.attributes('aria-label')).toBe('test-label')
    expect(wrapper.attributes('data-testid')).toBe('test-id')
  })

  describe('spotlight', () => {
    const idle = () => new Promise<void>(resolve => requestIdleCallback(resolve))
    const mouseEvents = ['mousemove', 'scroll', 'resize']

    function spyOnClientRects() {
      return vi.spyOn(Element.prototype, 'getClientRects').mockReturnValue([{ left: 0, top: 0, width: 100, height: 100 }] as unknown as DOMRectList)
    }

    function moveMouse(x: number, y: number) {
      const event = new MouseEvent('mousemove')
      Object.defineProperties(event, { pageX: { value: x }, pageY: { value: y } })
      window.dispatchEvent(event)
    }

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('does not measure the card without `spotlight`', async () => {
      const getClientRects = spyOnClientRects()
      const wrapper = await mountSuspended(PageCard, { props, attachTo: document.body })
      await idle()
      moveMouse(10, 20)
      await nextTick()

      expect(getClientRects.mock.contexts).not.toContain(wrapper.element)
      wrapper.unmount()
    })

    it('does not listen to the mouse without `spotlight`', async () => {
      const addEventListener = vi.spyOn(window, 'addEventListener')
      const wrapper = await mountSuspended(PageCard, { props, attachTo: document.body })
      await idle()

      expect(addEventListener.mock.calls.map(([type]) => type).filter(type => mouseEvents.includes(type))).toEqual([])
      wrapper.unmount()
    })

    it('stops listening to the mouse once `spotlight` is disabled or the card unmounts', async () => {
      spyOnClientRects()
      const removeEventListener = vi.spyOn(window, 'removeEventListener')
      const removed = () => removeEventListener.mock.calls.map(([type]) => type)
      const wrapper = await mountSuspended(PageCard, { props: { ...props, spotlight: true }, attachTo: document.body })
      await idle()

      await wrapper.setProps({ spotlight: false })
      expect(removed()).toEqual(expect.arrayContaining(mouseEvents))

      await wrapper.setProps({ spotlight: true })
      removeEventListener.mockClear()
      wrapper.unmount()
      expect(removed()).toEqual(expect.arrayContaining(mouseEvents))
    })

    it('tracks the mouse with `spotlight` once idle', async () => {
      const getClientRects = spyOnClientRects()
      const wrapper = await mountSuspended(PageCard, { props: { ...props, spotlight: true }, attachTo: document.body })
      expect(getClientRects.mock.contexts).not.toContain(wrapper.element)

      await idle()
      moveMouse(10, 20)
      await nextTick()

      expect(getClientRects.mock.contexts).toContain(wrapper.element)
      expect(wrapper.attributes('style')).toContain('--spotlight-x: 10px')
      expect(wrapper.attributes('style')).toContain('--spotlight-y: 20px')
      wrapper.unmount()
    })
  })

  it('forwards attrs to link when `to` prop is set', async () => {
    const wrapper = await mountSuspended(PageCard, {
      props: { title: 'Title', to: 'https://github.com/benjamincanac' },
      attrs: { 'aria-label': 'test-label' }
    })
    expect(wrapper.attributes('aria-label')).toBeUndefined()
    expect(wrapper.find('a').attributes('aria-label')).toBe('test-label')
  })
})
