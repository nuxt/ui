import { defineNuxtModule } from '@nuxt/kit'

type MinimarkNode = string | [string, Record<string, unknown>, ...MinimarkNode[]]

// `Soon` or a version like `4.12+`, the `:badge` labels on docs headings
const LABEL_RE = /^(?:Soon|\d+\.\d+\+)$/

// `badge` elements only, so the syntax shown inside a code block doesn't count
function collectLabels(nodes: MinimarkNode[], labels: string[] = []): string[] {
  for (const node of nodes) {
    if (typeof node === 'string') {
      continue
    }
    const label = node[1]?.label
    if (node[0] === 'badge' && typeof label === 'string' && LABEL_RE.test(label)) {
      labels.push(label)
    }
    collectLabels(node.slice(2) as MinimarkNode[], labels)
  }
  return labels
}

function latestLabel(labels: string[]): string | undefined {
  if (labels.includes('Soon')) {
    return 'Soon'
  }
  return labels.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))[0]
}

// Stores the most recent change badge of each page as `navigation.changed`. Parsed pages
// are cached by content, so the comparison with the current version happens in
// `server/api/navigation.json.get.ts` instead of here.
export default defineNuxtModule((_, nuxt) => {
  nuxt.hook('content:file:afterParse', ({ content, collection }) => {
    if (collection.name !== 'docs' || content.navigation === false) {
      return
    }

    const navigation = (typeof content.navigation === 'object' ? content.navigation : {}) as { badge?: string }
    // new components already carry a `Soon` or `New` badge
    if (navigation.badge) {
      return
    }

    const body = content.body as { value?: MinimarkNode[] } | undefined
    const changed = latestLabel(collectLabels(body?.value || []))
    if (changed) {
      content.navigation = { ...navigation, changed }
    }
  })
})
