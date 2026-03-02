import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Skeleton from '../../src/runtime/components/Skeleton.vue'

describe('Skeleton', () => {
  renderEach(Skeleton, [
    // Props
    ['with as', { props: { as: 'span' } }],
    ['with class', { props: { class: 'rounded-full size-12' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Skeleton, {
      props: {
        class: 'h-4 w-32'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
