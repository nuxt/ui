import { describe, it, expect } from 'vitest'
import { defineComponent, h, reactive } from 'vue'
import { isUnsafeComponent, resolveAs } from '../../src/runtime/utils'

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

  it('applies a component inheriting its render function to root', () => {
    const component = defineComponent({ extends: { render: () => h('div') } })
    expect(resolveAs(component, defaults).root).toBe(component)
  })

  it('drops components compiled from a template string', () => {
    expect(resolveAs({ template: '<b />' }, defaults)).toEqual(defaults)
    expect(resolveAs({ extends: { template: '<b />' } }, defaults)).toEqual(defaults)
    expect(resolveAs({ root: { template: '<b />' }, title: 'h3' }, defaults)).toEqual({ root: 'div', title: 'h3' })
  })

  it('applies a functional component to root', () => {
    const component = () => h('div')
    expect(resolveAs(component, defaults).root).toBe(component)
  })
})

describe('isUnsafeComponent', () => {
  // Vue unwraps a `__v_raw` key in development, after the check
  it('rejects a template wrapped in `__v_raw`', () => {
    expect(isUnsafeComponent({ __v_raw: { template: '<b />' } })).toBe(true)
  })

  it('accepts a reactive component', () => {
    expect(isUnsafeComponent(reactive({ render: () => h('div') }))).toBe(false)
    expect(isUnsafeComponent(reactive({ root: 'section', title: 'h3' }))).toBe(false)
  })
})
