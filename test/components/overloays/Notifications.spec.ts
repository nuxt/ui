import { describe, it, expect } from 'vitest'
import { UNotifications } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Notifications', () => {
  it.each([
    ['basic case', { }],
    // // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UNotifications.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UNotifications)
    expect(html).toMatchSnapshot()
  })
})
