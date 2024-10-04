export default defineNuxtPlugin({
  enforce: 'post',
  setup() {
    const appConfig = useAppConfig()

    if (import.meta.client) {
      const primary = window.localStorage.getItem('nuxt-ui-primary')
      if (primary) {
        appConfig.ui.colors.primary = primary
      }

      const neutral = window.localStorage.getItem('nuxt-ui-neutral')
      if (neutral) {
        appConfig.ui.colors.neutral = neutral
      }
    }

    if (import.meta.server) {
      useHead({
        script: [
          {
            innerHTML: `
            let html = document.querySelector('style#nuxt-ui-colors').innerHTML;

            if (localStorage.getItem('nuxt-ui-primary')) {
              html = html.replaceAll('${appConfig.ui.colors.primary}', localStorage.getItem('nuxt-ui-primary'))
            }
            if (localStorage.getItem('nuxt-ui-neutral')) {
              html = html.replaceAll('${appConfig.ui.colors.neutral}', localStorage.getItem('nuxt-ui-neutral'))
            }

            document.querySelector('style#nuxt-ui-colors').innerHTML = html
            `.replace(/\s+/g, ' '),
            type: 'text/javascript',
            tagPriority: -1
          }
        ]
      })
    }
  }
})
