import type { FuseResult, FuseResultMatch } from 'fuse.js'

function truncateHTMLFromStart(html: string, maxLength: number) {
  let truncated = ''
  let totalLength = 0
  let insideTag = false

  // Iterate through the HTML string in reverse order
  for (let i = html.length - 1; i >= 0; i--) {
    if (html[i] === '>') {
      insideTag = true
    } else if (html[i] === '<') {
      insideTag = false
      truncated = html[i] + truncated
      continue
    }

    if (!insideTag) {
      totalLength++
    }

    if (totalLength <= maxLength) {
      truncated = html[i] + truncated
    } else {
      // If we've reached the max length, we break out of the loop
      // to prevent further processing of the string
      truncated = '...' + truncated
      break
    }
  }

  return truncated
}

export function highlight<T>(item: T & { matches?: FuseResult<T>['matches'] }, searchTerm: string, forceKey?: string, omitKeys?: string[]) {
  function generateHighlightedText(value: FuseResultMatch['value'], indices: FuseResultMatch['indices'] = []) {
    value = value || ''
    let content = ''
    let nextUnhighlightedRegionStartingIndex = 0

    indices.forEach((region) => {
      // skip if region is a single character
      if (region.length === 2 && region[0] === region[1]) {
        return
      }

      const lastIndiceNextIndex = region[1] + 1
      const isMatched = (lastIndiceNextIndex - region[0]) >= searchTerm.length

      content += [
        value.substring(nextUnhighlightedRegionStartingIndex, region[0]),
        isMatched && `<mark>`,
        value.substring(region[0], lastIndiceNextIndex),
        isMatched && '</mark>'
      ].filter(Boolean).join('')

      nextUnhighlightedRegionStartingIndex = lastIndiceNextIndex
    })

    content += value.substring(nextUnhighlightedRegionStartingIndex)

    const markIndex = content.indexOf('<mark>')
    if (markIndex !== -1) {
      content = truncateHTMLFromStart(content, content.length - markIndex)
    }

    return content
  }

  if (!item.matches?.length) {
    return
  }

  for (const match of item.matches) {
    if (forceKey && match.key !== forceKey) {
      continue
    }
    if (omitKeys?.includes(match.key!)) {
      continue
    }

    return generateHighlightedText(match.value, match.indices)
  }
}
