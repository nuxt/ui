import { describe, it, expect } from 'vitest'
import { highlight, sanitizeSnippet } from '../../src/runtime/utils/search'

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

describe('highlight', () => {
  it('escapes an injected tag in the unmatched tail while keeping the match highlighted', () => {
    const value = 'zzzzz &<img src=x onerror=alert(1)>'
    const result = highlight({ label: value, matches: [{ key: 'label', value, indices: [[0, 4]] }] }, 'zzzzz', 'label')

    expect(result).toContain('<mark>zzzzz</mark>')
    expect(result).not.toContain('<img')
    expect(result).toContain('&lt;img')
    expect(result).toContain('&amp;')
  })

  it('escapes payloads that contain a pre-existing HTML entity (regression: sanitize bypass)', () => {
    const value = '&amp;<img src=x onerror=alert(1)>'
    const result = highlight({ label: value, matches: [{ key: 'label', value, indices: [] }] }, 'x', 'label')

    expect(result).not.toContain('<img')
    expect(result).toBe('&amp;amp;&lt;img src=x onerror=alert(1)&gt;')
  })

  it('escapes HTML-special characters around the highlighted region', () => {
    const value = `match < & "a" 'b'`
    const result = highlight({ label: value, matches: [{ key: 'label', value, indices: [[0, 4]] }] }, 'match', 'label')

    expect(result).toBe(`<mark>match</mark> &lt; &amp; &quot;a&quot; &#39;b&#39;`)
  })

  it('returns undefined when there are no matches', () => {
    expect(highlight({ label: 'foo', matches: [] }, 'foo', 'label')).toBeUndefined()
    expect(highlight({ label: 'foo' }, 'foo', 'label')).toBeUndefined()
  })

  describe('truncation from the start', () => {
    // Matches a high surrogate not followed by a low one, or a low surrogate not
    // preceded by a high one — i.e. half of an astral character.
    const LONE_SURROGATE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/

    function highlightAfterFiller(filler: string, count: number) {
      const value = filler.repeat(count) + 'match'
      const index = value.indexOf('match')

      return highlight({ label: value, matches: [{ key: 'label', value, indices: [[index, index + 4]] }] }, 'match', 'label')
    }

    it('never splits an astral character, at any truncation boundary', () => {
      // Truncating by UTF-16 code unit used to slice the pair in half whenever the
      // boundary landed between its surrogates — from 7 emoji onward, and every
      // length after that.
      const split = Array.from({ length: 40 }, (_, i) => i + 1)
        .filter(count => LONE_SURROGATE.test(highlightAfterFiller('\u{1F600}', count) ?? ''))

      expect(split).toEqual([])
    })

    it('keeps emoji before the match intact', () => {
      const result = highlightAfterFiller('\u{1F600}', 20)

      expect(result).toContain('<mark>match</mark>')
      expect(result).not.toContain('�')
      expect(result?.replace(/^\.\.\./, '')).not.toMatch(LONE_SURROGATE)
    })

    it('still truncates a long prefix down to an ellipsis', () => {
      const result = highlightAfterFiller('a', 50)

      expect(result).toMatch(/^\.\.\.a+<mark>match<\/mark>$/)
    })
  })
})
