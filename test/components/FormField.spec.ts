import { defineComponent } from 'vue'
import { describe, it, expect } from 'vitest'
import FormField, { type FormFieldProps, type FormFieldSlots } from '../../src/runtime/components/FormField.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/form-field'

// A wrapper component is needed here because of a conflict with the error prop / expose.
// See: https://github.com/nuxt/test-utils/issues/684
const FormFieldWrapper = defineComponent({
  components: {
    UFormField: FormField
  },
  template: `<UFormField>
  <template v-for="(_, name) in $slots" #[name]="slotData">
    <slot :name="name" v-bind="slotData" />
  </template>
</UFormField>`
})

describe('FormField', () => {
  const sizes = Object.keys(theme.variants.size) as any

  it.each([
    // Props
    ['with label and description', { props: { label: 'Username', description: 'Enter your username' } }],
    ['with required', { props: { label: 'Username', required: true } }],
    ['with help', { props: { help: 'Username must be unique' } }],
    ['with error', { props: { error: 'Username is already taken' } }],
    ['with hint', { props: { hint: 'Use letters, numbers, and special characters' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { label: 'Username', description: 'Enter your username', size } }]),
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'relative' } }],
    ['with ui', { props: { ui: { label: 'text-[var(--ui-text-highlighted)]' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with label slot', { slots: { label: () => 'Label slot' } }],
    ['with description slot', { slots: { description: () => 'Description slot' } }],
    ['with error slot', { slots: { error: () => 'Error slot' } }],
    ['with hint slot', { slots: { hint: () => 'Hint slot' } }],
    ['with help slot', { slots: { help: () => 'Help slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: FormFieldProps, slots?: Partial<FormFieldSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, FormFieldWrapper)
    expect(html).toMatchSnapshot()
  })
})
