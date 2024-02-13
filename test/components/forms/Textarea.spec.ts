import { describe, it, expect } from 'vitest'
import { UTextarea } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Textarea', () => {
  it.each([
    ['basic case', {}],
    ['with id', { id: 'exampleId' }],
    ['with name', { name: 'exampleName' }],
    ['with placeholder', { placeholder: 'examplePlaceholder' }],
    ['with required', { required: true }],
    ['with disabled', { disabled: true }],
    ['with rows', { rows: 5 }],
    ['with maxrows', { maxrows: 10 }],
    ['with autoresize', { autoresize: true }],
    ['with autofocus', { autofocus: true }],
    ['with autofocusDelay', { autofocusDelay: 200 }],
    ['with resize', { resize: true }],
    ['with padded', { padded: false }],
    ['with size', { size: 'sm' }],
    ['with color', { color: 'blue' }],
    ['with variant', { variant: 'outline' }],
    ['with textareaClass', { textareaClass: 'w-full' }],
    ['with modelModifiers', { modelModifiers: { trim: true, lazy: false, number: true } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Textarea.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UTextarea)
    expect(html).toMatchSnapshot()
  })
})
