import { describe, it, expect } from 'vitest'
import Container, { type ContainerProps } from '../../src/runtime/components/Container.vue'
import ComponentRender from '../component-render'

describe('Container', () => {
  it.each([
    ['basic case', {}],
    ['with as', { props: { as: 'article' } }],
    ['with class', { props: { class: 'max-w-5xl' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ContainerProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Container)
    expect(html).toMatchSnapshot()
  })
})
