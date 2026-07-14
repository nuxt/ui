import { bench, describe } from 'vitest'
import { sanitizeSnippet, highlight } from '../src/runtime/utils/search'

const plainSnippet = 'The quick brown fox jumps over the lazy dog. '.repeat(10)
const markedSnippet = 'The quick <mark>brown</mark> fox jumps over the <mark>lazy</mark> dog. '.repeat(10)
const unsafeSnippet = '<script>alert(1)</script> 5 < 10 & "quoted" \'value\' '.repeat(10)

describe('sanitizeSnippet', () => {
  bench('plain text', () => {
    sanitizeSnippet(plainSnippet)
  })

  bench('with mark highlights', () => {
    sanitizeSnippet(markedSnippet)
  })

  bench('with unsafe html', () => {
    sanitizeSnippet(unsafeSnippet)
  })
})

const item = {
  title: 'The quick brown fox jumps over the lazy dog',
  description: 'A pangram containing every letter of the alphabet at least once, repeated for emphasis. '.repeat(5),
  matches: [
    {
      key: 'title',
      value: 'The quick brown fox jumps over the lazy dog',
      indices: [[4, 8], [10, 14], [20, 24]] as [number, number][]
    },
    {
      key: 'description',
      value: 'A pangram containing every letter of the alphabet at least once, repeated for emphasis. '.repeat(5),
      indices: [[2, 8], [40, 47], [100, 106]] as [number, number][]
    }
  ]
}

describe('highlight', () => {
  bench('highlight matches', () => {
    highlight(item, 'quick')
  })

  bench('highlight with token search', () => {
    highlight(item, 'quick brown fox', undefined, undefined, true)
  })
})
