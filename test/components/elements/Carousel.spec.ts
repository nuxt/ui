import { describe, it, expect } from 'vitest'
import { UCarousel } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import ui from '../../../src/runtime/ui.config/elements/carousel'

describe('Carousel', () => {
  it.each([
    ['basic case', { props: { ui: { wrapper: ui.wrapper } } }],
    ['with arrows and indicators', { props: { arrows: true, indicators: true, ui: { wrapper: ui.wrapper, arrows: { wrapper: ui.arrows.wrapper }, default: { prevButton: { color: ui.default.prevButton.color }, nextButton: { color: ui.default.nextButton.color } }, indicators: { wrapper: ui.indicators.wrapper } } } }],
    ['with arrows only', { props: { arrows: true, indicators: false, ui: { wrapper: ui.wrapper, arrows: { wrapper: ui.arrows.wrapper }, default: { prevButton: { color: ui.default.prevButton.color }, nextButton: { color: ui.default.nextButton.color } }, indicators: { wrapper: ui.indicators.wrapper } } } }],
    ['with indicators only', { props: { arrows: false, indicators: true, ui: { wrapper: ui.wrapper, arrows: { wrapper: ui.arrows.wrapper }, default: { prevButton: { color: ui.default.prevButton.color }, nextButton: { color: ui.default.nextButton.color } }, indicators: { wrapper: ui.indicators.wrapper } } } }],
    ['with custom previous button', { props: { arrows: true, prevButton: { label: 'Custom previous button' }, ui: { wrapper: ui.wrapper, arrows: { wrapper: ui.arrows.wrapper }, default: { prevButton: { color: ui.default.prevButton.color }, nextButton: { color: ui.default.nextButton.color } }, indicators: { wrapper: ui.indicators.wrapper } } } }],
    ['with custom next button', { props: { nextButton: { label: 'Custom next button', arrows: true }, ui: { wrapper: ui.wrapper, arrows: { wrapper: ui.arrows.wrapper }, default: { prevButton: { color: ui.default.prevButton.color }, nextButton: { color: ui.default.nextButton.color } }, indicators: { wrapper: ui.indicators.wrapper } } } }],
    ['with previous slot', { slots: { prev: 'prev slot' }, props: { arrows: true, ui: { wrapper: ui.wrapper, arrows: { wrapper: ui.arrows.wrapper }, default: { prevButton: { color: ui.default.prevButton.color }, nextButton: { color: ui.default.nextButton.color } }, indicators: { wrapper: ui.indicators.wrapper } } } }],
    ['with next slot', { slots: { next: 'next slot' }, props: { arrows: true, ui: { wrapper: ui.wrapper, arrows: { wrapper: ui.arrows.wrapper }, default: { prevButton: { color: ui.default.prevButton.color }, nextButton: { color: ui.default.nextButton.color } }, indicators: { wrapper: ui.indicators.wrapper } } } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Carousel.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UCarousel)
    expect(html).toMatchSnapshot()
  })
})
