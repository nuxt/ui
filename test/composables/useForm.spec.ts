import { describe, it, expect, vi } from 'vitest'
import { useForm } from '../../src/runtime/composables/useForm'
import { z } from 'zod'
import { ref } from 'vue'

describe('useForm', () => {
  it('should initialize with default values', () => {
    const { state } = useForm({
      defaultValues: {
        name: 'John Doe',
        email: 'john.doe@example.com'
      }
    })

    expect(state.name).toBe('John Doe')
    expect(state.email).toBe('john.doe@example.com')
  })

  it('should initialize with schema', () => {
    const schema = z.object({
      name: z.string().default('John Doe'),
      email: z.string().email().default('john.doe@example.com')
    })

    const { state } = useForm({
      schema
    })

    expect(state.name).toBe('John Doe')
    expect(state.email).toBe('john.doe@example.com')
  })

  it('should handle submission', async () => {
    const { handleSubmit } = useForm({
      defaultValues: {
        name: 'John'
      }
    })

    const onSuccess = vi.fn()
    const onError = vi.fn()

    const submit = handleSubmit(onSuccess, onError)

    await submit()

    expect(onSuccess).toHaveBeenCalledWith({ name: 'John' }, undefined)
    expect(onError).not.toHaveBeenCalled()
  })

  describe('reset', () => {
    it('should reset the form to its initial state', () => {
      const { state, reset } = useForm({
        defaultValues: {
          name: 'John'
        }
      })

      state.name = 'Jane'
      reset()

      expect(state.name).toBe('John')
    })

    it('should reset the form with new values', () => {
      const { state, reset } = useForm({
        defaultValues: {
          name: 'John'
        }
      })

      reset({ name: 'Jane' })

      expect(state.name).toBe('Jane')
    })

    it('should keep errors when keepErrors is true', () => {
      const { state, errors, setErrors, reset } = useForm({
        defaultValues: {
          name: 'John'
        }
      })

      setErrors([{ name: 'name', message: 'Error' }])
      reset({ name: 'Jane' }, { keepErrors: true })

      expect(state.name).toBe('Jane')
      expect(errors.value).toEqual([{ name: 'name', message: 'Error', id: undefined }])
    })

    it('should keep dirty state when keepDirty is true', () => {
      const { state, dirty, bind, reset } = useForm({
        defaultValues: {
          name: 'John'
        }
      })

      const nameField = bind('name')
      nameField['onUpdate:modelValue']('Jane')

      expect(dirty.value).toBe(true)

      reset({ name: 'Peter' }, { keepDirty: true })

      expect(state.name).toBe('Peter')
      expect(dirty.value).toBe(true)
    })

    it('should not update default values when keepDefaultValues is true', () => {
      const { state, reset } = useForm({
        defaultValues: {
          name: 'John'
        }
      })

      reset({ name: 'Jane' }, { keepDefaultValues: true })
      expect(state.name).toBe('Jane')

      reset()
      expect(state.name).toBe('John')
    })

    it('should reset with a function', () => {
      const { state, reset } = useForm({
        defaultValues: {
          name: 'John'
        }
      })

      reset((values: any) => ({ ...values, name: 'Jane' }))

      expect(state.name).toBe('Jane')
    })

    it('should reset partial nested values', () => {
      const { state, reset, dirtyFields, touchedFields, blurredFields, errors, setErrors } = useForm({
        defaultValues: {
          user: {
            name: 'John',
            email: 'john@example.com'
          },
          status: 'active'
        }
      })

      state.user.name = 'Jane'
      dirtyFields.add('user.name')
      touchedFields.add('user.name')
      blurredFields.add('user.name')

      state.status = 'inactive'
      dirtyFields.add('status')
      touchedFields.add('status')

      setErrors([
        { name: 'user.name', message: 'Name error' },
        { name: 'status', message: 'Status error' }
      ])

      expect(dirtyFields.size).toBe(2)
      expect(touchedFields.size).toBe(2)
      expect(errors.value.length).toBe(2)

      reset({
        user: {
          name: 'Peter'
        }
      })

      expect(state.user.name).toBe('Peter')
      expect(state.user.email).toBe('john@example.com')
      expect(state.status).toBe('inactive')

      expect(dirtyFields.has('user.name')).toBe(false)
      expect(touchedFields.has('user.name')).toBe(false)
      expect(blurredFields.has('user.name')).toBe(false)
      expect(dirtyFields.has('status')).toBe(true)
      expect(touchedFields.has('status')).toBe(true)
      expect(dirtyFields.size).toBe(1)
      expect(touchedFields.size).toBe(1)

      expect(errors.value.find(e => e.name === 'user.name')).toBeUndefined()
      expect(errors.value.length).toBe(1)
      expect(errors.value[0]?.name).toBe('status')
    })

    it('should keep dirty state for nested values when keepDirty is true', () => {
      const { state, reset, dirtyFields } = useForm({
        defaultValues: {
          user: {
            name: 'John'
          }
        }
      })

      state.user.name = 'Jane'
      dirtyFields.add('user.name')
      expect(dirtyFields.has('user.name')).toBe(true)

      reset({ user: { name: 'Peter' } }, { keepDirty: true })

      expect(state.user.name).toBe('Peter')
      expect(dirtyFields.has('user.name')).toBe(true)
    })
  })

  it('should reset a field', () => {
    const { state, resetField } = useForm({
      defaultValues: {
        name: 'John'
      }
    })

    state.name = 'Jane'
    resetField('name')

    expect(state.name).toBe(undefined)
  })

  it('should set field value', () => {
    const { state, setFieldValue } = useForm({
      defaultValues: {
        name: 'John'
      }
    })

    setFieldValue('name', 'Jane')
    expect(state.name).toBe('Jane')
  })

  it('should set errors', () => {
    const { errors, setErrors } = useForm({
      defaultValues: {
        name: 'John'
      }
    })

    setErrors([{ name: 'name', message: 'Error' }])
    expect(errors.value).toEqual([{ name: 'name', message: 'Error', id: undefined }])
  })

  it('should clear errors', () => {
    const { errors, setErrors, clearErrors } = useForm({
      defaultValues: {
        name: 'John'
      }
    })

    setErrors([{ name: 'name', message: 'Error' }])
    clearErrors()
    expect(errors.value).toEqual([])
  })

  it('should be disabled when loading', async () => {
    const { disabled, handleSubmit } = useForm({
      defaultValues: {
        name: 'John'
      }
    })

    const onSuccess = () => new Promise(resolve => setTimeout(resolve, 100))
    const submit = handleSubmit(onSuccess)

    const promise = submit()
    expect(disabled.value).toBe(true)

    await promise
    expect(disabled.value).toBe(false)
  })

  it('should not be disabled when loadingAuto is false', async () => {
    const { disabled, handleSubmit } = useForm({
      defaultValues: {
        name: 'John'
      },
      loadingAuto: false
    })

    const onSuccess = () => new Promise(resolve => setTimeout(resolve, 100))
    const submit = handleSubmit(onSuccess)

    const promise = submit()
    expect(disabled.value).toBe(false)

    await promise
    expect(disabled.value).toBe(false)
  })

  it('should be disabled when options.disabled is true', () => {
    const { disabled } = useForm({
      defaultValues: {
        name: 'John'
      },
      disabled: ref(true)
    })

    expect(disabled.value).toBe(true)
  })

  it('should update dirty, touched and blurred state', () => {
    const { dirty, touchedFields, blurredFields, bind } = useForm({
      defaultValues: {
        name: 'John'
      }
    })

    const nameField = bind('name')

    nameField['onUpdate:modelValue']('Jane')
    expect(dirty.value).toBe(true)
    expect(touchedFields.has('name')).toBe(true)

    nameField.onBlur()
    expect(blurredFields.has('name')).toBe(true)
  })

  it('should return errorBag', () => {
    const { errorBag, setErrors } = useForm({
      defaultValues: {
        name: 'John'
      }
    })

    setErrors([{ name: 'name', message: 'Error' }])
    expect(errorBag.value).toEqual({ name: { message: 'Error', id: undefined } })
  })

  it('accesing value with getFieldValue', () => {
    const { getFieldValue } = useForm({
      defaultValues: {
        user: {
          name: 'John Doe'
        }
      }
    })

    const getUserName = getFieldValue('user.name')

    expect(getUserName).toBe('John Doe')
  })
})
