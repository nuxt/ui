import { defineComponent } from 'vue'
import { describe, it, expect, test, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import type { FormFieldProps } from '../../src/runtime/components/FormField.vue'
import theme from '#build/ui/form-field'
import {
  UInput,
  URadioGroup,
  UTextarea,
  UCheckbox,
  USelect,
  USelectMenu,
  UInputMenu,
  UInputNumber,
  USwitch,
  USlider,
  UPinInput,
  UFormField,
  UFileUpload
} from '#components'

// Mock useId to force a consistent return value in Nuxt and Vue. This is required to test aria attributes.
// `vi.mock` is hoisted to the top of the module, so it must live at the top level to reflect its actual execution order.
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    useId: () => 'v-0-0' // Static value matching Nuxt's format
  }
})

const inputComponents = [UInput, URadioGroup, UTextarea, UCheckbox, USelect, USelectMenu, UInputMenu, UInputNumber, USwitch, USlider, UPinInput, UFileUpload]

async function renderFormField(options: {
  props: Partial<FormFieldProps>
  inputComponent: typeof inputComponents[number]
}) {
  return await mountSuspended(UFormField, {
    props: options.props,
    slots: {
      default: {
        // @ts-expect-error - Object literal may only specify known properties, and setup does not exist in type
        setup: () => ({ inputComponent: options.inputComponent }),
        components: {
          UFormField,
          ...inputComponents
        },
        template: `
          <component :is="inputComponent" />
        `
      }
    }
  })
}

// A wrapper component is needed here because of a conflict with the error prop / expose.
// See: https://github.com/nuxt/test-utils/issues/684
const FormFieldWrapper = defineComponent({
  components: {
    UFormField
  },
  template: `
<UFormField>
  <template v-for="(_, name) in $slots" #[name]="slotData">
    <slot :name="name" v-bind="slotData" />
  </template>
</UFormField>`
})

