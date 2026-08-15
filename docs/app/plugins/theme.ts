import { defu } from 'defu'
import { themeIcons } from '../utils/theme/icons'
import { cssVariableDefaults } from '../utils/theme/tokens'
import { THEME_STATE_KEYS, readStoredTheme, writeStoredTheme } from '../utils/theme/storage'
import type { StoredTheme } from '../utils/theme/storage'
import { mergeUi, styleComponents, DEFAULT_COLORS, THEME_DEFAULTS } from '../utils/theme/engine'

export default defineNuxtPlugin({
  enforce: 'post',
  setup() {
    const appConfig = useAppConfig()

    if (import.meta.client) {
      const saved = readStoredTheme()

      // Assign, never seed. This plugin runs before the root component's
      // setup, but AFTER the SSR payload is hydrated, so every useState key
      // below already holds the server's default and its initializer will
      // not re-run. Writing the values here is what makes a saved theme
      // survive a reload.
      const assign = <T>(key: string, value: T | undefined) => {
        if (value !== undefined) useState<T>(key).value = value
      }
      assign('nuxt-ui-radius', saved.radius)
      assign('nuxt-ui-font-size', saved.fontSize)
      assign('nuxt-ui-spacing', saved.spacing)
      assign('nuxt-ui-font', saved.font)
      assign('nuxt-ui-icons', saved.icons)
      assign('nuxt-ui-black-as-primary', saved.blackAsPrimary)
      assign('nuxt-ui-font-prefs', saved.fontPrefs)
      assign('nuxt-ui-custom-colors', saved.customColors)
      assign('nuxt-ui-css-variables', saved.cssVariables)
      assign(THEME_STATE_KEYS.stylePrefs, saved.style)
      assign(THEME_STATE_KEYS.paletteParams, saved.paletteParams)
      assign(THEME_STATE_KEYS.themePreset, saved.preset)
      if (saved.colors || saved.components) {
        useState<Record<string, any>>('nuxt-ui-ai-theme').value = {
          ...(saved.colors ? { colors: { ...saved.colors } } : {}),
          ...(saved.components ? { ui: { ...saved.components } } : {})
        }
      }

      // Same distribution order the per-key restores used, which carries two
      // fixes worth keeping. Colors land now, before hydration, because their
      // FOUC scripts already rewrote the style tags before first paint. Icons
      // land AFTER: icon names compile into element CLASSES and Vue only warns
      // about a class that disagrees with the server, it never patches it, so
      // assigning pre-hydration silently dropped the saved pack every reload.
      if (saved.primary) appConfig.ui.colors.primary = saved.primary
      if (saved.neutral) appConfig.ui.colors.neutral = saved.neutral
      for (const [alias, name] of Object.entries(saved.colors || {})) {
        (appConfig.ui.colors as any)[alias] = name
      }

      const pack = saved.icons ? themeIcons[saved.icons as keyof typeof themeIcons] : undefined
      if (pack) onNuxtReady(() => (appConfig.ui.icons = pack as any))

      // The class bundle is DERIVED from the style prefs, so it is rebuilt
      // here rather than stored. A generator change therefore reaches
      // already-saved themes instead of serving a frozen bundle.
      const styleUi = saved.style ? styleComponents(saved.style) : {}
      if (Object.keys(styleUi).length || saved.components) {
        useState<Record<string, any>>('nuxt-ui-style-ui').value = styleUi
        onNuxtReady(() => {
          // same order as the live path: style bundle first, explicit wins
          const merged = mergeUi(styleUi, saved.components || {})
          for (const [key, value] of Object.entries(merged)) {
            if (key === 'colors' || key === 'icons') continue
            (appConfig.ui as any)[key] = defu(value as Record<string, any>, (appConfig.ui as any)[key] || {})
          }
        })
      }

      // Keeps the shadow root flags in lockstep on every path. The FOUC
      // script only ever ADDS them, and applyDoc (presets, undo/redo,
      // shuffle) bypasses setStyle, so without this a flag set on load never
      // clears and a live Shadow change never activates the ramp.
      const stylePrefs = useState<{ shadow?: string }>(THEME_STATE_KEYS.stylePrefs)
      watch(() => stylePrefs.value?.shadow, (shadow) => {
        const flags = document.documentElement.classList
        flags.toggle('shadow-custom', shadow === 'custom')
        flags.toggle('shadow-none', shadow === 'flat')
      }, { immediate: true })

      // One watcher owns every write. Each setting used to persist itself, so
      // a reload could restore them out of step and the derived stores needed
      // self-heals to reconcile; one atomic write makes that impossible.
      //
      // Reads the raw state refs rather than `currentDoc()`: the doc is diffed
      // against a stock library install on every call, which is far too much
      // work for a watcher that fires on every slider frame, and calling
      // `useTheme()` outside a component would fire its onMounted with no
      // instance. Defaults are omitted so an untouched theme stores nothing.
      const radius = useState<number>('nuxt-ui-radius')
      const fontSize = useState<number>('nuxt-ui-font-size')
      const spacing = useState<number>('nuxt-ui-spacing')
      const font = useState<string>('nuxt-ui-font')
      const iconSet = useState<string>('nuxt-ui-icons')
      const blackAsPrimary = useState<boolean>('nuxt-ui-black-as-primary')
      const fontPrefs = useState<StoredTheme['fontPrefs']>('nuxt-ui-font-prefs')
      const style = useState<StoredTheme['style']>(THEME_STATE_KEYS.stylePrefs)
      const paletteParams = useState<StoredTheme['paletteParams']>(THEME_STATE_KEYS.paletteParams)
      const preset = useState<string | undefined>(THEME_STATE_KEYS.themePreset)
      const extras = useState<Record<string, any>>('nuxt-ui-ai-theme')
      const customColors = useState<StoredTheme['customColors']>('nuxt-ui-custom-colors')
      const cssVariables = useState<StoredTheme['cssVariables']>('nuxt-ui-css-variables')

      const filled = <T extends object>(value: T | undefined) => value && Object.keys(value).length ? value : undefined
      const unless = <T>(value: T, fallback: T) => value === fallback ? undefined : value

      watch(() => JSON.stringify({
        primary: unless(appConfig.ui.colors.primary, DEFAULT_COLORS.primary),
        neutral: unless(appConfig.ui.colors.neutral, DEFAULT_COLORS.neutral),
        radius: unless(radius.value, THEME_DEFAULTS.radius),
        fontSize: unless(fontSize.value, THEME_DEFAULTS.fontSize),
        spacing: unless(spacing.value, THEME_DEFAULTS.spacing),
        font: unless(font.value, THEME_DEFAULTS.font),
        icons: unless(iconSet.value, THEME_DEFAULTS.icons),
        blackAsPrimary: blackAsPrimary.value || undefined,
        fontPrefs: filled(fontPrefs.value),
        colors: filled(extras.value?.colors),
        components: filled(extras.value?.ui),
        customColors: filled(customColors.value),
        cssVariables: filled(cssVariables.value?.light) || filled(cssVariables.value?.dark) ? cssVariables.value : undefined,
        style: filled(style.value),
        paletteParams: filled(paletteParams.value),
        preset: preset.value
      } satisfies StoredTheme), json => writeStoredTheme(JSON.parse(json)), { flush: 'post' })
    }

    if (import.meta.server) {
      // One FOUC script over the one storage key. Every setting used to ship
      // its own inline script re-reading its own key, eight of them, each
      // duplicating a slice of useTheme's reactive style tags. This still
      // duplicates the derivations (it has to run before paint, before any
      // Vue code exists) but it parses once and writes every tag in order.
      useHead({
        script: [{
          innerHTML: `
            (function() {
              var T = {};
              try { T = JSON.parse(localStorage.getItem('nuxt-ui-theme') || '{}') || {}; } catch (e) { return; }
              var SAFE = /^[\\w -]{1,50}$/;
              function num(v, lo, hi) { var n = parseFloat(v); return isFinite(n) ? Math.min(hi, Math.max(lo, n)) : undefined; }
              function set(id, css) { var el = document.getElementById(id); if (el) { el.textContent = css; } }

              var primaryColor = T.primary;
              var neutralColor = T.neutral;
              if (primaryColor || neutralColor) {
                var swapColors = function(el) {
                  var html = el.innerHTML;
                  if (primaryColor && primaryColor !== 'black') {
                    html = html.replace(/(--ui-color-primary-\\d{2,3}:\\s*var\\(--color-)${appConfig.ui.colors.primary}(-\\d{2,3}.*?\\))/g, '$1' + primaryColor + '$2');
                  }
                  if (neutralColor) {
                    html = html.replace(/(--ui-color-neutral-\\d{2,3}:\\s*var\\(--color-)${appConfig.ui.colors.neutral}(-\\d{2,3}.*?\\))/g, '$1' + (neutralColor === 'neutral' ? 'old-neutral' : neutralColor) + '$2');
                  }
                  el.innerHTML = html;
                };
                var colorsEl = document.querySelector('style#nuxt-ui-colors');
                if (colorsEl) { swapColors(colorsEl); }
                else {
                  var obs = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      for (var j = 0; j < mutations[i].addedNodes.length; j++) {
                        var node = mutations[i].addedNodes[j];
                        if (node.id === 'nuxt-ui-colors') { swapColors(node); obs.disconnect(); return; }
                      }
                    }
                  });
                  obs.observe(document.head, { childList: true });
                }
              }

              var radius = num(T.radius, 0, 4);
              if (radius !== undefined) { set('nuxt-ui-radius', ':root { --ui-radius: ' + radius + 'rem; }'); }

              var fontSize = num(T.fontSize, 12, 20);
              if (fontSize !== undefined && fontSize !== 16) { set('nuxt-ui-font-size', 'html { font-size: ' + fontSize + 'px; }'); }

              var spacing = num(T.spacing, 0.125, 0.5);
              if (spacing !== undefined && spacing !== 0.25) { set('nuxt-ui-spacing', ':root { --spacing: ' + spacing + 'rem; }'); }

              set('nuxt-ui-black-as-primary', T.blackAsPrimary ? ':root { --ui-primary: black; } .dark { --ui-primary: white; }' : '');

              var shadow = T.style && T.style.shadow;
              if (shadow === 'custom') { document.documentElement.classList.add('shadow-custom'); }
              else if (shadow === 'flat') { document.documentElement.classList.add('shadow-none'); }

              var fontRaw = T.font || 'Public Sans';
              var font = SAFE.test(fontRaw) ? fontRaw : 'Public Sans';
              var prefs = T.fontPrefs || {};
              var css = ':root { --font-sans: \\'' + font + '\\', sans-serif; }';
              var w = prefs.weights || {};
              var wVars = Object.keys(w).map(function(step) { var n = num(w[step], 100, 900); return (SAFE.test(step) && n !== undefined) ? '--font-weight-' + step + ': ' + n + ';' : ''; }).filter(Boolean).join(' ');
              if (wVars) { css += ' :root { ' + wVars + ' }'; }
              var bodyRules = '';
              var wn = num(w.normal, 100, 900);
              if (wn !== undefined) { bodyRules += 'font-weight: ' + wn + '; '; }
              if (prefs.uppercase) { bodyRules += 'text-transform: uppercase; '; }
              if (prefs.italic) { bodyRules += 'font-style: italic; '; }
              var ls = num(prefs.letterSpacing, -0.2, 1);
              if (ls !== undefined && ls !== 0) { bodyRules += 'letter-spacing: ' + ls + 'em; '; }
              var lh = num(prefs.lineHeight, 0.8, 3);
              if (lh !== undefined) { bodyRules += 'line-height: ' + lh + '; '; }
              if (bodyRules) { css += ' body { ' + bodyRules + '}'; }
              var h = prefs.heading || {};
              var hFont = (h.font && SAFE.test(h.font)) ? h.font : undefined;
              var hWeight = num(h.weight, 100, 900);
              var hLs = num(h.letterSpacing, -0.2, 1);
              var hLh = num(h.lineHeight, 0.8, 3);
              if (hFont || hWeight !== undefined || h.uppercase || h.italic || h.underline || (hLs !== undefined && hLs !== 0) || hLh !== undefined) {
                var rules = '';
                if (hFont) { rules += 'font-family: \\'' + hFont + '\\', sans-serif; '; }
                if (hWeight !== undefined) { rules += 'font-weight: ' + hWeight + '; '; }
                if (h.uppercase) { rules += 'text-transform: uppercase; '; }
                if (h.italic) { rules += 'font-style: italic; '; }
                if (h.underline) { rules += 'text-decoration: underline; '; }
                if (hLs !== undefined && hLs !== 0) { rules += 'letter-spacing: ' + hLs + 'em; '; }
                if (hLh !== undefined) { rules += 'line-height: ' + hLh + '; '; }
                css += ' h1, h2, h3, h4, h5, h6 { ' + rules + '}';
              }
              if (T.font || Object.keys(prefs).length) { set('nuxt-ui-font', css); }
              [font, hFont].forEach(function(name) {
                if (!name || name === 'Public Sans') return;
                var id = 'font-' + name.toLowerCase().replace(/\\s+/g, '-');
                if (document.getElementById(id)) return;
                var lnk = document.createElement('link');
                lnk.rel = 'stylesheet';
                lnk.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(name) + ':wght@300;400;500;600;700;800&display=swap';
                lnk.id = id;
                document.head.appendChild(lnk);
              });

              var custom = T.customColors;
              if (custom) {
                var vars = [];
                for (var name in custom) {
                  for (var shade in custom[name]) { vars.push('--color-' + name + '-' + shade + ': ' + custom[name][shade] + ';'); }
                }
                if (vars.length) { set('nuxt-ui-custom-colors', ':root { ' + vars.join(' ') + ' }'); }
              }

              var cssVars = T.cssVariables;
              if (cssVars) {
                var defaults = ${JSON.stringify(cssVariableDefaults)};
                var merge = function(defs, overrides) {
                  var result = [];
                  for (var key in defs) { result.push(key + ': ' + (overrides[key] || defs[key]) + ';'); }
                  for (var key2 in overrides) { if (!defs[key2]) result.push(key2 + ': ' + overrides[key2] + ';'); }
                  return result;
                };
                var parts = [];
                if (cssVars.light && Object.keys(cssVars.light).length) { parts.push('.light { ' + merge(defaults.light, cssVars.light).join(' ') + ' }'); }
                if (cssVars.dark && Object.keys(cssVars.dark).length) { parts.push('.dark { ' + merge(defaults.dark, cssVars.dark).join(' ') + ' }'); }
                if (parts.length) { set('nuxt-ui-css-variables', parts.join(' ')); }
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
