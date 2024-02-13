import { describe, it, expect } from 'vitest'
import { UCarousel } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Carousel', () => {
  it.each([
    ['basic case', { props: { ui: { wrapper: 'relative' } } }],
    ['with arrows and indicators', { props: { arrows: true, indicators: true, ui: { wrapper: 'relative', arrows: { wrapper: 'flex items-center justify-between' }, default: { prevButton: { color: 'red' }, nextButton: { color: 'red' } }, indicators: { wrapper: 'absolute flex items-center justify-center gap-3 bottom-4 inset-x-0' } } } }],
    ['with arrows only', { props: { arrows: true, indicators: false, ui: { wrapper: 'relative', arrows: { wrapper: 'flex items-center justify-between' }, default: { prevButton: { color: 'red' }, nextButton: { color: 'red' } }, indicators: { wrapper: 'absolute flex items-center justify-center gap-3 bottom-4 inset-x-0' } } } }],
    ['with indicators only', { props: { arrows: false, indicators: true, ui: { wrapper: 'relative', arrows: { wrapper: 'flex items-center justify-between' }, default: { prevButton: { color: 'red' }, nextButton: { color: 'red' } }, indicators: { wrapper: 'absolute flex items-center justify-center gap-3 bottom-4 inset-x-0' } } } }],
    ['with custom previous button', { props: { arrows: true, prevButton: { label: 'Custom previous button' }, ui: { wrapper: 'relative', arrows: { wrapper: 'flex items-center justify-between' }, default: { prevButton: { color: 'red' }, nextButton: { color: 'red' } }, indicators: { wrapper: 'absolute flex items-center justify-center gap-3 bottom-4 inset-x-0' } } } }],
    ['with custom next button', { props: { nextButton: { label: 'Custom next button', arrows: true }, ui: { wrapper: 'relative', arrows: { wrapper: 'flex items-center justify-between' }, default: { prevButton: { color: 'red' }, nextButton: { color: 'red' } }, indicators: { wrapper: 'absolute flex items-center justify-center gap-3 bottom-4 inset-x-0' } } } }],
    ['with previous slot', { slots: { prev: 'prev slot' }, props: { arrows: true, ui: { wrapper: 'relative', arrows: { wrapper: 'flex items-center justify-between' }, default: { prevButton: { color: 'red' }, nextButton: { color: 'red' } }, indicators: { wrapper: 'absolute flex items-center justify-center gap-3 bottom-4 inset-x-0' } } } }],
    ['with next slot', { slots: { next: 'next slot' }, props: { arrows: true, ui: { wrapper: 'relative', arrows: { wrapper: 'flex items-center justify-between' }, default: { prevButton: { color: 'red' }, nextButton: { color: 'red' } }, indicators: { wrapper: 'absolute flex items-center justify-center gap-3 bottom-4 inset-x-0' } } } }],
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
