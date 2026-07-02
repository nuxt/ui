import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AuthForm from '../../src/runtime/components/AuthForm.vue'
import type { FormSchema } from '../../src/runtime/types/form'
import type { AuthFormProps } from '../../src/runtime/components/AuthForm.vue'
import { renderEach } from '../component-render'

describe('AuthForm', () => {
  const fields = [{
    name: 'email',
    label: 'Email',
    type: 'text' as const,
    error: 'Invalid email format'
  }, {
    name: 'password',
    label: 'Password',
    type: 'password' as const
  }] satisfies AuthFormProps['fields']

  const props = { fields }

  renderEach(AuthForm<FormSchema, typeof fields[number]>, [
    // Props
    ['with fields', { props }],
    ['with title', { props: { ...props, title: 'Title' } }],
    ['with description', { props: { ...props, description: 'Description' } }],
    ['with icon', { props: { ...props, icon: 'i-lucide-user' } }],
    ['with providers', { props: { ...props, providers: [{ label: 'Google', icon: 'i-simple-icons-google' }] } }],
    ['with separator', { props: { ...props, separator: 'or' } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with loading', { props: { ...props, loading: true } }],
    ['with submit', { props: { ...props, submit: { label: 'Submit' } } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'max-w-sm' } }],
    ['with ui', { props: { ...props, ui: { title: 'text-2xl' } } }],
    // Slots
    ['with header slot', { props, slots: { header: () => 'Header' } }],
    ['with leading slot', { props, slots: { leading: () => 'Leading' } }],
    ['with title slot', { props, slots: { title: () => 'Title' } }],
    ['with description slot', { props, slots: { description: () => 'Description' } }],
    ['with providers slot', { props, slots: { providers: () => 'Providers' } }],
    ['with validation slot', { props, slots: { validation: () => 'Validation' } }],
    ['with submit slot', { props, slots: { submit: () => 'Submit' } }],
    ['with footer slot', { props, slots: { footer: () => 'Footer' } }]
  ])

  it('toggles password fields visibility independently', async () => {
    const passwordFields = [{
      name: 'password',
      label: 'Password',
      type: 'password' as const
    }, {
      name: 'password_confirmation',
      label: 'Password confirmation',
      type: 'password' as const
    }] satisfies AuthFormProps['fields']

    const wrapper = await mountSuspended(AuthForm, {
      props: { fields: passwordFields }
    })

    const inputs = () => wrapper.findAll('input')
    const toggles = wrapper.findAll('button[aria-label="Show password"]')
    expect(toggles).toHaveLength(2)

    // `aria-controls` points to its own input, not a shared one
    expect(toggles[0]!.attributes('aria-controls')).toBe(inputs()[0]!.attributes('id'))
    expect(toggles[1]!.attributes('aria-controls')).toBe(inputs()[1]!.attributes('id'))
    expect(toggles[0]!.attributes('aria-controls')).not.toBe(toggles[1]!.attributes('aria-controls'))

    // Revealing the first field does not reveal the second
    await toggles[0]!.trigger('click')
    expect(inputs()[0]!.attributes('type')).toBe('text')
    expect(inputs()[1]!.attributes('type')).toBe('password')
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(AuthForm, {
      props: {
        fields,
        title: 'Title',
        description: 'Description',
        icon: 'i-lucide-user',
        providers: [{ label: 'Google', icon: 'i-simple-icons-google' }],
        separator: 'or',
        submit: { label: 'Submit' }
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
