export default defineNuxtPlugin({
  enforce: 'post',
  setup() {
    const appConfig = useAppConfig()

    if (import.meta.client) {
      const primary = window.localStorage.getItem('nuxt-ui-primary')
      if (primary) {
        appConfig.ui.colors.primary = primary
      }

      const gray = window.localStorage.getItem('nuxt-ui-gray')
      if (gray) {
        appConfig.ui.colors.gray = gray
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
            if (localStorage.getItem('nuxt-ui-gray')) {
              html = html.replaceAll('${appConfig.ui.colors.gray}', localStorage.getItem('nuxt-ui-gray'))
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
