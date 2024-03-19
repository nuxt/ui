import { reactive } from 'vue'
import { describe, it, expect } from 'vitest'
import type { FormProps } from '../../src/runtime/components/Form.vue'
import {
  UForm,
  UInput,
  UFormField
  // URadioGroup,
  // UTextarea,
  // UCheckbox,
  // USelect,
  // URadio,
  // USelectMenu,
  // UInputMenu,
  // UToggle,
  // URange
} from '#components'
import { DOMWrapper, flushPromises, VueWrapper } from '@vue/test-utils'
import ComponentRender from '../component-render'

import { mountSuspended } from '@nuxt/test-utils/runtime'
import { z } from 'zod'
import * as yup from 'yup'
import Joi from 'joi'
import * as valibot from 'valibot'

async function triggerEvent (
  el: DOMWrapper<Element> | VueWrapper<any, any>,
  event: string
) {
  el.trigger(event)
  return flushPromises()
}

async function setValue (
  el: DOMWrapper<Element> | VueWrapper<any, any>,
  value: any
) {
  el.setValue(value)
  return flushPromises()
}

async function renderForm (options: {
  props: Partial<FormProps<any>>
  slotVars?: object
  slotComponents?: any
  slotTemplate: string
}) {
  const state = reactive({})
  return await mountSuspended(UForm, {
    props: {
      state,
      ...options.props
    },
    slots: {
      default: {
        // @ts-ignore
        setup () {
          return { state, ...options.slotVars }
        },
        components: {
          UFormField,
          ...options.slotComponents
        },
        template: options.slotTemplate
      }
    }
  })
}

