import { reactive } from 'vue'
import { describe, it, expect, test } from 'vitest'
import {
  UForm,
  UInput,
  UFormGroup,
  URadioGroup,
  UTextarea,
  UCheckbox,
  USelect,
  URadio,
  USelectMenu,
  UInputMenu,
  UToggle,
  URange
} from '#components'
import { DOMWrapper, flushPromises } from '@vue/test-utils'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

import { mountSuspended } from '@nuxt/test-utils/runtime'
import { z } from 'zod'
import * as yup from 'yup'
import Joi from 'joi'
import * as valibot from 'valibot'

// Wrapper to trigger an event on a DOM element and flush promises.
async function triggerEvent (el: DOMWrapper<Element>, event: string) {
  el.trigger(event)
  return flushPromises()
}

async function renderForm (options: {
  props: TypeOf<typeof UForm.props>;
  slotVars?: object;
  slotComponents?: any;
  slotTemplate: string;
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
          UFormGroup,
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
    [
      'with default slot',
      { props: { state: {} }, slots: { default: 'Form slot' } }
    ]
  ])(
    'renders %s correctly',
    async (nameOrHtml: string, options: TypeOf<typeof UForm.props>) => {
      const html = await ComponentRender(nameOrHtml, options, UForm)
      expect(html).toMatchSnapshot()
    }
  )

  it.each([
    [
      'zod',
      {
        schema: z.object({
          email: z.string(),
          password: z.string().min(8, 'Must be at least 8 characters')
        })
      }
    ],

    [
      'yup',
      {
        schema: yup.object({
          email: yup.string(),
          password: yup.string().min(8, 'Must be at least 8 characters')
        })
      }
    ],

    [
      'joi',
      {
        schema: Joi.object({
          email: Joi.string(),
          password: Joi.string().min(8).messages({
            'string.min': 'Must be at least {#limit} characters'
          })
        })
      }
    ],

    [
      'valibot',
      {
        schema: valibot.objectAsync({
          email: valibot.string(),
          password: valibot.string([
            valibot.minLength(8, 'Must be at least 8 characters')
          ])
        })
      }
    ],

    [
      'custom',
      {
        validate (state: any) {
          const errs = []
          if (!state.email)
            errs.push({ path: 'email', message: 'Email is required' })
          if (state.password?.length < 8)
            errs.push({
              path: 'password',
              message: 'Must be at least 8 characters'
            })

          return errs
        }
      }
    ]
  ])(
    '%s validation works',
    async (_nameOrHtml: string, options: TypeOf<typeof UForm.props>) => {
      const wrapper = await renderForm({
        props: options,
        slotComponents: {
          UFormGroup,
          UInput
        },
        slotTemplate: `
          <UFormGroup name="email">
            <UInput id="email" v-model="state.email" />
          </UFormGroup>
          <UFormGroup name="password">
            <UInput id="password" v-model="state.password" />
          </UFormGroup>
        `
      })

      const form = wrapper.find('form')
      const emailInput = wrapper.find('#email')
      const passwordInput = wrapper.find('#password')

      await emailInput.setValue('bob@dylan.com')
      await passwordInput.setValue('short')

      await triggerEvent(form, 'submit.prevent')

      // @ts-ignore
      expect(wrapper.emitted('error')[0][0].errors).toMatchObject([
        {
          id: 'password',
          path: 'password',
          message: 'Must be at least 8 characters'
        }
      ])
      expect(wrapper.html()).toMatchSnapshot('with error')

      await passwordInput.setValue('validpassword')
      await triggerEvent(form, 'submit.prevent')

      // Ensure submit event was emitted
      expect(wrapper.emitted()).toHaveProperty('submit')
      expect(wrapper.emitted('submit')[0][0]).toMatchObject({
        data: { email: 'bob@dylan.com', password: 'validpassword' }
      })

      expect(wrapper.html()).toMatchSnapshot('without error')
    }
  )

  it.each([
    ['input', UInput, {}, 'foo'],
    ['textarea', UTextarea, {}, 'foo']
  ])(
    '%s validate on blur works',
    async (_name, InputComponent, inputProps, validInputValue) => {
      const wrapper = await renderForm({
        props: {
          validate (state: any) {
            if (!state.value)
              return [{ path: 'value', message: 'Error message' }]
            return []
          }
        },

        slotVars: {
          inputProps
        },
        slotComponents: { InputComponent },
        slotTemplate: `
          <UFormGroup name="value">
            <InputComponent id="input" v-model="state.value" v-bind="inputProps" />
          </UFormGroup>
        `
      })

      const input = wrapper.find('#input')
      await triggerEvent(input, 'blur')

      // Ideally this test would check form.errors to assert the validation errors, but it's not available from the wrapper.
      expect(wrapper.text()).toContain('Error message')

      input.setValue(validInputValue)
      await triggerEvent(input, 'blur')

      expect(wrapper.text()).not.toContain('Error message')
    }
  )

  it.each([
    ['checkbox', UCheckbox, {}, true],
    ['range', URange, {}, 2],
    ['select', USelect, { options: ['Option 1', 'Option 2'] }, 'Option 2']
  ])(
    '%s validate on change works',
    async (_name, InputComponent, inputProps, validInputValue) => {
      const wrapper = await renderForm({
        props: {
          validate (state: any) {
            if (!state.value)
              return [{ path: 'value', message: 'Error message' }]
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
          <UFormGroup name="value">
            <InputComponent id="input" v-model="state.value" v-bind="inputProps" />
          </UFormGroup>
        `
      })

      const input = wrapper.find('#input')

      await triggerEvent(input, 'change')
      // Ideally this test would check form.errors to assert the validation errors, but it's not available from the wrapper.
      expect(wrapper.text()).toContain('Error message')

      input.setValue(validInputValue)
      await triggerEvent(input, 'change')
      expect(wrapper.text()).not.toContain('Error message')
    }
  )

  test('radio group validate on change works', async () => {
    const wrapper = await renderForm({
      props: {
        validate (state: any) {
          if (state.value !== 'Option 2')
            return [{ path: 'value', message: 'Error message' }]
          return []
        }
      },
      slotVars: {
        inputProps: {
          options: ['Option 1', 'Option 2', 'Option 3']
        }
      },
      slotComponents: {
        UFormGroup,
        URadioGroup
      },
      slotTemplate: `
          <UFormGroup name="value">
            <URadioGroup id="input" v-model="state.value" v-bind="inputProps" />
          </UFormGroup>
        `
    })

    const option1 = wrapper.find('[value="Option 1"]')
    option1.setValue(true)
    await flushPromises()
    expect(wrapper.text()).toContain('Error message')

    const option2 = wrapper.find('[value="Option 2"]')
    option2.setValue(true)
    await flushPromises()

    expect(wrapper.text()).not.toContain('Error message')
  })

  test('radio validate on change works', async () => {
    const wrapper = await renderForm({
      props: {
        validate (state: any) {
          if (state.value !== 'Option 2')
            return [{ path: 'value', message: 'Error message' }]
          return []
        }
      },
      slotComponents: {
        UFormGroup,
        URadio
      },
      slotTemplate: `
          <UFormGroup name="value">
            <URadio id="option-1" v-model="state.value" value="Option 1" />
            <URadio id="option-2" v-model="state.value" value="Option 2" />
          </UFormGroup>
        `
    })

    const option1 = wrapper.find('#option-1')
    option1.setValue(true)
    await flushPromises()

    expect(wrapper.text()).toContain('Error message')

    const option2 = wrapper.find('#option-2')
    option2.setValue(true)
    await flushPromises()

    expect(wrapper.text()).not.toContain('Error message')
  })

  test('toggle validate on change', async () => {
    const wrapper = await renderForm({
      props: {
        validate (state: any) {
          if (state.value) return [{ path: 'value', message: 'Error message' }]
          return []
        }
      },
      slotComponents: {
        UFormGroup,
        UToggle
      },
      slotTemplate: `
          <UFormGroup name="value">
            <UToggle id="input" v-model="state.value" />
          </UFormGroup>
        `
    })

    const input = wrapper.findComponent({ name: 'Switch' })
    input.setValue(true)
    await flushPromises()

    expect(wrapper.text()).toContain('Error message')

    input.setValue(false)
    await flushPromises()

    expect(wrapper.text()).not.toContain('Error message')
  })

  test('select menu validate on change', async () => {
    const wrapper = await renderForm({
      props: {
        validate (state: any) {
          if (state.value !== 'Option 2')
            return [{ path: 'value', message: 'Error message' }]
          return []
        }
      },
      slotVars: {
        inputProps: {
          options: ['Option 1', 'Option 2', 'Option 3']
        }
      },
      slotComponents: {
        UFormGroup,
        USelectMenu
      },
      slotTemplate: `
          <UFormGroup name="value">
            <USelectMenu id="input" v-model="state.value" v-bind="inputProps" />
          </UFormGroup>
        `
    })

    const input = wrapper.findComponent({ name: 'Listbox' })
    input.setValue('Option 1')
    await flushPromises()

    expect(wrapper.text()).toContain('Error message')

    input.setValue('Option 2')
    await flushPromises()

    expect(wrapper.text()).not.toContain('Error message')
  })

  test('input menu validate on change', async () => {
    const wrapper = await renderForm({
      props: {
        validate (state: any) {
          if (state.value !== 'Option 2')
            return [{ path: 'value', message: 'Error message' }]
          return []
        }
      },
      slotVars: {
        inputProps: {
          options: ['Option 1', 'Option 2', 'Option 3']
        }
      },
      slotComponents: {
        UFormGroup,
        UInputMenu
      },
      slotTemplate: `
          <UFormGroup name="value">
            <UInputMenu id="input" v-model="state.value" v-bind="inputProps" />
          </UFormGroup>
        `
    })

    const input = wrapper.findComponent({ name: 'Combobox' })
    input.setValue('Option 1')
    await flushPromises()

    expect(wrapper.text()).toContain('Error message')

    input.setValue('Option 2')
    await flushPromises()

    expect(wrapper.text()).not.toContain('Error message')
  })

  it.each([
    ['input', UInput, {}, 'foo'],
    ['textarea', UTextarea, {}, 'foo']
  ])(
    '%s validate on input works',
    async (_name, InputComponent, inputProps, validInputValue) => {
      const wrapper = await renderForm({
        props: {
          validate (state: any) {
            if (!state.value)
              return [{ path: 'value', message: 'Error message' }]
            return []
          }
        },
        slotVars: {
          inputProps
        },
        slotComponents: {
          UFormGroup,
          InputComponent
        },
        slotTemplate: `
          <UFormGroup name="value">
            <InputComponent id="input" v-model="state.value" v-bind="inputProps" />
          </UFormGroup>
        `
      })

      const input = wrapper.find('#input')

      // Validation @input is enabled only after a blur event
      await triggerEvent(input, 'blur')

      // Ideally this test would check form.errors to assert the validation errors, but it's not available from the wrapper.
      expect(wrapper.text()).toContain('Error message')

      input.setValue(validInputValue)

      await triggerEvent(input, 'input')

      // Waiting because of the debounced validation on input event.
      await new Promise((r) => setTimeout(r, 300))

      expect(wrapper.text()).not.toContain('Error message')
    }
  )

  test('validateOn submit works', async () => {
    const wrapper = await renderForm({
      props: {
        validate (state: any) {
          if (!state.value)
            return [{ path: 'value', message: 'Error message' }]
          return []
        },
        validateOn: ['submit']
      },

      slotComponents: {
        UFormGroup,
        UInput
      },
      slotTemplate: `
        <UFormGroup name="value">
          <UInput id="input" v-model="state.value" />
        </UFormGroup>
      `
    })

    const form = wrapper.find('form')
    const input = wrapper.find('input')

    await triggerEvent(input, 'blur')
    expect(wrapper.text()).not.toContain('Error message')

    await triggerEvent(form, 'submit.prevent')
    expect(wrapper.text()).toContain('Error message')
  })
})
