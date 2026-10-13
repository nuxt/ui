import { describe, it, expect } from 'vitest'
import { defineLocale, extendLocale } from '../../src/runtime/composables/defineLocale'

interface TestMessages {
  greeting: string
  nested: {
    hello: string
    bye: string
  }
}

const baseOptions = {
  name: 'English',
  code: 'en',
  messages: {
    greeting: 'Hello',
    nested: {
      hello: 'Hello',
      bye: 'Bye'
    }
  }
}

describe('defineLocale', () => {
  it('returns the provided options untouched', () => {
    const locale = defineLocale<TestMessages>(baseOptions)

    expect(locale.name).toBe('English')
    expect(locale.code).toBe('en')
    expect(locale.messages).toEqual(baseOptions.messages)
  })

  it('defaults dir to ltr when not provided', () => {
    const locale = defineLocale<TestMessages>(baseOptions)

    expect(locale.dir).toBe('ltr')
  })

  it('keeps an explicit dir', () => {
    const locale = defineLocale<TestMessages>({ ...baseOptions, dir: 'rtl' })

    expect(locale.dir).toBe('rtl')
  })
})

describe('extendLocale', () => {
  it('overrides top-level fields', () => {
    const base = defineLocale<TestMessages>(baseOptions)
    const extended = extendLocale<TestMessages>(base, { name: 'British English', code: 'en-GB' })

    expect(extended.name).toBe('British English')
    expect(extended.code).toBe('en-GB')
  })

  it('deep-merges messages, keeping untouched keys from the base', () => {
    const base = defineLocale<TestMessages>(baseOptions)
    const extended = extendLocale<TestMessages>(base, {
      messages: {
        nested: {
          hello: 'Hi'
        }
      }
    })

    expect(extended.messages.nested.hello).toBe('Hi')
    // Untouched keys fall back to the base locale.
    expect(extended.messages.nested.bye).toBe('Bye')
    expect(extended.messages.greeting).toBe('Hello')
  })

  it('inherits dir from the base locale when not overridden', () => {
    const base = defineLocale<TestMessages>({ ...baseOptions, dir: 'rtl' })
    const extended = extendLocale<TestMessages>(base, { name: 'Variant' })

    expect(extended.dir).toBe('rtl')
  })

  it('does not mutate the base locale', () => {
    const base = defineLocale<TestMessages>(baseOptions)
    extendLocale<TestMessages>(base, { name: 'Variant', messages: { greeting: 'Yo' } })

    expect(base.name).toBe('English')
    expect(base.messages.greeting).toBe('Hello')
  })
})
