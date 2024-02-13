import { describe, it, expect } from 'vitest'
import { UForm } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import { ZodSchema } from 'zod'

describe('Form', () => {
  it.each([
    ['basic case', {}],
    ['with custom state', { props: { state: { username: 'john_doe', password: 'password123' } } }],
    ['with custom validate function', { props: { validate: () => [] } }],
    ['with custom validateOn array', { props: { validateOn: ['submit'] } }],
    ['with custom validateOn array including other events', { props: { validateOn: ['blur', 'input', 'change', 'submit'] } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Form.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UForm)
    expect(html).toMatchSnapshot()
  })
})
