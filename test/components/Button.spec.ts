// @vitest-environment nuxt
import { describe, it, expect } from 'vitest'
import Button from '../../src/runtime/components/elements/Button.vue'
import type { TypeOf } from 'zod'
import ComponentRender from './component-render'

type ButtonOptions = TypeOf<typeof Button.props>

describe.only('Button', () => {
  it.each([
    [ 'basic case', { } ],
    [ 'leading icon', { props: { leading: true, icon: 'heroicons-check' } } ],
    [ 'black solid', { props: { color: 'black', variant: 'solid' } } ],
    [ 'rounded full', { props: { ui: { rounded: 'rounded-full' } } } ],
    [ '<UButton icon="i-heroicons-pencil-square" size="sm" color="primary" square variant="solid" />' ]
  ])('renders %s correctly', async (nameOrHtml: string, options: ButtonOptions) => {
    const html = await ComponentRender(nameOrHtml, options, Button)
    expect(html).toMatchSnapshot()
  })
})
