import { defu } from 'defu'
import { themeIcons, cssVariableDefaults } from '../utils/theme'

export default defineNuxtPlugin({
  enforce: 'post',
  setup() {
    const appConfig = useAppConfig()

    if (import.meta.client) {
      const primary = localStorage.getItem('nuxt-ui-primary')
      if (primary) appConfig.ui.colors.primary = primary

      const neutral = localStorage.getItem('nuxt-ui-neutral')
      if (neutral) appConfig.ui.colors.neutral = neutral

      const icons = localStorage.getItem('nuxt-ui-icons')
      if (icons) appConfig.ui.icons = themeIcons[icons as keyof typeof themeIcons] as any

      function restoreState<T>(key: string) {
        try {
          const raw = localStorage.getItem(key)
          if (raw) {
            const state = useState<T>(key)
            state.value = JSON.parse(raw)
          }
        } catch {
          // ignore malformed localStorage
        }
      }

      restoreState('nuxt-ui-ai-theme')
      restoreState('nuxt-ui-custom-colors')
      restoreState('nuxt-ui-css-variables')

      try {
        const extras = JSON.parse(localStorage.getItem('nuxt-ui-ai-theme') || '{}')
        if (extras.colors) {
          for (const [key, value] of Object.entries(extras.colors)) {
            (appConfig.ui.colors as any)[key] = value
          }
        }
        if (extras.ui) {
          onNuxtReady(() => {
            for (const [key, value] of Object.entries(extras.ui)) {
              if (key === 'colors' || key === 'icons') continue
              (appConfig.ui as any)[key] = defu(value as Record<string, any>, (appConfig.ui as any)[key] || {})
            }
          })
        }
      } catch {
        // ignore malformed localStorage
      }
    }

    if (import.meta.server) {
      // Inline scripts below intentionally duplicate logic from the client-side composable
      // (useTheme / injectCustomColors / injectCSSVariables) to restore persisted theme
      // settings on first paint and prevent a flash of unstyled content (FOUC).
      // The script IDs (chat-custom-colors, chat-css-variables, nuxt-ui-radius, etc.)
      // correspond to the <style> elements managed by useTheme via useHead.
      useHead({
        script: [{
          innerHTML: `
            var colorsEl = document.querySelector('style#nuxt-ui-colors');
            if (colorsEl) {
              let html = colorsEl.innerHTML;

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

              colorsEl.innerHTML = html;
            }
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
          innerHTML: [
            `if (localStorage.getItem('nuxt-ui-font')) {`,
            `var font = localStorage.getItem('nuxt-ui-font');`,
            `document.querySelector('style#nuxt-ui-font').innerHTML = ':root { --font-sans: \\'' + font + '\\', sans-serif; }';`,
            `if (font !== 'Public Sans') {`,
            `var lnk = document.createElement('link');`,
            `lnk.rel = 'stylesheet';`,
            `lnk.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(font) + ':wght@400;500;600;700&display=swap';`,
            `lnk.id = 'font-' + font.toLowerCase().replace(/\\s+/g, '-');`,
            `document.head.appendChild(lnk);`,
            `}}`
          ].join(' ')
        }, {
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
                    var el = document.getElementById('chat-custom-colors');
                    if (el) { el.textContent = ':root { ' + vars.join(' ') + ' }'; }
                  }
                } catch(e) {}
              }
            })();
          `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }, {
          innerHTML: `
            (function() {
              var raw = localStorage.getItem('nuxt-ui-css-variables');
              if (raw) {
                try {
                  var cssVars = JSON.parse(raw);
                  var defaults = ${JSON.stringify(cssVariableDefaults)};
                  function merge(defs, overrides) {
                    var result = [];
                    for (var key in defs) { result.push(key + ': ' + (overrides[key] || defs[key]) + ';'); }
                    for (var key in overrides) { if (!defs[key]) result.push(key + ': ' + overrides[key] + ';'); }
                    return result;
                  }
                  var parts = [];
                  if (cssVars.light && Object.keys(cssVars.light).length) {
                    parts.push('.light { ' + merge(defaults.light, cssVars.light).join(' ') + ' }');
                  }
                  if (cssVars.dark && Object.keys(cssVars.dark).length) {
                    parts.push('.dark { ' + merge(defaults.dark, cssVars.dark).join(' ') + ' }');
                  }
                  if (parts.length) {
                    var el = document.getElementById('chat-css-variables');
                    if (el) { el.textContent = parts.join(' '); }
                  }
                } catch(e) {}
              }
            })();
          `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }]
      })
    }
  }
})
