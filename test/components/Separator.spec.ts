import { describe, it, expect, vi } from 'vitest'
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
    ['with position start', { props: { position: 'start', icon: 'i-lucide-image' } }],
    ['with position end', { props: { position: 'end', icon: 'i-lucide-image' } }],
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

  it('forwards fall-through attributes to the root without warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    try {
      const wrapper = await mountSuspended(Separator, {
        props: { label: 'or' },
        attrs: { 'id': 'my-separator', 'data-test': 'value' }
      })

      const root = wrapper.get('[data-slot="root"]')
      expect(root.attributes('id')).toBe('my-separator')
      expect(root.attributes('data-test')).toBe('value')

      const warnings = warn.mock.calls.map(args => args.join(' ')).join('\n')
      expect(warnings).not.toContain('Extraneous non-props attributes')
    } finally {
      warn.mockRestore()
    }
  })

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
