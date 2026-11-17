import { defineNuxtModule } from '@nuxt/kit'

const SOON_BADGE_RE = /:badge\{[^}]*label="Soon"/

// Flags the pages that document an unreleased change with a `Soon` badge so the sidebar
// can mark them. The release-badges skill turns those badges into versions on release,
// which clears the flag without any manual step.
export default defineNuxtModule((_, nuxt) => {
  nuxt.hook('content:file:afterParse', ({ file, content, collection }) => {
    if (collection.name !== 'docs' || !SOON_BADGE_RE.test(file.body)) {
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
