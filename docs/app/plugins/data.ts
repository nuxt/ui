export default defineNuxtPlugin({
  enforce: 'post',
  setup() {
    const { framework, module } = useSharedData()

    if (import.meta.client) {
      useHead({
        htmlAttrs: {
          'data-framework': framework,
          'data-module': module
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

          var f = getCookie('nuxt-ui-framework');
          document.documentElement.setAttribute('data-framework', f || 'nuxt');
          var m = getCookie('nuxt-ui-module');
          document.documentElement.setAttribute('data-module', m || 'ui');
          `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }]
      })
    }
  }
})
