import { defu } from 'defu'
import { themeIcons, cssVariableDefaults } from '../utils/theme'
import { themeStorageKeys, THEME_STATE_KEYS } from '../utils/theme-keys'
import { mergeUi, styleComponents } from '../utils/theme-engine'

export default defineNuxtPlugin({
  enforce: 'post',
  setup() {
    const appConfig = useAppConfig()
    // The FOUC scripts below are generated JS SOURCE — they must read the
    // very keys useTheme writes, so both sides resolve them from here.
    const storageKeys = themeStorageKeys()

    // The applied theme's <style>/<link> head entries live here, not in the
    // consuming app's app.vue — extending the layer is all the wiring an app
    // needs. The FOUC scripts below patch these very tags by id on first paint.
    const { style, link, color } = useTheme()
    useHead({
      meta: [{ key: 'theme-color', name: 'theme-color', content: color }],
      link,
      style
    })

    if (import.meta.client) {
      const primary = localStorage.getItem(storageKeys.primary)
      if (primary) appConfig.ui.colors.primary = primary

      const neutral = localStorage.getItem(storageKeys.neutral)
      if (neutral) appConfig.ui.colors.neutral = neutral

      const icons = localStorage.getItem(storageKeys.icons)
      if (icons) appConfig.ui.icons = themeIcons[icons as keyof typeof themeIcons] as any

      // Storage keys are app-namespaced, useState keys aren't — every restore
      // names both sides explicitly (state must also be clearable by
      // resetTheme, outside the composable that owns it).
      function restoreState<T>(storageKey: string, stateKey: string) {
        try {
          const raw = localStorage.getItem(storageKey)
          if (raw) {
            useState<T>(stateKey).value = JSON.parse(raw)
          }
        } catch {
          // ignore malformed localStorage
        }
      }

      restoreState(storageKeys.aiTheme, THEME_STATE_KEYS.aiTheme)
      restoreState(storageKeys.styleUi, THEME_STATE_KEYS.styleUi)
      restoreState(storageKeys.customColors, THEME_STATE_KEYS.customColors)
      restoreState(storageKeys.cssVariables, THEME_STATE_KEYS.cssVariables)
      restoreState(storageKeys.fontPrefs, THEME_STATE_KEYS.fontPrefs)
      restoreState(storageKeys.style, THEME_STATE_KEYS.stylePrefs)
      restoreState(storageKeys.paletteParams, THEME_STATE_KEYS.paletteParams)

      // The persisted style-ui bundle is DERIVED from the style prefs —
      // recompute it on load so fragment changes shipped in code reach
      // already-persisted themes instead of serving a stale bundle.
      const persisted = useState<any>(THEME_STATE_KEYS.stylePrefs)
      if (persisted.value && Object.keys(persisted.value).length) {
        const bundle = styleComponents(persisted.value)
        useState<Record<string, any>>(THEME_STATE_KEYS.styleUi).value = bundle
        if (Object.keys(bundle).length) {
          localStorage.setItem(storageKeys.styleUi, JSON.stringify(bundle))
        } else {
          localStorage.removeItem(storageKeys.styleUi)
        }
      }

      // One persistent watcher keeps the shadow root flags in lockstep on
      // every path — applyDoc (presets) bypasses setStyle, so per-call-site
      // toggles would miss it.
      const stylePrefs = useState<{ shadow?: string }>(THEME_STATE_KEYS.stylePrefs)
      watch(() => stylePrefs.value?.shadow, (shadow) => {
        const flags = document.documentElement.classList
        flags.toggle('shadow-custom', shadow === 'custom')
        flags.toggle('shadow-none', shadow === 'flat')
      }, { immediate: true })

      try {
        const extras = JSON.parse(localStorage.getItem(storageKeys.aiTheme) || '{}')
        if (extras.colors) {
          for (const [key, value] of Object.entries(extras.colors)) {
            (appConfig.ui.colors as any)[key] = value
          }
        }
        const styleUi = JSON.parse(localStorage.getItem(storageKeys.styleUi) || '{}')
        if (extras.ui || Object.keys(styleUi).length) {
          onNuxtReady(() => {
            // same order as the live path: style bundle first, extras win
            const merged = mergeUi(styleUi, extras.ui || {})
            for (const [key, value] of Object.entries(merged)) {
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
      // FOUC scripts: intentionally duplicate useTheme's logic to restore
      // persisted settings on first paint, targeting the same <style> ids.
      useHead({
        script: [{
          innerHTML: `
            (function() {
              var primaryColor = localStorage.getItem('${storageKeys.primary}');
              var neutralColor = localStorage.getItem('${storageKeys.neutral}');
              if (!primaryColor && !neutralColor) return;
              function swapColors(el) {
                var html = el.innerHTML;
                if (primaryColor && primaryColor !== 'black') {
                  html = html.replace(
                    /(--ui-color-primary-\\d{2,3}:\\s*var\\(--color-)${appConfig.ui.colors.primary}(-\\d{2,3}.*?\\))/g,
                    \`$1\${primaryColor}$2\`
                  );
                }
                if (neutralColor) {
                  html = html.replace(
                    /(--ui-color-neutral-\\d{2,3}:\\s*var\\(--color-)${appConfig.ui.colors.neutral}(-\\d{2,3}.*?\\))/g,
                    \`$1\${neutralColor === 'neutral' ? 'old-neutral' : neutralColor}$2\`
                  );
                }
                el.innerHTML = html;
              }
              var colorsEl = document.querySelector('style#nuxt-ui-colors');
              if (colorsEl) {
                swapColors(colorsEl);
              } else {
                var obs = new MutationObserver(function(mutations) {
                  for (var i = 0; i < mutations.length; i++) {
                    for (var j = 0; j < mutations[i].addedNodes.length; j++) {
                      var node = mutations[i].addedNodes[j];
                      if (node.id === 'nuxt-ui-colors') {
                        swapColors(node);
                        obs.disconnect();
                        return;
                      }
                    }
                  }
                });
                obs.observe(document.head, { childList: true });
              }
            })();
            `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }, {
          innerHTML: `
            var rRaw = localStorage.getItem('${storageKeys.radius}');
            if (rRaw) {
              var rNum = parseFloat(rRaw);
              if (isFinite(rNum) && rNum >= 0) {
                var el = document.querySelector('style#nuxt-ui-radius');
                if (el) { el.textContent = ':root { --ui-radius: ' + rNum + 'rem; }'; }
              }
            }
          `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }, {
          innerHTML: `
            var fsRaw = localStorage.getItem('${storageKeys.fontSize}');
            if (fsRaw && fsRaw !== '16') {
              var fsNum = parseFloat(fsRaw);
              if (isFinite(fsNum)) {
                fsNum = Math.min(20, Math.max(12, fsNum));
                var fsEl = document.querySelector('style#nuxt-ui-font-size');
                if (fsEl) { fsEl.textContent = 'html { font-size: ' + fsNum + 'px; }'; }
              }
            }
            var spRaw = localStorage.getItem('${storageKeys.spacing}');
            if (spRaw && spRaw !== '0.25') {
              var spNum = parseFloat(spRaw);
              if (isFinite(spNum)) {
                spNum = Math.min(0.5, Math.max(0.125, spNum));
                var spEl = document.querySelector('style#nuxt-ui-spacing');
                if (spEl) { spEl.textContent = ':root { --spacing: ' + spNum + 'rem; }'; }
              }
            }
          `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }, {
          innerHTML: `
            try {
              var st = JSON.parse(localStorage.getItem('${storageKeys.style}') || '{}');
              var sh = st && st.shadow;
              if (sh === 'custom') document.documentElement.classList.add('shadow-custom');
              else if (sh === 'flat') document.documentElement.classList.add('shadow-none');
            } catch (e) {}
          `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }, {
          innerHTML: `
            var bapEl = document.querySelector('style#nuxt-ui-black-as-primary');
            if (bapEl) {
              if (localStorage.getItem('${storageKeys.blackAsPrimary}') === 'true') {
                bapEl.innerHTML = ':root { --ui-primary: black; } .dark { --ui-primary: white; }';
              } else {
                bapEl.innerHTML = '';
              }
            }
          `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }, {
          innerHTML: [
            `(function() {`,
            `var SAFE = /^[\\w -]{1,50}$/;`,
            `function num(v, lo, hi) { var n = parseFloat(v); return isFinite(n) ? Math.min(hi, Math.max(lo, n)) : undefined; }`,
            `var fontRaw = localStorage.getItem('${storageKeys.font}') || 'Public Sans';`,
            `var font = SAFE.test(fontRaw) ? fontRaw : 'Public Sans';`,
            `var prefs = {};`,
            `try { prefs = JSON.parse(localStorage.getItem('${storageKeys.fontPrefs}') || '{}'); } catch(e) {}`,
            `var css = ':root { --font-sans: \\'' + font + '\\', sans-serif; }';`,
            `var w = prefs.weights || {};`,
            `var wVars = Object.keys(w).map(function(s) { var n = num(w[s], 100, 900); return (SAFE.test(s) && n !== undefined) ? '--font-weight-' + s + ': ' + n + ';' : ''; }).filter(Boolean).join(' ');`,
            `if (wVars) { css += ' :root { ' + wVars + ' }'; }`,
            `var bodyRules = '';`,
            `var wn = num(w.normal, 100, 900);`,
            `if (wn !== undefined) { bodyRules += 'font-weight: ' + wn + '; '; }`,
            `if (prefs.uppercase) { bodyRules += 'text-transform: uppercase; '; }`,
            `if (prefs.italic) { bodyRules += 'font-style: italic; '; }`,
            `var ls = num(prefs.letterSpacing, -0.2, 1);`,
            `if (ls !== undefined && ls !== 0) { bodyRules += 'letter-spacing: ' + ls + 'em; '; }`,
            `var lh = num(prefs.lineHeight, 0.8, 3);`,
            `if (lh !== undefined) { bodyRules += 'line-height: ' + lh + '; '; }`,
            `if (bodyRules) { css += ' body { ' + bodyRules + '}'; }`,
            `var h = prefs.heading || {};`,
            `var hFont = (h.font && SAFE.test(h.font)) ? h.font : undefined;`,
            `var hWeight = num(h.weight, 100, 900);`,
            `var hLs = num(h.letterSpacing, -0.2, 1);`,
            `var hLh = num(h.lineHeight, 0.8, 3);`,
            `if (hFont || hWeight !== undefined || h.uppercase || h.italic || h.underline || (hLs !== undefined && hLs !== 0) || hLh !== undefined) {`,
            `var rules = '';`,
            `if (hFont) { rules += 'font-family: \\'' + hFont + '\\', sans-serif; '; }`,
            `if (hWeight !== undefined) { rules += 'font-weight: ' + hWeight + '; '; }`,
            `if (h.uppercase) { rules += 'text-transform: uppercase; '; }`,
            `if (h.italic) { rules += 'font-style: italic; '; }`,
            `if (h.underline) { rules += 'text-decoration: underline; '; }`,
            `if (hLs !== undefined && hLs !== 0) { rules += 'letter-spacing: ' + hLs + 'em; '; }`,
            `if (hLh !== undefined) { rules += 'line-height: ' + hLh + '; '; }`,
            `css += ' h1, h2, h3, h4, h5, h6 { ' + rules + '}';`,
            `}`,
            `if (localStorage.getItem('${storageKeys.font}') || Object.keys(prefs).length) {`,
            `var fontEl = document.querySelector('style#nuxt-ui-font');`,
            `if (fontEl) { fontEl.textContent = css; }`,
            `}`,
            `[font, hFont].forEach(function(name) {`,
            `if (!name || name === 'Public Sans') return;`,
            `var id = 'font-' + name.toLowerCase().replace(/\\s+/g, '-');`,
            `if (document.getElementById(id)) return;`,
            `var lnk = document.createElement('link');`,
            `lnk.rel = 'stylesheet';`,
            `lnk.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(name) + ':wght@300;400;500;600;700;800&display=swap';`,
            `lnk.id = id;`,
            `document.head.appendChild(lnk);`,
            `});`,
            `})();`
          ].join(' ')
        }, {
          innerHTML: `
            (function() {
              var raw = localStorage.getItem('${storageKeys.customColors}');
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
                    var el = document.getElementById('nuxt-ui-custom-colors');
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
              var raw = localStorage.getItem('${storageKeys.cssVariables}');
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
                    var el = document.getElementById('nuxt-ui-css-variables');
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
