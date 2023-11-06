// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import { mountSuspended } from 'nuxt-vitest/utils'
import Button from '../../src/runtime/components/elements/Button.vue'

type ButtonOptions = TypeOf<typeof Button.props>

describe.only('Button', () => {
  it.each([
    [ 'basic case', { } ],
    [ 'leading icon', { props: { leading: true, icon: 'heroicons-check' } } ],
    [ 'black solid', { props: { color: 'black', variant: 'solid' } } ],
    [ 'rounded full', { props: { ui: { rounded: 'rounded-full' } } } ],
    [ '<UButton icon="i-heroicons-pencil-square" size="sm" color="primary" square variant="solid" />' ]
  ])('renders %s correctly', async (nameOrHtml: string, options: ButtonOptions) => {
    let html
    if (options === undefined) {
      const app = {
        template: nameOrHtml,
        components: { UButton: Button }
      }
      const result = await mountSuspended(app)
      html = result.html()
    } else {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
      const component = await mountSuspended(Button, options)
      html = component.html()
    }
    expect(html).toMatchSnapshot()
  })
})
