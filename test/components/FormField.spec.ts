import { defineComponent } from 'vue'
import { describe, it, expect } from 'vitest'
import FormField, { type FormFieldProps } from '../../src/runtime/components/FormField.vue'
import ComponentRender from '../component-render'

// A wrapper component is needed here because of a conflict with the error prop / expose.
// See: https://github.com/nuxt/test-utils/issues/684
const FormFieldWrapper = defineComponent({
  components: {
    UFormField: FormField
  },
  template: '<UFormField v-bind="$attrs"> <slot /> </UFormField>'
})

describe('FormField', () => {
  it.each([
    ['with label and description', { props: { label: 'Username', description: 'Enter your username' } }],
    ['with size', { props: { label: 'Username', description: 'Enter your username', size: 'xl' as const } }],
    ['with required', { props: { label: 'Username', required: true } }],
    ['with help', { props: { help: 'Username must be unique' } }],
    ['with error', { props: { error: 'Username is already taken' } }],
    ['with hint', { props: { hint: 'Use letters, numbers, and special characters' } }],
    ['with class', { props: { class: 'relative' } }],
    ['with ui', { props: { ui: { label: 'text-gray-900 dark:text-white' } } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with label slot', { slots: { label: () => 'Label slot' } }],
    ['with description slot', { slots: { description: () => 'Description slot' } }],
    ['with error slot', { slots: { error: () => 'Error slot' } }],
    ['with hint slot', { slots: { hint: () => 'Hint slot' } }],
    ['with help slot', { slots: { help: () => 'Help slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: FormFieldProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, FormFieldWrapper)
    expect(html).toMatchSnapshot()
  })
})
