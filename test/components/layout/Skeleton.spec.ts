import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import { USkeleton } from '#components'

describe('Skeleton', () => {
  it.each([
    ['basic case', { }],
    ['<USkeleton class="h-12 w-12" :ui="{ rounded: \'rounded-full\' }" />'],
    ['<USkeleton as="span" />']
  ])('renders %s correctly', async (nameOrHtml: string, options?: TypeOf<typeof USkeleton.props>) => {
    const html = await ComponentRender(nameOrHtml, options, USkeleton)
    expect(html).toMatchSnapshot()
  })
})
