import { defineComponent, reactive } from 'vue'
import { describe, it, expect, test, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
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
  UFileUpload,
  UForm
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
    ['with errorPrefix', { props: { error: 'Username is already taken', errorPrefix: 'Error:' } }],
    ['with errorIcon', { props: { error: 'Username is already taken', errorIcon: 'i-lucide-circle-alert' } }],
    ['with errorPrefix and errorIcon', { props: { error: 'Username is already taken', errorPrefix: 'Error:', errorIcon: 'i-lucide-circle-alert' } }],
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
    ['with error-icon slot', { props: { error: 'Username is already taken' }, slots: { 'error-icon': () => 'Error icon slot' } }],
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

  describe('errorPrefix and errorIcon', () => {
    it('renders with errorPrefix only', async () => {
      const wrapper = await mountSuspended(FormFieldWrapper, {
        props: {
          error: 'Username is already taken',
          errorPrefix: 'Error:'
        }
      })

      const prefix = wrapper.find('[data-slot="errorPrefix"]')
      expect(prefix.exists()).toBe(true)
      expect(prefix.text()).toBe('Error:')
      expect(wrapper.find('[data-slot="errorIcon"]').exists()).toBe(false)
      expect(wrapper.find('[data-slot="error"]').text()).toBe('Error: Username is already taken')
    })

    it('renders with errorIcon only (prop)', async () => {
      const wrapper = await mountSuspended(FormFieldWrapper, {
        props: {
          error: 'Username is already taken',
          errorIcon: 'i-lucide-circle-alert'
        }
      })

      const icon = wrapper.find('[data-slot="errorIcon"]')
      expect(icon.exists()).toBe(true)
      expect(icon.attributes('aria-hidden')).toBe('true')
      expect(wrapper.find('[data-slot="errorPrefix"]').exists()).toBe(false)
      expect(wrapper.find('[data-slot="error"]').text()).toBe('Username is already taken')
    })

    it('renders with error-icon slot overriding errorIcon prop', async () => {
      const wrapper = await mountSuspended(FormFieldWrapper, {
        props: {
          error: 'Username is already taken',
          errorIcon: 'i-lucide-circle-alert'
        },
        slots: {
          'error-icon': () => 'Custom Icon Slot'
        }
      })

      const errorEl = wrapper.find('[data-slot="error"]')
      expect(errorEl.text()).toContain('Custom Icon Slot')
      expect(wrapper.find('[data-slot="errorIcon"]').exists()).toBe(false)
    })

    it('renders with both errorPrefix and errorIcon', async () => {
      const wrapper = await mountSuspended(FormFieldWrapper, {
        props: {
          error: 'Username is already taken',
          errorPrefix: 'Error:',
          errorIcon: 'i-lucide-circle-alert'
        }
      })

      const icon = wrapper.find('[data-slot="errorIcon"]')
      const prefix = wrapper.find('[data-slot="errorPrefix"]')
      expect(icon.exists()).toBe(true)
      expect(icon.attributes('aria-hidden')).toBe('true')
      expect(prefix.exists()).toBe(true)
      expect(prefix.text()).toBe('Error:')
      expect(wrapper.find('[data-slot="error"]').text()).toBe('Error: Username is already taken')
    })

    it('renders unchanged output when neither errorPrefix nor errorIcon is set', async () => {
      const wrapper = await mountSuspended(FormFieldWrapper, {
        props: {
          error: 'Username is already taken'
        }
      })

      expect(wrapper.find('[data-slot="errorPrefix"]').exists()).toBe(false)
      expect(wrapper.find('[data-slot="errorIcon"]').exists()).toBe(false)
      expect(wrapper.find('[data-slot="error"]').text()).toBe('Username is already taken')
    })

    it('renders errorPrefix and errorIcon with custom error slot', async () => {
      const wrapper = await mountSuspended(FormFieldWrapper, {
        props: {
          error: 'Username is already taken',
          errorPrefix: 'Error:',
          errorIcon: 'i-lucide-circle-alert'
        },
        slots: {
          error: ({ error }) => `Custom: ${error}`
        }
      })

      expect(wrapper.find('[data-slot="errorIcon"]').exists()).toBe(true)
      expect(wrapper.find('[data-slot="errorPrefix"]').text()).toBe('Error:')
      expect(wrapper.find('[data-slot="error"]').text()).toBe('Error: Custom: Username is already taken')
    })

    it('renders prefix and icon when error is produced by form validation', async () => {
      const state = reactive({ email: '' })
      const wrapper = await mountSuspended(defineComponent({
        components: { UForm, UFormField, UInput },
        setup() {
          return {
            state,
            validate: () => [{ name: 'email', message: 'Email is required' }]
          }
        },
        template: `
          <UForm ref="form" :state="state" :validate="validate">
            <UFormField name="email" label="Email" error-prefix="Error:" error-icon="i-lucide-circle-alert">
              <UInput v-model="state.email" />
            </UFormField>
          </UForm>
        `
      }))

      const form = wrapper.findComponent({ ref: 'form' })
      await form.trigger('submit')
      await flushPromises()

      const errorEl = wrapper.find('[data-slot="error"]')
      expect(errorEl.exists()).toBe(true)
      expect(wrapper.find('[data-slot="errorPrefix"]').text()).toBe('Error:')
      expect(wrapper.find('[data-slot="errorIcon"]').exists()).toBe(true)
      expect(errorEl.text()).toContain('Error: Email is required')
    })

    it('passes accessibility tests with errorPrefix and errorIcon', async () => {
      const wrapper = await mountSuspended(FormFieldWrapper, {
        props: {
          label: 'Username',
          error: 'Username is already taken',
          errorPrefix: 'Error:',
          errorIcon: 'i-lucide-circle-alert'
        }
      })

      expect(await axe(wrapper.element)).toHaveNoViolations()
    })
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
})
