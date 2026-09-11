function skipLineComment(source: string, start: number) {
  const end = source.indexOf('\n', start)
  return end === -1 ? source.length : end + 1
}

function skipBlockComment(source: string, start: number) {
  const end = source.indexOf('*/', start + 2)
  return end === -1 ? source.length : end + 2
}

function skipQuoted(source: string, start: number) {
  const quote = source[start]
  let index = start + 1
  while (index < source.length) {
    if (source[index] === '\\') {
      index += 2
      continue
    }
    if (source[index] === quote) return index + 1
    index++
  }
  return source.length
}

function skipTemplate(source: string, start: number) {
  let index = start + 1
  while (index < source.length) {
    const char = source[index]
    if (char === '\\') {
      index += 2
      continue
    }
    if (char === '`') return index + 1
    if (char === '$' && source[index + 1] === '{') {
      index = skipBalanced(source, index + 1)
      continue
    }
    index++
  }
  return source.length
}

function skipBalanced(source: string, start: number) {
  let depth = 0
  let index = start
  while (index < source.length) {
    const char = source[index]
    if (char === '"' || char === '\'') {
      index = skipQuoted(source, index)
      continue
    }
    if (char === '`') {
      index = skipTemplate(source, index)
      continue
    }
    if (char === '/' && source[index + 1] === '/') {
      index = skipLineComment(source, index)
      continue
    }
    if (char === '/' && source[index + 1] === '*') {
      index = skipBlockComment(source, index)
      continue
    }
    if (char === '{') {
      depth++
      index++
      continue
    }
    if (char === '}') {
      depth--
      index++
      if (depth === 0) return index
      continue
    }
    index++
  }
  return source.length
}

export function extractUiFromAppConfigSource(source: string): Record<string, unknown> | null {
  const match = /\bui:\s*\{/.exec(source)
  if (!match || match.index == null) return null
  const start = source.indexOf('{', match.index)
  if (start === -1) return null
  const end = skipBalanced(source, start)
  if (end <= start) return null
  try {
    return Function(`"use strict"; return (${source.slice(start, end)})`)() as Record<string, unknown>
  } catch {
    return null
  }
}
