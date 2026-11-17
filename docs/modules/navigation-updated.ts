import { defineNuxtModule } from '@nuxt/kit'
import pkg from '../../package.json' with { type: 'json' }

type MinimarkNode = string | [string, Record<string, unknown>, ...MinimarkNode[]]

// `Soon` for unreleased changes, `4.12+` for the ones shipped in the current minor
const [major, minor] = pkg.version.split('.')
const labels = ['Soon', `${major}.${minor}+`]

// a `badge` element, so the syntax shown inside a code block doesn't count
function hasRecentBadge(nodes: MinimarkNode[]): boolean {
  return nodes.some(node => typeof node !== 'string' && (
    (node[0] === 'badge' && labels.includes(node[1]?.label as string)) || hasRecentBadge(node.slice(2) as MinimarkNode[])
  ))
}

// Flags the pages with a change that is unreleased or part of the current minor so the
// sidebar can mark them. The flag moves on with the badges and the version on each minor
// release, without any manual step.
export default defineNuxtModule((_, nuxt) => {
  nuxt.hook('content:file:afterParse', ({ content, collection }) => {
    const body = content.body as { value?: MinimarkNode[] } | undefined
    if (collection.name !== 'docs' || !hasRecentBadge(body?.value || [])) {
      return
    }
    if (content.navigation === false) {
      return
    }

    const navigation = (typeof content.navigation === 'object' ? content.navigation : {}) as { badge?: string }
    // new components already carry a `Soon` or `New` badge
    if (navigation.badge) {
      return
    }

    content.navigation = { ...navigation, updated: true }
  })
})
