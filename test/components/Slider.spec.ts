import { describe, it, expect } from 'vitest'
import Slider, { type SliderProps } from '../../src/runtime/components/Slider.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/slider'

describe('Slider', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const colors = Object.keys(theme.variants.color) as any

  it.each([
    // Props
    ['with defaultValue', { props: { defaultValue: 10 } }],
    ['with multiple thumbs', { props: { defaultValue: [0, 10] } }],
    ['with name', { props: { name: 'custom-name' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with inverted', { props: { inverted: true } }],
    ['with orientation vertical', { props: { orientation: 'vertical' as const } }],
    ['with min max step', { props: { min: 4, max: 12, step: 2 } }],
    ['with min steps between thumbs', { props: { defaultValue: [0, 30], minStepsBetweenThumbs: 30 } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...colors.map((color: string) => [`with color ${color}`, { props: { color } }]),
    ['with class', { props: { class: 'w-48' } }],
    ['with ui', { props: { ui: { track: 'bg-gray-100 dark:bg-gray-800' } } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: SliderProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Slider)
    expect(html).toMatchSnapshot()
  })
})
