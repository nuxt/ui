import { reactive } from 'vue'
import type { Reactive } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { FormProps } from '../../src/runtime/components/Form.vue'
import {
  UForm,
  UInput,
  UFormField,
  URadioGroup,
  UTextarea,
  UCheckbox,
  USelect,
  USelectMenu,
  UInputMenu,
  UInputNumber,
  USwitch,
  USlider,
  UPinInput
} from '#components'

export async function renderForm(options: {
  state?: Reactive<any>
  props: Partial<FormProps<any>>
  slotVars?: object
  slotTemplate: string
}) {
  const state = options.state ?? reactive({})

  return await mountSuspended(UForm, {
    props: {
      id: 42,
      state,
      ...options.props
    },
    slots: {
      default: {
        // @ts-expect-error - Object literal may only specify known properties, and setup does not exist in type
        setup() {
          return { state, ...options.slotVars }
        },
        components: {
          UFormField,
          UForm,
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
          UPinInput
        },
        template: options.slotTemplate
      }
    }
  })
}
