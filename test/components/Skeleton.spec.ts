import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Skeleton from '../../src/runtime/components/Skeleton.vue'
import type { SkeletonProps } from '../../src/runtime/components/Skeleton.vue'
import ComponentRender from '../component-render'

describe('Skeleton', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'span' } }],
    ['with class', { props: { class: 'rounded-full size-12' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: SkeletonProps }) => {
    const html = await ComponentRender(nameOrHtml, options, Skeleton)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Skeleton, {
      props: {
        class: 'h-4 w-32'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
