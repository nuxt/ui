import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AuthForm from '../../src/runtime/components/AuthForm.vue'
import type { AuthFormProps, AuthFormSlots } from '../../src/runtime/components/AuthForm.vue'
import ComponentRender from '../component-render'

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
  }]

  const props = { fields }

  it.each([
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
  ])('renders %s correctly', async (nameOrHtml: string, options: { props: AuthFormProps, slots?: Partial<AuthFormSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, AuthForm)
    expect(html).toMatchSnapshot()
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
