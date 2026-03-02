import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Separator from '../../src/runtime/components/Separator.vue'
import theme from '#build/ui/separator'

describe('Separator', () => {
  const types = Object.keys(theme.variants.type) as any
  const sizes = Object.keys(theme.variants.size) as any

  renderEach(Separator, [
    // Props
    ['with label', { props: { label: '+1' } }],
    ['with icon', { props: { icon: 'i-lucide-image' } }],
    ['with avatar', { props: { avatar: { src: 'https://github.com/benjamincanac.png' } } }],
    ['with orientation vertical', { props: { orientation: 'vertical' } }],
    ['with decorative', { props: { decorative: true } }],
    ...types.map((type: string) => [`with type ${type}`, { props: { type } }]),
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ['with color primary', { props: { color: 'primary' } }],
    ['with as', { props: { as: 'span' } }],
    ['with class', { props: { class: 'flex-row-reverse' } }],
    ['with ui', { props: { ui: { label: 'text-lg' } } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Separator, {
      props: {
        label: '+1',
        icon: 'i-lucide-image'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
