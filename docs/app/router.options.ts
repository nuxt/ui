import type { RouterConfig } from '@nuxt/schema'
// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig> {
  scrollBehavior (to, _form, savedPosition) {
    if (history.state.stop) { return }

    if (history.state.smooth) {
      return {
        el: history.state.smooth,
        behavior: 'smooth'
      }
    }

    if (to.hash) {
      const el = document.querySelector(to.hash) as any

      if (!el) { return }

      const { marginTop } = getComputedStyle(el)

      const marginTopValue = parseInt(marginTop)

      const offset = (document.querySelector(to.hash) as any).offsetTop - marginTopValue

      return {
        top: offset,
        behavior: 'smooth'
      }
    }

    // Scroll to top of window
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
}
