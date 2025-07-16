import { defineComponent } from 'vue'
import { describe, it, expect, test, vi } from 'vitest'
import type { FormFieldProps, FormFieldSlots } from '../../src/runtime/components/FormField.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/form-field'
import { mountSuspended } from '@nuxt/test-utils/runtime'

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
  UFormField
} from '#components'

const inputComponents = [UInput, URadioGroup, UTextarea, UCheckbox, USelect, USelectMenu, UInputMenu, UInputNumber, USwitch, USlider, UPinInput]

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

  it.each([
    // Props
    ['with label and description', { props: { label: 'Username', description: 'Enter your username' } }],
    ['with required', { props: { label: 'Username', required: true } }],
    ['with help', { props: { help: 'Username must be unique' } }],
    ['with error', { props: { error: 'Username is already taken' } }],
    ['with hint', { props: { hint: 'Use letters, numbers, and special characters' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { label: 'Username', description: 'Enter your username', size } }]),
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
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: FormFieldProps, slots?: Partial<FormFieldSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, FormFieldWrapper)
    expect(html).toMatchSnapshot()
  })

  describe.each(inputComponents.map(inputComponent => [(inputComponent as any).__name, inputComponent]))('%s integration', async (name: string, inputComponent: any) => {
    // Mock useId to force a consistent return value in Nuxt and Vue. This is required to test aria attributes.
    vi.mock('vue', async () => {
      const actual = await vi.importActual('vue')
      return {
        ...actual,
        useId: () => 'v-0-0' // Static value matching Nuxt's format
      }
    })

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
