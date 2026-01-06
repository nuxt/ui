import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { mount, flushPromises } from '@vue/test-utils'
import InputRating from '../../src/runtime/components/InputRating.vue'
import type { InputRatingProps, InputRatingSlots } from '../../src/runtime/components/InputRating.vue'
import type { FormInputEvents } from '../../src/module'
import ComponentRender from '../component-render'
import { renderForm } from '../utils/form'
import theme from '#build/ui/input-rating'

describe('InputRating', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const colors = Object.keys(theme.variants.color) as any

  it.each([
    // Props
    ['with modelValue', { props: { modelValue: 3 } }],
    ['with defaultValue', { props: { defaultValue: 3 } }],
    ['with max', { props: { max: 10, modelValue: 7 } }],
    ['with allowHalf', { props: { allowHalf: true, modelValue: 3.5 } }],
    ['with readonly', { props: { readonly: true, modelValue: 4 } }],
    ['with disabled', { props: { disabled: true, modelValue: 3 } }],
    ['with icon', { props: { icon: 'i-lucide-heart', modelValue: 4 } }],
    ['with emptyIcon', { props: { emptyIcon: 'i-lucide-star-off', modelValue: 3 } }],
    ['with id', { props: { id: 'rating-id', modelValue: 3 } }],
    ['with name', { props: { name: 'rating-name', modelValue: 3 } }],
    ['with required', { props: { required: true, modelValue: 3 } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size, modelValue: 3 } }]),
    ...colors.map((color: string) => [`with color ${color}`, { props: { color, modelValue: 3 } }]),
    ['with as', { props: { as: 'span', modelValue: 3 } }],
    ['with class', { props: { class: 'inline-flex', modelValue: 3 } }],
    ['with ui', { props: { ui: { root: 'gap-1' }, modelValue: 3 } }],
    // Slots
    ['with star slot', { slots: { star: () => '⭐' }, props: { modelValue: 3 } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: InputRatingProps, slots?: Partial<InputRatingSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, InputRating)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(InputRating, {
      props: {
        modelValue: 3
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  describe('emits', () => {
    test('update:modelValue event on click', async () => {
      const wrapper = mount(InputRating, {
        props: {
          modelValue: 0
        }
      })

      const item = wrapper.find('button[role="radio"][value="3"]')
      if (item.exists()) {
        await item.trigger('click')
        await flushPromises()

        expect(wrapper.emitted()).toHaveProperty('update:modelValue')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
      }
    })

    test('change event on click', async () => {
      const wrapper = mount(InputRating, {
        props: {
          modelValue: 0
        }
      })

      const item = wrapper.find('button[role="radio"][value="4"]')
      if (item.exists()) {
        await item.trigger('click')
        await flushPromises()

        expect(wrapper.emitted()).toHaveProperty('change')
      }
    })

    test('half star with allowHalf', async () => {
      const wrapper = mount(InputRating, {
        props: {
          allowHalf: true,
          modelValue: 0
        }
      })

      const item = wrapper.find('button[role="radio"][value="0.5"]')
      if (item.exists()) {
        await item.trigger('click')
        await flushPromises()

        expect(wrapper.emitted()).toHaveProperty('update:modelValue')
        // Should emit 0.5 for half star
        const emitted = wrapper.emitted('update:modelValue')
        expect(emitted?.[0]?.[0]).toBe(0.5)
      }
    })
  })

  describe('readonly behavior', () => {
    test('does not emit events when readonly', async () => {
      const wrapper = mount(InputRating, {
        props: {
          readonly: true,
          modelValue: 3
        }
      })

      const item = wrapper.find('button[role="radio"][value="5"]')
      if (item.exists()) {
        await item.trigger('click')
        await flushPromises()

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      }
    })
  })

  describe('disabled behavior', () => {
    test('does not emit events when disabled', async () => {
      const wrapper = mount(InputRating, {
        props: {
          disabled: true,
          modelValue: 2
        }
      })

      const item = wrapper.find('button[role="radio"][value="5"]')
      if (item.exists()) {
        await item.trigger('click')
        await flushPromises()

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      }
    })
  })

  describe('form integration', async () => {
    async function createForm(validateOn?: FormInputEvents[]) {
      const wrapper = await renderForm({
        props: {
          validateOn,
          validateOnInputDelay: 0,
          async validate(state: any) {
            if (state.rating < 3)
              return [{ name: 'rating', message: 'Rating must be at least 3' }]
            return []
          }
        },
        slotTemplate: `
        <UFormField name="rating">
          <UInputRating v-model="state.rating" />
        </UFormField>
        `
      })
      const rating = wrapper.findComponent(InputRating)
      return {
        wrapper,
        rating
      }
    }

    test('validate on change works', async () => {
      const { rating, wrapper } = await createForm(['change'])

      if (!rating.exists()) {
        throw new Error('InputRating component not found')
      }

      // Set rating to 2 (should fail validation) by clicking second star
      const item2 = rating.find('button[role="radio"][value="2"]')
      if (item2.exists()) {
        await item2.trigger('click')
        await flushPromises()
      }

      expect(wrapper.text()).toContain('Rating must be at least 3')

      // Set rating to 4 (should pass validation) by clicking fourth star
      const item4 = rating.find('button[role="radio"][value="4"]')
      if (item4.exists()) {
        await item4.trigger('click')
        await flushPromises()
      }
      expect(wrapper.text()).not.toContain('Rating must be at least 3')
    })

    test('validate on input works', async () => {
      const { rating, wrapper } = await createForm(['input'])

      if (!rating.exists()) {
        throw new Error('InputRating component not found')
      }

      // Set rating to 2 (should fail validation) by clicking second star
      const item2 = rating.find('button[role="radio"][value="2"]')
      if (item2.exists()) {
        await item2.trigger('click')
        await flushPromises()
      }

      expect(wrapper.text()).toContain('Rating must be at least 3')

      // Set rating to 4 (should pass validation) by clicking fourth star
      const item4 = rating.find('button[role="radio"][value="4"]')
      if (item4.exists()) {
        await item4.trigger('click')
        await flushPromises()
      }
      expect(wrapper.text()).not.toContain('Rating must be at least 3')
    })
  })
})
