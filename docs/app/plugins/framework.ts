export default defineNuxtPlugin({
  enforce: 'post',
  setup() {
    const { framework } = useSharedData()

    if (import.meta.client) {
      useHead({
        htmlAttrs: {
          'data-framework': framework
        }
      })
    }

    if (import.meta.server) {
      useHead({
        script: [{
          innerHTML: `
          function getCookie(name) {
            var value = '; ' + window.document.cookie;
            var parts = value.split('; ' + name + '=');
            if (parts.length === 2) {
              return parts.pop()?.split(';').shift();
            }
          }

          var framework = getCookie('nuxt-ui-framework');
          document.documentElement.setAttribute('data-framework', framework || 'nuxt');
          `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }]
      })
    }
  }
})
