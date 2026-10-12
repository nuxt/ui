import { describe, it, expect } from 'vitest'
import { defineComponent, h } from 'vue'
import { resolveAs } from '../../src/runtime/utils'

const defaults = { root: 'div', title: 'h2' }

describe('resolveAs', () => {
  it('returns defaults when undefined', () => {
    expect(resolveAs(undefined, defaults)).toEqual(defaults)
  })

  it('applies a string to root', () => {
    expect(resolveAs('section', defaults)).toEqual({ root: 'section', title: 'h2' })
  })

  it('merges an object with defaults', () => {
    expect(resolveAs({ title: 'h3' }, defaults)).toEqual({ root: 'div', title: 'h3' })
    expect(resolveAs({ root: 'section', title: 'h3' }, defaults)).toEqual({ root: 'section', title: 'h3' })
  })

  it('applies a component with a render function to root', () => {
    const component = { render: () => h('div') }
    expect(resolveAs(component, defaults).root).toBe(component)
  })

  it('applies a setup-only component to root', () => {
    const component = defineComponent({ setup: () => () => h('div') })
    expect(resolveAs(component, defaults).root).toBe(component)
  })

  it('applies a functional component to root', () => {
    const component = () => h('div')
    expect(resolveAs(component, defaults).root).toBe(component)
  })
})
