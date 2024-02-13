import { describe, it, expect } from 'vitest'
import { UCarousel } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Carousel', () => {
  it.each([
    ['basic case', {}],
    ['with arrows and indicators', { props: { arrows: true, indicators: true } }],
    ['with arrows only', { props: { arrows: true, indicators: false } }],
    ['with indicators only', { props: { arrows: false, indicators: true } }],
    ['with custom previous button', { props: { prevButton: { label: 'Previous' } } }],
    ['with custom next button', { props: { nextButton: { label: 'Next' } } }],
    ['with custom class', { props: { class: 'custom-class' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Carousel.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UCarousel)
    expect(html).toMatchSnapshot()
  })
})
