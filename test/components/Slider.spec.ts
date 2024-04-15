import { describe, it, expect } from 'vitest'
import Slider, { type SliderProps } from '../../src/runtime/components/Slider.vue'
import ComponentRender from '../component-render'

describe('Slider', () => {
  it.each([
    ['basic case', {}],
    ['with class', { props: { class: 'w-48' } }],
    ['with ui', { props: { ui: { track: 'bg-gray-100 dark:bg-gray-800' } } }],
    ['with defaultValue', { props: { defaultValue: 10 } }],
    ['with multiple thumbs', { props: { defaultValue: [0, 10] } }],
    ['with name', { props: { name: 'custom-name' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with inverted', { props: { inverted: true } }],
    ['with orientation', { props: { orientation: 'vertical' as const } }],
    ['with min max step', { props: { min: 4, max: 12, step: 2 } }],
    ['with min steps between thumbs', { props: { defaultValue: [0, 30], minStepsBetweenThumbs: 30 } }],
    ['with color', { props: { color: 'red' as const } }],
    ['with size 2xs', { props: { size: '2xs' as const } }],
    ['with size xs', { props: { size: 'xs' as const } }],
    ['with size sm', { props: { size: 'sm' as const } }],
    ['with size md', { props: { size: 'md' as const } }],
    ['with size lg', { props: { size: 'lg' as const } }],
    ['with size xl', { props: { size: 'xl' as const } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: SliderProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Slider)
    expect(html).toMatchSnapshot()
  })
})
