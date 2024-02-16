import { describe, it, expect } from 'vitest'
import { UCarousel } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import uiCarousel from '../../../src/runtime/ui.config/elements/carousel'

describe('Carousel', () => {
  it.each([
    ['basic case', { props: { ui: { wrapper: uiCarousel.wrapper } } }],
    ['with arrows and indicators', { props: { arrows: true, indicators: true, ui: uiCarousel } }],
    ['with arrows only', { props: { arrows: true, indicators: false, ui: uiCarousel } }],
    ['with indicators only', { props: { arrows: false, indicators: true, ui: uiCarousel } }],
    ['with custom previous button', { props: { arrows: true, ui: uiCarousel } }],
    ['with custom next button', { props: { nextButton: { label: 'Custom next button', arrows: true }, ui: uiCarousel } }],
    ['with previous slot', { slots: { prev: 'prev slot' }, props: { arrows: true, ui: uiCarousel } }],
    ['with next slot', { slots: { next: 'next slot' }, props: { arrows: true, ui: uiCarousel } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Carousel.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UCarousel)
    expect(html).toMatchSnapshot()
  })
})
