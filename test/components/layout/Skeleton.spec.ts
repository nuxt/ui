import { describe, it, expect } from 'vitest'
import Skeleton from '../../../src/runtime/components/layout/Skeleton.vue'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Skeleton', () => {
  it.each([
    [ 'basic case', { } ],
    [ '<USkeleton class="h-12 w-12" :ui="{ rounded: \'rounded-full\' }" />' ]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Skeleton.props>) => {
    const html = await ComponentRender(nameOrHtml, options, Skeleton)
    expect(html).toMatchSnapshot()
  })
})
