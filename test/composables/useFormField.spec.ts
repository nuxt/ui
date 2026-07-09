import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, provide, computed, ref } from 'vue'
import { useEventBus } from '@vueuse/core'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import {
  useFormField,
  formOptionsInjectionKey,
  formBusInjectionKey,
  formFieldInjectionKey,
  inputIdInjectionKey
} from '../../src/runtime/composables/useFormField'
import type { FormEvent, FormFieldInjectedOptions, FormInjectedOptions } from '../../src/runtime/types/form'

// Concrete stand-in for a component's props type so `size`/`color` accept strings.
type TestProps = { size: string, color: string }

interface FieldProps {
  id?: string
  name?: string
  size?: string
  color?: string
  highlight?: boolean
  disabled?: boolean
}
type FieldOpts = Parameters<typeof useFormField>[1]

interface Context {
  formOptions?: FormInjectedOptions
  formField?: Partial<FormFieldInjectedOptions<any>>
  inputId?: string
}

async function mountField(props?: FieldProps, opts?: FieldOpts, ctx: Context = {}) {
  const events: FormEvent<any>[] = []
  const bus = useEventBus<FormEvent<any>>(Symbol('test-form'))
  bus.on(event => events.push(event))

  const inputIdRef = ref<string | undefined>(ctx.inputId)

  let api!: ReturnType<typeof useFormField<TestProps>>
  const Child = defineComponent({
    setup() {
      api = useFormField<TestProps>(props, opts)
      return () => null
    }
  })

  const Parent = defineComponent({
    setup() {
      provide(formBusInjectionKey, bus)
      provide(inputIdInjectionKey, inputIdRef)
      if (ctx.formOptions) {
        provide(formOptionsInjectionKey, computed(() => ctx.formOptions as FormInjectedOptions))
      }
      if (ctx.formField) {
        provide(formFieldInjectionKey, computed(() => ctx.formField as FormFieldInjectedOptions<any>))
      }
      return () => h(Child)
    }
  })

  const wrapper = await mountSuspended(Parent)
  return { api, events, inputIdRef, wrapper }
}

describe('useFormField', () => {
  describe('without a wrapping form field', () => {
    it('derives its values from the props', async () => {
      const { api } = await mountField({ id: 'my-id', name: 'my-name', size: 'lg', color: 'primary', highlight: true, disabled: true })

      expect(api.id.value).toBe('my-id')
      expect(api.name.value).toBe('my-name')
      expect(api.size.value).toBe('lg')
      expect(api.color.value).toBe('primary')
      expect(api.highlight.value).toBe(true)
      expect(api.disabled.value).toBe(true)
    })

    it('has no aria attributes', async () => {
      const { api } = await mountField({ name: 'x' })

      expect(api.ariaAttrs.value).toBeUndefined()
    })

    it('does not emit form events without an injected form field', async () => {
      const { api, events } = await mountField({ name: 'x' })

      api.emitFormBlur()
      api.emitFormChange()
      api.emitFormFocus()

      expect(events).toHaveLength(0)
    })
  })

  describe('with a wrapping form field', () => {
    it('falls back to the field name, size and id', async () => {
      const { api } = await mountField(
        {},
        undefined,
        { formField: { name: 'field-name', size: 'sm', ariaId: 'aria-1' }, inputId: 'input-1' }
      )

      expect(api.name.value).toBe('field-name')
      expect(api.size.value).toBe('sm')
      expect(api.id.value).toBe('input-1')
    })

    it('lets explicit props win over the field', async () => {
      const { api } = await mountField(
        { name: 'prop-name', size: 'xl' },
        undefined,
        { formField: { name: 'field-name', size: 'sm', ariaId: 'aria-1' } }
      )

      expect(api.name.value).toBe('prop-name')
      expect(api.size.value).toBe('xl')
    })

    it('forces error color and highlight when the field has an error', async () => {
      const { api } = await mountField(
        { color: 'primary', highlight: false },
        undefined,
        { formField: { ariaId: 'aria-1', error: 'Required' } }
      )

      expect(api.color.value).toBe('error')
      expect(api.highlight.value).toBe(true)
    })

    it('builds aria attributes from the descriptive field slots', async () => {
      const { api } = await mountField(
        {},
        undefined,
        { formField: { ariaId: 'aria-1', error: 'Required', hint: 'Hint', description: 'Desc' } }
      )

      const attrs = api.ariaAttrs.value!
      expect(attrs['aria-invalid']).toBe(true)
      expect(attrs['aria-describedby']).toBe('aria-1-error aria-1-hint aria-1-description')
    })

    it('marks aria-invalid false and omits describedby when there is no error or description', async () => {
      const { api } = await mountField({}, undefined, { formField: { ariaId: 'aria-1' } })

      const attrs = api.ariaAttrs.value!
      expect(attrs['aria-invalid']).toBe(false)
      expect(attrs['aria-describedby']).toBeUndefined()
    })

    it('reflects the form-level disabled option', async () => {
      const { api } = await mountField({}, undefined, { formField: { ariaId: 'aria-1' }, formOptions: { disabled: true } })

      expect(api.disabled.value).toBe(true)
    })
  })

  describe('input id binding', () => {
    it('sets the input id from props.id by default', async () => {
      const { inputIdRef } = await mountField({ id: 'bound-id' }, undefined, { formField: { ariaId: 'aria-1' }, inputId: 'initial' })

      expect(inputIdRef.value).toBe('bound-id')
    })

    it('clears the input id when bind is false', async () => {
      const { inputIdRef } = await mountField({ id: 'bound-id' }, { bind: false }, { formField: { ariaId: 'aria-1' }, inputId: 'initial' })

      expect(inputIdRef.value).toBeUndefined()
    })
  })

  describe('form events', () => {
    it('emits blur, focus and change with the field name', async () => {
      const { api, events } = await mountField({}, undefined, { formField: { name: 'email', ariaId: 'aria-1' } })

      api.emitFormBlur()
      api.emitFormFocus()
      api.emitFormChange()

      expect(events).toEqual([
        { type: 'blur', name: 'email', eager: undefined },
        { type: 'focus', name: 'email', eager: undefined },
        { type: 'change', name: 'email', eager: undefined }
      ])
    })

    it('emits a debounced eager input event', async () => {
      const { api, events } = await mountField({}, undefined, { formField: { name: 'email', ariaId: 'aria-1' } })

      api.emitFormInput()

      await vi.waitFor(() => expect(events).toContainEqual({ type: 'input', name: 'email', eager: true }))
    })

    it('defers input validation when requested and the field is not eager', async () => {
      const { api, events } = await mountField({}, { deferInputValidation: true }, { formField: { name: 'email', ariaId: 'aria-1', eagerValidation: false } })

      api.emitFormInput()

      await vi.waitFor(() => expect(events).toContainEqual({ type: 'input', name: 'email', eager: false }))
    })

    it('stays eager when the field opts into eager validation, even with defer', async () => {
      const { api, events } = await mountField({}, { deferInputValidation: true }, { formField: { name: 'email', ariaId: 'aria-1', eagerValidation: true } })

      api.emitFormInput()

      await vi.waitFor(() => expect(events).toContainEqual({ type: 'input', name: 'email', eager: true }))
    })
  })
})
