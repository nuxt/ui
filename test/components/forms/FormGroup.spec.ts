import { describe, it, expect } from 'vitest'
import { UFormGroup } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

// FIXME: Remove skip
describe.skip('FormGroup', () => {
  it.each([
    ['with label and description', { props: { label: 'Username', description: 'Enter your username' } }],
    ['with size', { props: { label: 'Username', description: 'Enter your username', size: 'xl' } }],
    ['with required', { props: { label: 'Username', required: true } }],
    ['with help', { props: { help: 'Username must be unique' } }],
    ['with error', { props: { error: 'Username is already taken' } }],
    ['with hint', { props: { hint: 'Use letters, numbers, and special characters' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UFormGroup.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UFormGroup)
    expect(html).toMatchSnapshot()
  })
})
