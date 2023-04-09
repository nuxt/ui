import type { RouterConfig } from '@nuxt/schema'

function findHashPosition (hash): { el: any, behavior: ScrollBehavior, top: number } {
  const el = document.querySelector(hash)
  // vue-router does not incorporate scroll-margin-top on its own.
  if (el) {
    const top = parseFloat(getComputedStyle(el).scrollMarginTop)

    return {
      el: hash,
      behavior: 'smooth',
      top
    }
  }
}

// https://router.vuejs.org/api/#routeroptions
export default <RouterConfig>{
  scrollBehavior (to, from, savedPosition) {
    const nuxtApp = useNuxtApp()

    // If history back
    if (savedPosition) {
      // Handle Suspense resolution
      return new Promise((resolve) => {
        nuxtApp.hooks.hookOnce('page:finish', () => {
          setTimeout(() => resolve(savedPosition), 50)
        })
      })
    }

    // Scroll to heading on click
    if (to.hash) {
      return new Promise((resolve) => {
        if (to.path === from.path) {
          setTimeout(() => resolve(findHashPosition(to.hash)), 50)
        } else {
          nuxtApp.hooks.hookOnce('page:finish', () => {
            setTimeout(() => resolve(findHashPosition(to.hash)), 50)
          })
        }
      })
    }

    // Scroll to top of window
    return { top: 0 }
  }
}
