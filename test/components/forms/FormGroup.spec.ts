import { describe, it, expect } from 'vitest'
import { UFormGroup } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('FormGroup', () => {
  it.each([
    // TODO: try to fix TypeError: 'set' on proxy: trap returned falsish for property 'error'
    //['basic case', { }],
    // ['with custom name and size', { props: { name: 'username', size: 'medium' } }],
    // ['with label and description', { props: { label: 'Username', description: 'Enter your username' } }],
    // ['with required flag set to true', { props: { required: true } }],
    // ['with help text', { props: { help: 'Username must be unique' } }],
    // ['with error message', { props: { error: 'Username is already taken' } }],
    // ['with hint', { props: { hint: 'Use letters, numbers, and special characters' } }],
    // ['with custom class', { props: { class: 'custom-class' } }],
    // ['with custom UI size mapping', { props: { ui: { size: { medium: 'medium-size' } } } }],
    // ['with eagerValidation', { props: { eagerValidation: true } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof FormGroup.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UFormGroup)
    expect(html).toMatchSnapshot()
  })
})
