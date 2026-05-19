import { describe, it, expect } from 'vitest'
import { sanitizeSnippet } from '../../src/runtime/utils/search'

describe('sanitizeSnippet', () => {
  it('preserves <mark> highlights', () => {
    expect(sanitizeSnippet('foo <mark>bar</mark> baz')).toBe('foo <mark>bar</mark> baz')
  })

  it('escapes other tags so they cannot be interpreted as HTML', () => {
    expect(sanitizeSnippet('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;')
  })

  it('escapes script tags even when mixed with mark highlights', () => {
    expect(sanitizeSnippet('<mark>hit</mark> <script>x</script>'))
      .toBe('<mark>hit</mark> &lt;script&gt;x&lt;/script&gt;')
  })

  it('escapes HTML-special characters', () => {
    expect(sanitizeSnippet(`5 < 10 & "quoted" 'value'`))
      .toBe('5 &lt; 10 &amp; &quot;quoted&quot; &#39;value&#39;')
  })

  it('does not double-escape the mark tag itself', () => {
    expect(sanitizeSnippet('<mark><b>x</b></mark>'))
      .toBe('<mark>&lt;b&gt;x&lt;/b&gt;</mark>')
  })

  it('handles empty input', () => {
    expect(sanitizeSnippet('')).toBe('')
  })
})
