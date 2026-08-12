export interface SearchableComponent {
  name?: string
  title?: string
  description?: string
  keywords?: string[]
}

export function tokenize(query: string): string[] {
  return normalizeQuery(query).split(/[^a-z0-9]+/).filter(token => token.length >= 3)
}

function normalizeQuery(query: string): string {
  return query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036F]/g, '').trim()
}

/** Tokens only contain `[a-z0-9]` so they are safe to inline in a regex. */
function matchesWord(text: string, token: string): boolean {
  return new RegExp(`\\b${token}`).test(text)
}

/**
 * Scores a component against a search query, matching name, title, keywords
 * and description at both phrase and token level. Keywords hold alternate
 * names from other ecosystems (e.g. "segmented control" for FieldGroup) and
 * only match on word boundaries to keep short keywords from firing inside
 * unrelated words.
 */
export function scoreComponent(component: SearchableComponent, query: string): number {
  const search = normalizeQuery(query)
  if (!search) {
    return 0
  }

  const name = (component.name ?? '').toLowerCase()
  const nameWords = name.replace(/-/g, ' ')
  const title = (component.title ?? '').toLowerCase()
  const keywords = (component.keywords ?? []).map(keyword => keyword.toLowerCase())
  const description = (component.description ?? '').toLowerCase()
  const searchTokens = tokenize(search)

  let score = 0

  if (name === search || nameWords === search || title === search) {
    score += 100
  } else if (name.includes(search) || nameWords.includes(search) || title.includes(search)) {
    score += 60
  }

  if (keywords.includes(search)) {
    score += 50
  } else if (keywords.some((keyword) => {
    if (keyword.startsWith(search)) {
      return true
    }
    // Only multi-word keywords match by containment, single words score at token level
    const keywordTokens = tokenize(keyword)
    return keywordTokens.length > 1 && keywordTokens.every(token => searchTokens.includes(token))
  })) {
    score += 40
  }

  if (description.includes(search)) {
    score += 20
  }

  for (const token of searchTokens) {
    if (matchesWord(nameWords, token) || matchesWord(title, token)) {
      score += 12
    }
    if (keywords.some(keyword => matchesWord(keyword, token))) {
      score += 8
    }
    if (matchesWord(description, token)) {
      score += 3
    }
  }

  return score
}
