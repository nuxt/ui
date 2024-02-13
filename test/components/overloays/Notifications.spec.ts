import { describe, it, expect } from 'vitest'
import { UNotification } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Notification', () => {
  it.each([
    ['basic case', {}],
    // // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Notification.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UNotification)
    expect(html).toMatchSnapshot()
  })
})
