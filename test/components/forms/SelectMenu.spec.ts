import { describe, it, expect } from 'vitest'
import { USelectMenu } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('SelectMenu', () => {
  it.each([
    //TODO: try to fix doesn't work with headless ui component
    ['basic case', {}],
    // ['with custom name', { props: {v name: 'SelectMenuName' } }],
    // ['width required', { props: { required: true } }],
    // ['width icon', { props: { icon: 'i-heroicons-academic-cap' } }],
    // ['width searchable', { props: { searchable: true } }],
    // ['with options', {
    //   props: { options: [
    //     { label: 'Option 1', value: 'option1' },
    //     { label: 'Option 2', value: 'option2' },
    //     { label: 'Option 3', value: 'option3', disabled: true }
    //   ]
    // } }]

    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof SelectMenu.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }



    const html = await ComponentRender(nameOrHtml, options, USelectMenu)
    expect(html).toMatchSnapshot()
  })
})
