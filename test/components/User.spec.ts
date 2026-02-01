import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import User from '../../src/runtime/components/User.vue'
import type { UserProps, UserSlots } from '../../src/runtime/components/User.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/user'

describe('User', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const orientations = Object.keys(theme.variants.orientation) as any

  const props = {
    name: 'Benjamin Canac',
    description: 'Software Engineer',
    avatar: { src: 'https://github.com/benjamincanac.png', alt: 'User avatar' }
  }

  it.each([
    // Props
    ['with name', { props: { name: props.name } }],
    ['with description', { props: { name: props.name, description: props.description } }],
    ['with to', { props: { ...props, to: 'https://github.com/benjamincanac' } }],
    ['with avatar', { props }],
    ['with chip', { props: { ...props, chip: { color: 'success' } } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ...orientations.map((orientation: string) => [`with orientation ${orientation}`, { props: { ...props, orientation } }]),
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'absolute' } }],
    ['with ui', { props: { ...props, ui: { name: 'font-bold' } } }],
    // Slots
    ['with avatar slot', { props, slots: { avatar: () => 'Avatar slot' } }],
    ['with name slot', { props, slots: { name: () => 'Name slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }],
    ['with default slot', { props, slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: UserProps, slots?: Partial<UserSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, User)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(User, {
      props: {
        ...props,
        to: 'https://github.com/benjamincanac',
        chip: { color: 'info' }
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