describe('Form', () => {
  it.each([
    ['basic case', { props: { state: {} } }],
    ['with default slot', { props: { state: {} }, slots: { default: 'Form slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props: FormProps<any> }) => {
    const html = await ComponentRender(nameOrHtml, options, UForm)
    expect(html).toMatchSnapshot()
  })

  it.each([
    ['zod', {
      schema: z.object({
        email: z.string(),
        password: z.string().min(8, 'Must be at least 8 characters')
      })
    }
    ],
    ['yup', {
      schema: yup.object({
        email: yup.string(),
        password: yup.string().min(8, 'Must be at least 8 characters')
      })
    }
    ],
    ['joi', {
      schema: Joi.object({
        email: Joi.string(),
        password: Joi.string().min(8).messages({
          'string.min': 'Must be at least {#limit} characters'
        })
      })
    }
    ],
    ['valibot', {
      schema: valibot.objectAsync({
        email: valibot.string(),
        password: valibot.string([
          valibot.minLength(8, 'Must be at least 8 characters')
        ])
      })
    }
    ],
    ['custom', {
      async validate (state: any) {
        const errs = []
        if (!state.email)
          errs.push({ name: 'email', message: 'Email is required' })
        if (state.password?.length < 8)
          errs.push({
            name: 'password',
            message: 'Must be at least 8 characters'
          })

        return errs
      }
    }
    ]
  ])('%s validation works', async (_nameOrHtml: string, options: Partial<FormProps<any>>) => {
    const wrapper = await renderForm({
      props: options,
      slotComponents: {
        UFormField,
        UInput
      },
      slotTemplate: `
          <UFormField name="email">
            <UInput id="email" v-model="state.email" />
          </UFormField>
          <UFormField name="password">
            <UInput id="password" v-model="state.password" />
          </UFormField>
        `
    })

    const form = wrapper.find('form')
    const emailInput = wrapper.find('#email')
    const passwordInput = wrapper.find('#password')

    await setValue(emailInput, 'bob@dylan.com')
    await setValue(passwordInput, 'short')

    await triggerEvent(form, 'submit.prevent')

    // @ts-ignore
    expect(wrapper.emitted('error')[0][0].errors).toMatchObject([
      {
        id: 'password',
        name: 'password',
        message: 'Must be at least 8 characters'
      }
    ])

    expect(wrapper.html()).toMatchSnapshot('with error')

    await setValue(passwordInput, 'validpassword')
    await triggerEvent(form, 'submit.prevent')

    expect(wrapper.emitted()).toHaveProperty('submit')
    expect(wrapper.emitted('submit')![0][0]).toMatchObject({
      data: { email: 'bob@dylan.com', password: 'validpassword' }
    })

    expect(wrapper.html()).toMatchSnapshot('without error')
  })

  it.each([
    ['input', UInput, {}, 'foo']
    // ['textarea', UTextarea, {}, 'foo']
  ])('%s validate on blur works', async (_name, InputComponent, inputProps, validInputValue) => {
    const wrapper = await renderForm({
      props: {
        validateOn: ['blur'],
        async validate (state: any) {
          if (!state.value)
            return [{ name: 'value', message: 'Error message' }]
          return []
        }
      },

      slotVars: {
        inputProps
      },
      slotComponents: { InputComponent },
      slotTemplate: `
          <UFormField name="value">
            <InputComponent id="input" v-model="state.value" v-bind="inputProps" />
          </UFormField>
        `
    })

    const input = wrapper.find('#input')
    await triggerEvent(input, 'blur')
    expect(wrapper.text()).toContain('Error message')

    await setValue(input, validInputValue)
    await triggerEvent(input, 'blur')
    expect(wrapper.text()).not.toContain('Error message')
  })

  it.each([
    // ['checkbox', UCheckbox, {}, true],
    // ['range', URange, {}, 2],
    // ['select', USelect, { options: ['Option 1', 'Option 2'] }, 'Option 2']
  ])('%s validate on change works', async (_name, InputComponent, inputProps, validInputValue) => {
    const wrapper = await renderForm({
      props: {
        validateOn: ['change'],
        async validate (state: any) {
          if (!state.value)
            return [{ name: 'value', message: 'Error message' }]
          return []
        }
      },

      slotVars: {
        inputProps
      },
      slotComponents: {
        InputComponent
      },
      slotTemplate: `
          <UFormField name="value">
            <InputComponent id="input" v-model="state.value" v-bind="inputProps" />
          </UFormField>
        `
    })

    const input = wrapper.find('#input')

    await triggerEvent(input, 'change')
    expect(wrapper.text()).toContain('Error message')

    await setValue(input, validInputValue)
    await triggerEvent(input, 'change')
    expect(wrapper.text()).not.toContain('Error message')
  })

  // test('radio group validate on change works', async () => {
  //   const wrapper = await renderForm({
  //     props: {
  //       validateOn: ['change'],
  //       validate (state: any) {
  //         if (state.value !== 'Option 2')
  //           return [{ name: 'value', message: 'Error message' }]
  //         return []
  //       }
  //     },
  //     slotVars: {
  //       inputProps: {
  //         options: ['Option 1', 'Option 2', 'Option 3']
  //       }
  //     },
  //     slotComponents: {
  //       UFormField,
  //       URadioGroup
  //     },
  //     slotTemplate: `
  //         <UFormField name="value">
  //           <URadioGroup id="input" v-model="state.value" v-bind="inputProps" />
  //         </UFormField>
  //       `
  //   })
  //
  //   const option1 = wrapper.find('[value="Option 1"]')
  //   await setValue(option1, true)
  //   expect(wrapper.text()).toContain('Error message')
  //
  //   const option2 = wrapper.find('[value="Option 2"]')
  //   await setValue(option2, true)
  //   expect(wrapper.text()).not.toContain('Error message')
  // })
  //
  // test('radio validate on change works', async () => {
  //   const wrapper = await renderForm({
  //     props: {
  //       validateOn: ['change'],
  //       validate (state: any) {
  //         if (state.value !== 'Option 2')
  //           return [{ name: 'value', message: 'Error message' }]
  //         return []
  //       }
  //     },
  //     slotComponents: {
  //       UFormField,
  //       URadio
  //     },
  //     slotTemplate: `
  //         <UFormField name="value">
  //           <URadio id="option-1" v-model="state.value" value="Option 1" />
  //           <URadio id="option-2" v-model="state.value" value="Option 2" />
  //         </UFormField>
  //       `
  //   })
  //
  //   const option1 = wrapper.find('#option-1')
  //   await setValue(option1, true)
  //   expect(wrapper.text()).toContain('Error message')
  //
  //   const option2 = wrapper.find('#option-2')
  //   await setValue(option2, true)
  //   expect(wrapper.text()).not.toContain('Error message')
  // })
  //
  // test('toggle validate on change', async () => {
  //   const wrapper = await renderForm({
  //     props: {
  //       validateOn: ['change'],
  //       validate (state: any) {
  //         if (state.value) return [{ name: 'value', message: 'Error message' }]
  //         return []
  //       }
  //     },
  //     slotComponents: {
  //       UFormField,
  //       UToggle
  //     },
  //     slotTemplate: `
  //         <UFormField name="value">
  //           <UToggle id="input" v-model="state.value" />
  //         </UFormField>
  //       `
  //   })
  //
  //   const input = wrapper.findComponent({ name: 'Switch' })
  //   await setValue(input, true)
  //   expect(wrapper.text()).toContain('Error message')
  //
  //   await setValue(input, false)
  //   expect(wrapper.text()).not.toContain('Error message')
  // })
  //
  // test('select menu validate on change', async () => {
  //   const wrapper = await renderForm({
  //     props: {
  //       validateOn: ['change'],
  //       validate (state: any) {
  //         if (state.value !== 'Option 2')
  //           return [{ name: 'value', message: 'Error message' }]
  //         return []
  //       }
  //     },
  //     slotVars: {
  //       inputProps: {
  //         options: ['Option 1', 'Option 2', 'Option 3']
  //       }
  //     },
  //     slotComponents: {
  //       UFormField,
  //       USelectMenu
  //     },
  //     slotTemplate: `
  //         <UFormField name="value">
  //           <USelectMenu id="input" v-model="state.value" v-bind="inputProps" />
  //         </UFormField>
  //       `
  //   })
  //
  //   const input = wrapper.findComponent({ name: 'Listbox' })
  //   await setValue(input, 'Option 1')
  //   expect(wrapper.text()).toContain('Error message')
  //
  //   await setValue(input, 'Option 2')
  //   expect(wrapper.text()).not.toContain('Error message')
  // })
  //
  // test('input menu validate on change', async () => {
  //   const wrapper = await renderForm({
  //     props: {
  //       validateOn: ['change'],
  //       validate (state: any) {
  //         if (state.value !== 'Option 2')
  //           return [{ name: 'value', message: 'Error message' }]
  //         return []
  //       }
  //     },
  //     slotVars: {
  //       inputProps: {
  //         options: ['Option 1', 'Option 2', 'Option 3']
  //       }
  //     },
  //     slotComponents: {
  //       UFormField,
  //       UInputMenu
  //     },
  //     slotTemplate: `
  //         <UFormField name="value">
  //           <UInputMenu id="input" v-model="state.value" v-bind="inputProps" />
  //         </UFormField>
  //       `
  //   })
  //
  //   const input = wrapper.findComponent({ name: 'Combobox' })
  //   await setValue(input, 'Option 1')
  //   expect(wrapper.text()).toContain('Error message')
  //
  //   await setValue(input, 'Option 2')
  //   expect(wrapper.text()).not.toContain('Error message')
  // })
  //

  it.each([
    ['input', UInput, {}, 'foo']
    // ['textarea', UTextarea, {}, 'foo']
  ])('%s validate on input works', async (_name, InputComponent, inputProps, validInputValue) => {
    const wrapper = await renderForm({
      props: {
        validateOn: ['input', 'blur'],
        async validate (state: any) {
          if (!state.value)
            return [{ name: 'value', message: 'Error message' }]
          return []
        }
      },
      slotVars: {
        inputProps
      },
      slotComponents: {
        UFormField,
        InputComponent
      },
      slotTemplate: `
          <UFormField name="value" :validate-on-input-delay="50">
            <InputComponent id="input" v-model="state.value" v-bind="inputProps" />
          </UFormField>
        `
    })

    const input = wrapper.find('#input')

    // Validation @input is enabled only after a blur event
    await triggerEvent(input, 'blur')

    expect(wrapper.text()).toContain('Error message')

    await setValue(input, validInputValue)
    // Waiting because of the debounced validation on input event.
    await new Promise((r) => setTimeout(r, 50))
    expect(wrapper.text()).not.toContain('Error message')
  })
})
