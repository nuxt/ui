import { ref } from 'vue'
import { describe, it, expect, test } from 'vitest'
import Button, { type ButtonProps, type ButtonSlots } from '../../src/runtime/components/Button.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/button'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'

import {
  UForm
} from '#components'

describe('Button', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any

  it.each([
    // Props
    ['with label', { props: { label: 'Button' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { label: 'Button', size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { label: 'Button', variant } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { label: 'Button', variant, color: 'neutral' } }]),
    ['with icon', { props: { icon: 'i-lucide-rocket' } }],
    ['with leading and icon', { props: { leading: true, icon: 'i-lucide-arrow-left' } }],
    ['with leadingIcon', { props: { leadingIcon: 'i-lucide-arrow-left' } }],
    ['with trailing and icon', { props: { trailing: true, icon: 'i-lucide-arrow-right' } }],
    ['with trailingIcon', { props: { trailingIcon: 'i-lucide-arrow-right' } }],
    ['with avatar', { props: { avatar: { src: 'https://github.com/benjamincanac.png' } } }],
    ['with avatar and leadingIcon', { props: { avatar: { src: 'https://github.com/benjamincanac.png' }, leadingIcon: 'i-lucide-arrow-left' } }],
    ['with avatar and trailingIcon', { props: { avatar: { src: 'https://github.com/benjamincanac.png' }, trailingIcon: 'i-lucide-arrow-right' } }],
    ['with loading', { props: { loading: true } }],
    ['with loading and avatar', { props: { loading: true, avatar: { src: 'https://github.com/benjamincanac.png' } } }],
    ['with loading trailing', { props: { loading: true, trailing: true } }],
    ['with loading trailing and avatar', { props: { loading: true, trailing: true, avatar: { src: 'https://github.com/benjamincanac.png' } } }],
    ['with loadingIcon', { props: { loading: true, loadingIcon: 'i-lucide-sparkles' } }],
    ['with disabled', { props: { label: 'Button', disabled: true } }],
    ['with disabled and with link', { props: { label: 'Button', disabled: true, to: '/link' } }],
    ['with block', { props: { label: 'Button', block: true } }],
    ['with square', { props: { label: 'Button', square: true } }],
    ['with as', { props: { label: 'Button', as: 'div' } }],
    ['with class', { props: { label: 'Button', class: 'rounded-full font-bold' } }],
    ['with ui', { props: { label: 'Button', ui: { label: 'font-bold' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ButtonProps, slots?: Partial<ButtonSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Button)
    expect(html).toMatchSnapshot()
  })

  test('with loading-auto works', async () => {
    let resolve: any | null = null
    const wrapper = await mountSuspended({
      components: { Button },
      setup() {
        function onClick() {
          return new Promise(res => resolve = res)
        }

        return { onClick }
      },
      template: `
        <Button loading-auto @click="onClick"> Click </Button>
      `
    })

    const button = wrapper.find('button')
    button.trigger('click')
    await flushPromises()

    const icon = wrapper.findComponent({ name: 'Icon' })

    expect(icon.classes()).toContain('animate-spin')
    expect(icon?.vm?.name).toBe('i-lucide-refresh-cw')

    resolve?.(null)
  })

  test('with loading-auto works with forms', async () => {
    let resolve: any | null = null
    const wrapper = await mountSuspended({
      components: { Button, UForm },
      setup() {
        function onSubmit() {
          return new Promise(res => resolve = res)
        }

        const form = ref()
        return { form, onSubmit }
      },
      template: `
        <UForm :state="{}" ref="form" @submit="onSubmit">
          <Button type="submit" loading-auto> Click </Button>
        </UForm>
      `
    })

    const form = wrapper.setupState.form
    form.value.submit()
    await flushPromises()

    const icon = wrapper.findComponent({ name: 'Icon' })

    expect(icon.classes()).toContain('animate-spin')
    expect(icon?.vm?.name).toBe('i-lucide-refresh-cw')

    resolve?.(null)
  })
})
