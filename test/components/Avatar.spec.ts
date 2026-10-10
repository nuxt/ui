import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { h } from 'vue'
import { renderEach } from '../component-render'
import Avatar from '../../src/runtime/components/Avatar.vue'
import type { AvatarColorGenerator } from '../../src/runtime/components/Avatar.vue'
import Theme from '../../src/runtime/components/Theme.vue'
import theme from '#build/ui/avatar'

describe('Avatar', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const colors = Object.keys(theme.variants.color) as any

  renderEach(Avatar, [
    // Props
    ['with src', { props: { src: 'https://github.com/benjamincanac.png' } }],
    ['with alt', { props: { alt: 'Benjamin Canac' } }],
    ['with text', { props: { text: '+1' } }],
    ['with icon', { props: { icon: 'i-lucide-image' } }],
    ['with chip', { props: { chip: { text: '1' } } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { src: 'https://github.com/benjamincanac.png', size } }]),
    ...colors.map((color: string) => [`with color ${color}`, { props: { alt: 'Benjamin Canac', color } }]),
    ['with as', { props: { as: 'section' } }],
    ['with as (object)', { props: { src: 'https://github.com/benjamincanac.png', as: { root: 'section', img: 'p' } } }],
    ['with as (partial object)', { props: { src: 'https://github.com/benjamincanac.png', as: { img: 'p' } } }],
    ['with class', { props: { class: 'bg-default' } }],
    ['with ui', { props: { ui: { fallback: 'font-bold' } } }],
    ['with custom size', { props: { class: 'size-100', src: 'https://github.com/benjamincanac.png' } }],
    // Slots
    ['with default slot', { slots: { default: '🇫🇷' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: {
        alt: 'Benjamin Canac',
        src: 'https://github.com/benjamincanac.png'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('generates a deterministic background color from the avatar name', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: {
        alt: 'Benjamin Canac',
        color: 'auto'
      }
    })

    expect(wrapper.attributes('style')).toBe('background-color: hsl(226, 68%, 25%); color: white;')
  })

  it('uses a contrasting foreground for every generated hue', async () => {
    const wrapper = await mountSuspended({
      render: () => h('div', Array.from({ length: 360 }, (_, hue) => h(Avatar, {
        alt: String.fromCharCode(hue),
        color: 'auto'
      })))
    })
    const avatars = wrapper.findAll('[data-slot="root"]')

    expect(avatars).toHaveLength(360)
    avatars.forEach((avatar, hue) => {
      expect(avatar.attributes('style')).toBe(`background-color: hsl(${hue}, 68%, 25%); color: white;`)
    })
  })

  it('keeps an explicit background color when using auto color', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: {
        alt: 'Benjamin Canac',
        color: 'auto',
        style: { backgroundColor: 'red' }
      }
    })

    expect(wrapper.attributes('style')).toBe('background-color: red; color: white;')
  })

  it('uses a custom color generator and seed', async () => {
    const colorGenerator: AvatarColorGenerator = vi.fn(({ seed, text, alt }) => ({
      background: `rgb(${seed.length}, ${text?.length}, ${alt?.length})`,
      foreground: 'black'
    }))
    const wrapper = await mountSuspended(Avatar, {
      props: {
        alt: 'Benjamin Canac',
        text: 'BC',
        color: 'auto',
        colorSeed: 'user-42',
        colorGenerator
      }
    })

    expect(wrapper.attributes('style')).toBe('background-color: rgb(7, 2, 14); color: black;')
    expect(colorGenerator).toHaveBeenCalledWith({ seed: 'user-42', text: 'BC', alt: 'Benjamin Canac' })
  })

  it('uses a color generator from the nearest theme', async () => {
    const wrapper = await mountSuspended(Theme, {
      props: {
        props: {
          avatar: {
            colorGenerator: () => ({
              background: 'rgb(1, 2, 3)',
              foreground: 'white'
            })
          }
        }
      },
      slots: {
        default: () => h(Avatar, { alt: 'Benjamin Canac', color: 'auto' })
      }
    })

    expect(wrapper.find('[data-slot="root"]').attributes('style')).toBe('background-color: rgb(1, 2, 3); color: white;')
  })
})
