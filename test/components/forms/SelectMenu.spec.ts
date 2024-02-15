import { describe, it, expect } from 'vitest'
import { USelectMenu } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('SelectMenu', () => {
  it.each([
    ['basic case', {}],
    ['with custom name', { props: { name: 'SelectMenuName' } }],
    ['width required', { props: { required: true } }],
    ['width icon', { props: { icon: 'i-heroicons-academic-cap' } }],
    ['width searchable', { props: { searchable: true } }],
    ['with options', {
      props: { options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3', disabled: true }
      ]
    } }]

    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof SelectMenu.props>) => {



    const html = await ComponentRender(nameOrHtml, options, USelectMenu)
    expect(html).toMatchSnapshot()
  })
})
