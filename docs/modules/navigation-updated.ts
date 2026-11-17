import { defineNuxtModule } from '@nuxt/kit'

type MinimarkNode = string | [string, Record<string, unknown>, ...MinimarkNode[]]

// a `badge` element, so the syntax shown inside a code block doesn't count
function hasSoonBadge(nodes: MinimarkNode[]): boolean {
  return nodes.some(node => typeof node !== 'string' && (
    (node[0] === 'badge' && node[1]?.label === 'Soon') || hasSoonBadge(node.slice(2) as MinimarkNode[])
  ))
}

// Flags the pages that document an unreleased change with a `Soon` badge so the sidebar
// can mark them. The release-badges skill turns those badges into versions on release,
// which clears the flag without any manual step.
export default defineNuxtModule((_, nuxt) => {
  nuxt.hook('content:file:afterParse', ({ content, collection }) => {
    const body = content.body as { value?: MinimarkNode[] } | undefined
    if (collection.name !== 'docs' || !hasSoonBadge(body?.value || [])) {
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
