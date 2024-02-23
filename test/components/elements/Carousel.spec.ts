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
    ['with custom previous button', { props: { arrows: true } }],
    ['with custom next button', { props: { nextButton: { label: 'Custom next button', arrows: true } } }],
    ['with prev slot', { slots: { prev: () => 'prev slot' }, props: { arrows: true } }],
    ['with next slot', { slots: { next: () => 'next slot' }, props: { arrows: true } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UCarousel.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UCarousel)
    expect(html).toMatchSnapshot()
  })
})
