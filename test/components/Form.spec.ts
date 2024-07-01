import { reactive, ref, nextTick } from 'vue'
import { describe, it, expect, test, beforeEach, vi } from 'vitest'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { z } from 'zod'
import * as yup from 'yup'
import Joi from 'joi'
import * as valibot from 'valibot'
import ComponentRender from '../component-render'
import type { FormProps, FormSlots } from '../../src/runtime/components/Form.vue'
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

async function triggerEvent(
  el: DOMWrapper<Element> | VueWrapper<any, any>,
  event: string
) {
  el.trigger(event)
  return flushPromises()
}

async function setValue(
  el: DOMWrapper<Element> | VueWrapper<any, any>,
  value: any
) {
  el.setValue(value)
  return flushPromises()
}

async function renderForm(options: {
  props: Partial<FormProps<any>>
  slotVars?: object
  slotComponents?: any
  slotTemplate: string
}) {
  const state = reactive({})

  return await mountSuspended(UForm, {
    props: {
      id: 42,
      state,
      ...options.props
    },
    slots: {
      default: {
        // @ts-expect-error setup does not exist on type
        setup() {
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
    // Props
    ['with state', { props: { state: {} } }],
    // Slots
    ['with default slot', { props: { state: {} }, slots: { default: () => 'Form slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props: FormProps<any>, slots?: Partial<FormSlots> }) => {
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
      schema: valibot.object({
        email: valibot.string(),
        password: valibot.pipe(valibot.string(), valibot.minLength(8, 'Must be at least 8 characters'))
      })
    }
    ],
    ['valibot safeParser', {
      schema: valibot.safeParser(valibot.object({
        email: valibot.string(),
        password: valibot.pipe(valibot.string(), valibot.minLength(8, 'Must be at least 8 characters'))
      }))
    }
    ],
    ['custom', {
      async validate(state: any) {
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

    // @ts-expect-error object is possibly undefined
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
        async validate(state: any) {
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
        async validate(state: any) {
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
        async validate(state: any) {
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
    await new Promise(r => setTimeout(r, 50))
    expect(wrapper.text()).not.toContain('Error message')
  })

  describe('api', async () => {
    let wrapper: any
    let form: any
    let state: any

    beforeEach(async () => {
      wrapper = await mountSuspended({
        components: {
          UFormField,
          UForm,
          UInput
        },
        setup() {
          const form = ref()
          const state = reactive({})
          const schema = z.object({
            email: z.string().email(),
            password: z.string().min(8)
          })

          const onError = vi.fn()
          const onSubmit = vi.fn()

          return { state, schema, form, onSubmit, onError }
        },
        template: `
          <UForm ref="form" :state="state" :schema="schema" @submit="onSubmit" @error="onError">
            <UFormField id="emailField" name="email">
              <UInput id="emailInput" v-model="state.email" />
            </UFormField>
            <UFormField id="passwordField" name="password">
              <UInput id="passwordInput" v-model="state.password" />
            </UFormField>
          </UForm>
        `
      })
      form = wrapper.setupState.form
      state = wrapper.setupState.state
    })

    test('setErrors works', async () => {
      form.value.setErrors([{
        name: 'email',
        message: 'this is an error'
      }])

      expect(form.value.errors).toMatchObject([{
        id: 'emailInput',
        name: 'email',
        message: 'this is an error'
      }])

      await nextTick()

      const emailField = wrapper.find('#emailField')
      expect(emailField.text()).toBe('this is an error')

      const passwordField = wrapper.find('#passwordField')
      expect(passwordField.text()).toBe('')
    })

    test('clear works', async () => {
      form.value.setErrors([{
        id: 'emailInput',
        name: 'email',
        message: 'this is an error'
      }])

      form.value.clear()

      expect(form.value.errors).toMatchObject([])

      const emailField = wrapper.find('#emailField')
      expect(emailField.text()).toBe('')

      const passwordField = wrapper.find('#passwordField')
      expect(passwordField.text()).toBe('')
    })

    test('submit error works', async () => {
      await form.value.submit()

      expect(form.value.errors).toMatchObject([
        { id: 'emailInput', name: 'email', message: 'Required' },
        { id: 'passwordInput', name: 'password', message: 'Required' }
      ])

      expect(wrapper.setupState.onSubmit).not.toHaveBeenCalled()
      expect(wrapper.setupState.onError).toHaveBeenCalledTimes(1)
      expect(wrapper.setupState.onError).toHaveBeenCalledWith(expect.objectContaining({
        errors: [
          { id: 'emailInput', name: 'email', message: 'Required' },
          { id: 'passwordInput', name: 'password', message: 'Required' }
        ]
      }))

      const emailField = wrapper.find('#emailField')
      expect(emailField.text()).toBe('Required')

      const passwordField = wrapper.find('#passwordField')
      expect(passwordField.text()).toBe('Required')
    })

    test('valid submit works', async () => {
      state.email = 'bob@dylan.com'
      state.password = 'strongpassword'

      await form.value.submit()

      expect(wrapper.setupState.onSubmit).toHaveBeenCalledTimes(1)
      expect(wrapper.setupState.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        data: {
          email: 'bob@dylan.com',
          password: 'strongpassword'
        }
      }))

      expect(wrapper.setupState.onError).toHaveBeenCalledTimes(0)
    })

    test('validate works', async () => {
      await expect(form.value.validate).rejects.toThrow('Form validation exception')

      state.email = 'bob@dylan.com'
      state.password = 'strongpassword'

      expect(await form.value.validate()).toMatchObject({
        email: 'bob@dylan.com',
        password: 'strongpassword'
      })
    })

    test('getErrors works', async () => {
      await form.value.submit()
      const errors = form.value.getErrors()

      expect(errors).toMatchObject([
        { id: 'emailInput', name: 'email', message: 'Required' },
        { id: 'passwordInput', name: 'password', message: 'Required' }
      ])
    })
  })

  describe('nested', async () => {
    let wrapper: any
    let form: any
    let state: any

    beforeEach(async () => {
      wrapper = await mountSuspended({
        components: {
          UFormField,
          UForm,
          UInput
        },
        setup() {
          const form = ref()
          const state = reactive({ nested: {} })
          const schema = z.object({
            email: z.string().email(),
            password: z.string().min(8)
          })

          const showNested = ref(true)
          const nestedSchema = z.object({
            field: z.string().min(1)
          })

          const onError = vi.fn()
          const onSubmit = vi.fn()

          return { state, schema, nestedSchema, form, onSubmit, onError, showNested }
        },
        template: `
          <UForm ref="form" :state="state" :schema="schema" @submit="onSubmit" @error="onError">
            <UFormField id="emailField" name="email">
              <UInput id="emailInput" v-model="state.email" />
            </UFormField>
            <UFormField id="passwordField" name="password">
              <UInput id="passwordInput" v-model="state.password" />
            </UFormField>

            <UForm v-if="showNested" ref="nestedForm" :state="state.nested" :schema="nestedSchema">
              <UFormField id="nestedField" name="field">
                <UInput id="nestedInput" v-model="state.nested.field" />
              </UFormField>
            </UForm>
          </UForm>
        `
      })
      form = wrapper.setupState.form
      state = wrapper.setupState.state
    })

    test('submit error works', async () => {
      await form.value.submit()

      expect(wrapper.setupState.onSubmit).not.toHaveBeenCalled()
      expect(wrapper.setupState.onError).toHaveBeenCalledTimes(1)
      const onErrorCallArgs = wrapper.setupState.onError.mock.lastCall[0]
      expect(onErrorCallArgs.childrens[0].errors).toMatchObject([{ id: 'nestedInput', name: 'field', message: 'Required' }])
      expect(onErrorCallArgs.errors).toMatchObject([
        { id: 'emailInput', name: 'email', message: 'Required' },
        { id: 'passwordInput', name: 'password', message: 'Required' }
      ])

      const nestedField = wrapper.find('#nestedField')
      expect(nestedField.text()).toBe('Required')
    })

    test('submit works when child is disabled', async () => {
      await form.value.submit()
      expect(wrapper.setupState.onError).toHaveBeenCalledTimes(1)
      vi.resetAllMocks()

      wrapper.setupState.showNested.value = false
      await nextTick()

      state.email = 'bob@dylan.com'
      state.password = 'strongpassword'

      await form.value.submit()
      expect(wrapper.setupState.onSubmit).toHaveBeenCalledTimes(1)
      expect(wrapper.setupState.onError).toHaveBeenCalledTimes(0)
    })
  })
})