describe('FormField', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const orientations = Object.keys(theme.variants.orientation) as any

  renderEach(FormFieldWrapper, [
    // Props
    ['with label and description', { props: { label: 'Username', description: 'Enter your username' } }],
    ['with required', { props: { label: 'Username', required: true } }],
    ['with help', { props: { help: 'Username must be unique' } }],
    ['with error', { props: { error: 'Username is already taken' } }],
    ['with hint', { props: { hint: 'Use letters, numbers, and special characters' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { label: 'Username', description: 'Enter your username', size } }]),
    ...orientations.map((orientation: string) => [`with orientation ${orientation}`, { props: { label: 'Username', description: 'Enter your username', orientation } }]),
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'relative' } }],
    ['with ui', { props: { ui: { label: 'text-highlighted' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with label slot', { slots: { label: () => 'Label slot' } }],
    ['with description slot', { slots: { description: () => 'Description slot' } }],
    ['with error slot', { slots: { error: () => 'Error slot' } }],
    ['with hint slot', { slots: { hint: () => 'Hint slot' } }],
    ['with help slot', { slots: { help: () => 'Help slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(FormFieldWrapper, {
      props: {
        label: 'Username',
        description: 'Enter your username',
        help: 'Username must be unique',
        hint: 'Use letters, numbers, and special characters',
        error: 'Username is already taken'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  describe.each(inputComponents.map(inputComponent => [(inputComponent as any).__name, inputComponent]))('%s integration', async (name: string, inputComponent: any) => {
    if (name === 'RadioGroup') {
      test('unbinds label for', async () => {
        const wrapper = await renderFormField({
          props: { label: 'Label' },
          inputComponent
        })

        const label = wrapper.find('label[for=v-0-0]')
        expect(label.exists()).toBe(false)
      })
    } else {
      test('binds label for', async () => {
        const wrapper = await renderFormField({
          props: { label: 'Label' },
          inputComponent
        })
        const label = wrapper.find('label[for=v-0-0]')
        expect(label.exists()).toBe(true)

        const input = wrapper.find('[id=v-0-0]')
        expect(input.exists()).toBe(true)
      })
    }

    if (name === 'Slider') {
      test('binds aria attributes on the thumb', async () => {
        const wrapper = await renderFormField({
          props: { error: 'Error' },
          inputComponent
        })

        const invalid = wrapper.findAll('[aria-invalid="true"]')
        expect(invalid).toHaveLength(1)
        expect(invalid[0]!.attributes('role')).toBe('slider')
        expect(invalid[0]!.attributes('aria-describedby')).toBe('v-0-0-error')
      })
    }

    test('binds hints with aria-describedby', async () => {
      const wrapper = await renderFormField({
        props: { hint: 'somehint' },
        inputComponent
      })

      const attr = wrapper.find('[aria-describedby=v-0-0-hint]')
      expect(attr.exists()).toBe(true)
    })

    test('binds description with aria-describedby', async () => {
      const wrapper = await renderFormField({
        props: { description: 'somedescription' },
        inputComponent
      })

      const attr = wrapper.find('[aria-describedby=v-0-0-description]')
      expect(attr.exists()).toBe(true)
    })

    test('binds error with aria-describedby', async () => {
      const wrapper = await renderFormField({
        props: { error: 'someerror' },
        inputComponent
      })

      const attr = wrapper.find('[aria-describedby=v-0-0-error]')
      expect(attr.exists()).toBe(true)
    })

    test('binds aria-invalid on error', async () => {
      const wrapper = await renderFormField({
        props: { error: 'someerror' },
        inputComponent
      })

      const attr = wrapper.find('[aria-invalid=true]')
      expect(attr.exists()).toBe(true)
    })

    test('renders id for aria describedby when help prop is provided', async () => {
      const wrapper = await renderFormField({
        props: { help: 'somehelp' },
        inputComponent
      })

      const attr = wrapper.find('[id=v-0-0-help]')
      expect(attr.exists()).toBe(true)
    })

    test('renders no id for aria describedby when no help prop is provided', async () => {
      const wrapper = await renderFormField({
        props: { label: 'Username', description: 'Enter your username' },
        inputComponent
      })

      const attr = wrapper.find('[id=v-0-0-help]')
      expect(attr.exists()).toBe(false)
    })
  })

  describe('error states', () => {
    // `error` declares `Boolean` before `String`, so Vue casts `:error="''"` to `true`.
    // "is invalid" and "has a message to render" are therefore two different facts, and
    // `aria-describedby` must only advertise the regions that actually render.
    const cases = [
      ['omitted', undefined, false, false],
      ['false', false, false, false],
      ['an empty string', '', true, false],
      ['true', true, true, false],
      ['a message', 'Username is already taken', true, true]
    ] as const

    test.each(cases)('with error %s: every aria-describedby id resolves', async (_, error, expectInvalid, expectMessage) => {
      const wrapper = await renderFormField({
        props: { error, help: 'Username must be unique', hint: 'Letters only', description: 'Enter your username' },
        inputComponent: UInput
      })

      const described = wrapper.find('[aria-describedby]')
      const ids = described.exists() ? described.attributes('aria-describedby')!.split(' ') : []

      expect(ids.length).toBeGreaterThan(0)
      for (const id of ids) {
        expect(wrapper.find(`#${id}`).exists(), `aria-describedby points at #${id}, which is not rendered`).toBe(true)
      }

      expect(wrapper.find('[aria-invalid=true]').exists()).toBe(expectInvalid)
      expect(wrapper.find('[data-slot=error]').exists()).toBe(expectMessage)
      expect(ids.includes('v-0-0-error')).toBe(expectMessage)
    })

    test('keeps the error styling when the error has no message', async () => {
      const wrapper = await renderFormField({
        props: { error: true },
        inputComponent: UInput
      })

      expect(wrapper.find('[aria-invalid=true]').exists()).toBe(true)
      expect(wrapper.find('input').classes().some(c => c.includes('error'))).toBe(true)
    })

    test('does not advertise help while the error takes its place', async () => {
      const wrapper = await renderFormField({
        props: { error: 'Username is already taken', help: 'Username must be unique' },
        inputComponent: UInput
      })

      const ids = wrapper.find('[aria-describedby]').attributes('aria-describedby')!.split(' ')
      expect(ids).toContain('v-0-0-error')
      expect(ids).not.toContain('v-0-0-help')
      expect(wrapper.find('[id=v-0-0-help]').exists()).toBe(false)
    })
  })
})
