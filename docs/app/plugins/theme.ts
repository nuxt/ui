import { themeIcons } from '../utils/theme'

export default defineNuxtPlugin({
  enforce: 'post',
  setup() {
    const appConfig = useAppConfig()

    if (import.meta.client) {
      function restoreCustomColors() {
        const raw = localStorage.getItem('nuxt-ui-custom-colors')
        if (!raw) return

        try {
          const customColors = JSON.parse(raw)
          const vars = Object.entries(customColors).flatMap(([name, shades]) =>
            Object.entries(shades as Record<string, string>).map(([shade, hex]) => `--color-${name}-${shade}: ${hex};`)
          )

          if (vars.length) {
            const styleEl = document.createElement('style')
            styleEl.id = 'chat-custom-colors'
            document.head.appendChild(styleEl)
            styleEl.textContent = `:root { ${vars.join(' ')} }`
          }
        }
        catch {}
      }

      restoreCustomColors()

      function updateColor(type: 'primary' | 'neutral') {
        const color = localStorage.getItem(`nuxt-ui-${type}`)
        if (color) {
          appConfig.ui.colors[type] = color
        }
      }

      function updateRadius() {
        const radius = localStorage.getItem('nuxt-ui-radius')
        if (radius) {
          appConfig.theme.radius = Number.parseFloat(radius)
        }
      }

      function updateBlackAsPrimary() {
        const blackAsPrimary = localStorage.getItem('nuxt-ui-black-as-primary')
        if (blackAsPrimary) {
          appConfig.theme.blackAsPrimary = blackAsPrimary === 'true'
        }
      }

      function updateFont() {
        const font = localStorage.getItem('nuxt-ui-font')
        if (font) {
          appConfig.theme.font = font
        }
      }

      function restoreAiTheme() {
        const raw = localStorage.getItem('nuxt-ui-ai-theme')
        if (!raw) return

        try {
          const extras = JSON.parse(raw)
          if (extras.colors) {
            for (const [key, value] of Object.entries(extras.colors)) {
              (appConfig.ui.colors as any)[key] = value
            }
          }
          if (extras.ui) {
            for (const [key, value] of Object.entries(extras.ui)) {
              if (key === 'colors' || key === 'icons') continue
              ;(appConfig.ui as any)[key] = value
            }
          }
        }
        catch {}
      }

      updateColor('primary')
      updateColor('neutral')
      updateRadius()
      updateBlackAsPrimary()
      updateFont()
      restoreAiTheme()
    }

    onNuxtReady(() => {
      function updateIcons() {
        const icons = localStorage.getItem('nuxt-ui-icons')
        if (icons) {
          appConfig.theme.icons = icons
          appConfig.ui.icons = themeIcons[icons as keyof typeof themeIcons] as any
        }
      }

      updateIcons()
    })

    if (import.meta.server) {
      useHead({
        script: [{
          innerHTML: `
            (function() {
              var raw = localStorage.getItem('nuxt-ui-custom-colors');
              if (raw) {
                try {
                  var colors = JSON.parse(raw);
                  var vars = [];
                  for (var name in colors) {
                    for (var shade in colors[name]) {
                      vars.push('--color-' + name + '-' + shade + ': ' + colors[name][shade] + ';');
                    }
                  }
                  if (vars.length) {
                    var s = document.createElement('style');
                    s.id = 'chat-custom-colors';
                    s.textContent = ':root { ' + vars.join(' ') + ' }';
                    document.head.appendChild(s);
                  }
                } catch(e) {}
              }
            })();
          `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -2
        }, {
          innerHTML: `
            let html = document.querySelector('style#nuxt-ui-colors').innerHTML;

            if (localStorage.getItem('nuxt-ui-primary')) {
              const primaryColor = localStorage.getItem('nuxt-ui-primary');
              if (primaryColor !== 'black') {
                html = html.replace(
                  /(--ui-color-primary-\\d{2,3}:\\s*var\\(--color-)${appConfig.ui.colors.primary}(-\\d{2,3}.*?\\))/g,
                  \`$1\${primaryColor}$2\`
                );
              }
            }
            if (localStorage.getItem('nuxt-ui-neutral')) {
              let neutralColor = localStorage.getItem('nuxt-ui-neutral');
              html = html.replace(
                /(--ui-color-neutral-\\d{2,3}:\\s*var\\(--color-)${appConfig.ui.colors.neutral}(-\\d{2,3}.*?\\))/g,
                \`$1\${neutralColor === 'neutral' ? 'old-neutral' : neutralColor}$2\`
              );
            }

            document.querySelector('style#nuxt-ui-colors').innerHTML = html;
            `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }, {
          innerHTML: `
            if (localStorage.getItem('nuxt-ui-radius')) {
              document.querySelector('style#nuxt-ui-radius').innerHTML = ':root { --ui-radius: ' + localStorage.getItem('nuxt-ui-radius') + 'rem; }';
            }
          `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }, {
          innerHTML: `
            if (localStorage.getItem('nuxt-ui-black-as-primary') === 'true') {
              document.querySelector('style#nuxt-ui-black-as-primary').innerHTML = ':root { --ui-primary: black; } .dark { --ui-primary: white; }';
            } else {
              document.querySelector('style#nuxt-ui-black-as-primary').innerHTML = '';
            }
          `.replace(/\s+/g, ' ')
        }, {
          innerHTML: `
            if (localStorage.getItem('nuxt-ui-font')) {
              const font = localStorage.getItem('nuxt-ui-font');
              document.querySelector('style#nuxt-ui-font').innerHTML = ':root { --font-sans: \\'' + font + '\\', sans-serif; }';
            }
          `.replace(/\s+/g, ' ')
        }]
      })
    }
  }
})
