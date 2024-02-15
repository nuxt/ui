import { describe, it, expect } from 'vitest'
import { UTextarea } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Textarea', () => {
  it.each([
    ['basic case', {}],
    ['with id', { props: { id: 'exampleId' } }],
    ['with name', { props: { name: 'exampleName' } }],
    ['with placeholder', { props: { placeholder: 'examplePlaceholder' } }],
    ['with required', { props: { required: true } }],
    ['with disabled', { props: { disabled: true } }],
    ['with rows', { props: { rows: 5 } }],
    ['with padded', { props: { padded: false } }],
    ['with size', { props: { size: 'sm' } }],
    ['with color', { color: 'blue' }],
    ['with variant', { variant: 'outline' }],
    ['with default slot', { slots: { default: 'default slot' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Textarea.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UTextarea)
    expect(html).toMatchSnapshot()
  })
})
