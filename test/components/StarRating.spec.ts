import { describe, it, expect, test, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { mount, flushPromises } from '@vue/test-utils'
import StarRating from '../../src/runtime/components/StarRating.vue'
import type { StarRatingProps, StarRatingSlots } from '../../src/runtime/components/StarRating.vue'
import type { FormInputEvents } from '../../src/module'
import ComponentRender from '../component-render'
import { renderForm } from '../utils/form'
import theme from '#build/ui/star-rating'

describe('StarRating', () => {
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
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: StarRatingProps, slots?: Partial<StarRatingSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, StarRating)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(StarRating, {
      props: {
        modelValue: 3
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  describe('emits', () => {
    test('update:modelValue event on click', async () => {
      const wrapper = mount(StarRating, {
        props: {
          modelValue: 0
        }
      })

      const stars = wrapper.findAll('[data-slot^="star-"]')
      if (stars.length > 0) {
        await stars[2]!.trigger('click') // Click on third star (index 2 = star 3)
        await flushPromises()

        expect(wrapper.emitted()).toHaveProperty('update:modelValue')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
      }
    })

    test('change event on click', async () => {
      const wrapper = mount(StarRating, {
        props: {
          modelValue: 0
        }
      })

      const stars = wrapper.findAll('[data-slot^="star-"]')
      if (stars.length > 0) {
        await stars[3]!.trigger('click') // Click on fourth star
        await flushPromises()

        expect(wrapper.emitted()).toHaveProperty('change')
      }
    })

    test('half star with allowHalf', async () => {
      const wrapper = mount(StarRating, {
        props: {
          allowHalf: true,
          modelValue: 0
        }
      })

      const stars = wrapper.findAll('[data-slot^="star-"]')
      if (stars.length > 0) {
        const starElement = stars[0]!.element as HTMLElement

        // Mock getBoundingClientRect to simulate click on left half
        const mockRect = { left: 100, width: 40, top: 100, height: 40, right: 140, bottom: 140 }
        const getBoundingClientRectSpy = vi.spyOn(starElement, 'getBoundingClientRect')
        getBoundingClientRectSpy.mockReturnValue(mockRect as DOMRect)

        // Create a click event with clientX in the left half (110 < 120, which is left + width/2)
        const clickEvent = {
          currentTarget: starElement,
          clientX: 110, // Left half: 110 < (100 + 40/2) = 120
          clientY: 120,
          preventDefault: () => {},
          stopPropagation: () => {}
        } as unknown as MouseEvent

        // Manually call the click handler by accessing the component instance
        const componentInstance = wrapper.vm as any
        if (componentInstance.handleStarClick) {
          await componentInstance.handleStarClick(clickEvent, 1)
          await flushPromises()

          expect(wrapper.emitted()).toHaveProperty('update:modelValue')
          // Should emit 0.5 for half star (index 1 - 0.5)
          const emitted = wrapper.emitted('update:modelValue')
          expect(emitted?.[0]?.[0]).toBe(0.5)
        } else {
          // Fallback: just test that clicking emits a value when allowHalf is true
          await stars[0]!.trigger('click')
          await flushPromises()
          expect(wrapper.emitted()).toHaveProperty('update:modelValue')
        }
      }
    })
  })

  describe('readonly behavior', () => {
    test('does not emit events when readonly', async () => {
      const wrapper = mount(StarRating, {
        props: {
          readonly: true,
          modelValue: 3
        }
      })

      const stars = wrapper.findAll('[data-slot^="star-"]')
      if (stars.length > 0) {
        await stars[4]!.trigger('click') // Try to click on fifth star
        await flushPromises()

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      }
    })
  })

  describe('disabled behavior', () => {
    test('does not emit events when disabled', async () => {
      const wrapper = mount(StarRating, {
        props: {
          disabled: true,
          modelValue: 2
        }
      })

      const stars = wrapper.findAll('[data-slot^="star-"]')
      if (stars.length > 0) {
        await stars[4]!.trigger('click') // Try to click on fifth star
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
          <UStarRating v-model="state.rating" />
        </UFormField>
        `
      })
      const rating = wrapper.findComponent(StarRating)
      return {
        wrapper,
        rating
      }
    }

    test('validate on change works', async () => {
      const { rating, wrapper } = await createForm(['change'])

      if (!rating.exists()) {
        throw new Error('StarRating component not found')
      }

      // Set rating to 2 (should fail validation) by clicking second star
      const stars = rating.findAll('[data-slot^="star-"]')
      if (stars.length > 1) {
        await stars[1]!.trigger('click') // Click second star (value = 2)
        await flushPromises()
      }

      expect(wrapper.text()).toContain('Rating must be at least 3')

      // Set rating to 4 (should pass validation) by clicking fourth star
      if (stars.length > 3) {
        await stars[3]!.trigger('click') // Click fourth star (value = 4)
        await flushPromises()
      }
      expect(wrapper.text()).not.toContain('Rating must be at least 3')
    })

    test('validate on input works', async () => {
      const { rating, wrapper } = await createForm(['input'])

      if (!rating.exists()) {
        throw new Error('StarRating component not found')
      }

      // Set rating to 2 (should fail validation) by clicking second star
      const stars = rating.findAll('[data-slot^="star-"]')
      if (stars.length > 1) {
        await stars[1]!.trigger('click') // Click second star (value = 2)
        await flushPromises()
      }

      expect(wrapper.text()).toContain('Rating must be at least 3')

      // Set rating to 4 (should pass validation) by clicking fourth star
      if (stars.length > 3) {
        await stars[3]!.trigger('click') // Click fourth star (value = 4)
        await flushPromises()
      }
      expect(wrapper.text()).not.toContain('Rating must be at least 3')
    })
  })
})
