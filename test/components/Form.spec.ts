import { reactive, ref, nextTick } from 'vue'
import { describe, it, expect, test, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { z } from 'zod'
import * as yup from 'yup'
import Joi from 'joi'
import * as valibot from 'valibot'
import { object, string, nonempty, refine } from 'superstruct'
import ComponentRender from '../component-render'
import type { FormProps, FormSlots } from '../../src/runtime/components/Form.vue'
import { renderForm } from '../utils/form'

import {
  UForm,
  UInput,
  UFormField
} from '#components'
import { flushPromises } from '@vue/test-utils'

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
    ['superstruct', {
      schema: object({
        email: nonempty(string()),
        password: refine(string(), 'Password', (value) => {
          if (value.length >= 8) return true
          return 'Must be at least 8 characters'
        })
      })
    }],
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
    const onSubmit = vi.fn()

    const wrapper = await renderForm({
      props: { ...options, onSubmit },
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

    await emailInput.setValue('bob@dylan.com')
    await passwordInput.setValue('short')

    await form.trigger('submit.prevent')
    await flushPromises()
    // @ts-expect-error object is possibly undefined
    expect(wrapper.emitted('error')[0][0].errors).toMatchObject([
      {
        id: 'password',
        name: 'password',
        message: 'Must be at least 8 characters'
      }
    ])

    expect(wrapper.html()).toMatchSnapshot('with error')

    await passwordInput.setValue('validpassword')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      data: { email: 'bob@dylan.com', password: 'validpassword' }
    }))

    expect(wrapper.html()).toMatchSnapshot('without error')
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

    test('validate on submit works', async () => {
      state.email = 'bob@dylan.com'
      state.password = 'strongpassword'

      await form.value.submit()

      expect(wrapper.setupState.onSubmit).toHaveBeenCalledTimes(1)
      expect(wrapper.setupState.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        type: 'submit',
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

  describe('apply transform', async () => {
    it.each([
      [
        'zod',
        z.object({
          value: z.string().transform(value => value.toUpperCase())
        }),
        { value: 'test' },
        { value: 'TEST' }
      ],
      [
        'yup',
        yup.object({
          value: yup.string().transform(value => value.toUpperCase())
        }),
        { value: 'test' },
        { value: 'TEST' }
      ],
      [
        'joi',
        Joi.object({
          value: Joi.string().custom(value => value.toUpperCase())
        }),
        { value: 'test' },
        { value: 'TEST' }
      ],
      [
        'valibot',
        valibot.object({
          value: valibot.pipe(valibot.string(), valibot.transform(v => v.toUpperCase()))
        }),
        { value: 'test' },
        { value: 'TEST' }
      ]
    ])(
      '%s schema transform works',
      async (_name: string, schema: any, input: any, expected: any) => {
        const wrapper = await mountSuspended({
          components: {
            UFormField,
            UForm,
            UInput
          },
          setup() {
            const form = ref()
            const state = reactive({})
            const onSubmit = vi.fn()
            return { state, schema, form, onSubmit }
          },
          template: `
          <UForm ref="form" :state="state" :schema="schema" @submit="onSubmit">
            <UFormField name="value">
              <UInput id="input" v-model="state.value" />
            </UFormField>
          </UForm>
        `
        })
        const form = wrapper.setupState.form

        const inputEl = wrapper.find('#input')
        inputEl.setValue(input.value)

        form.value.submit()
        await flushPromises()

        expect(wrapper.setupState.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
          data: expected
        }))
      }
    )
  })
  test('form field errorPattern works', async () => {
    const wrapper = await mountSuspended({
      components: {
        UFormField,
        UForm,
        UInput
      },
      setup() {
        const form = ref()
        const state = reactive({})
        function validate() {
          return [{ name: 'email.1', message: 'Error message' }]
        }
        return { state, validate, form }
      },
      template: `
          <UForm ref="form" :state="state" :validate="validate">
            <UFormField id="emailField" :error-pattern="/(email)\\..*/">
              <UInput id="emailInput" v-model="state.email" />
            </UFormField>
          </UForm>
        `
    })

    const form = wrapper.setupState.form
    form.value.submit()
    await flushPromises()
    expect(wrapper.html()).toContain('Error message')
  })
})
