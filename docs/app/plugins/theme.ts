import { defu } from 'defu'
import { watchDebounced } from '@vueuse/core'
import { themeIcons } from '../utils/theme/icons'
import { cssVariableDefaults } from '../utils/theme/tokens'
import { THEME_STATE_KEYS, THEME_STORAGE_KEY, clamped, readStoredTheme, snapshotStoredTheme, writeStoredTheme } from '../utils/theme/storage'
import type { StoredTheme } from '../utils/theme/storage'
import { mergeUi, styleComponents, DEFAULT_COLORS, THEME_DEFAULTS } from '../utils/theme/engine/types'
import { SAFE_NAME, sanitizeCustomColors, sanitizeCSSVariables } from '../utils/theme/sanitize'

export default defineNuxtPlugin({
  enforce: 'post',
  setup() {
    const appConfig = useAppConfig()

    // Client only, see below; the server's copy is inert.
    let restoreStoredTheme = () => {}

    if (import.meta.client) {
      // Everything a stored theme touches, in one pass, with defaults for
      // absent fields so it also serves the cross-tab listener below (where
      // "absent" can mean "the other tab reset it"). At boot the deferred
      // bits ride onNuxtReady; on a storage event they run directly.
      //
      // Assign, never seed: at boot this runs before the root component's
      // setup but AFTER the SSR payload is hydrated, so every useState key
      // already holds the server's default and its initializer will not
      // re-run.
      let appliedUiKeys: string[] = []

      const distribute = (saved: StoredTheme, defer: (fn: () => void) => void) => {
        // Both end up interpolated into <style> text, and storage is writable
        // by anything on the origin, so they get the same clamp the FOUC
        // script (num) and applyThemeSettings already apply.
        useState('nuxt-ui-radius').value = clamped(saved.radius, 0, 4) ?? THEME_DEFAULTS.radius
        useState('nuxt-ui-font-size').value = clamped(saved.fontSize, 12, 20) ?? THEME_DEFAULTS.fontSize
        useState('nuxt-ui-font').value = saved.font ?? {}
        useState('nuxt-ui-icons').value = saved.icons ?? THEME_DEFAULTS.icons
        useState('nuxt-ui-black-as-primary').value = saved.blackAsPrimary ?? false
        // Through the same boundary the AI path uses: these two are
        // concatenated into <style> text, and storage is writable by anything
        // on the origin. (The inline FOUC script still paints the raw values
        // once, before the boot pass runs.)
        useState('nuxt-ui-custom-colors').value = sanitizeCustomColors(saved.customColors ?? {})
        useState('nuxt-ui-css-variables').value = saved.cssVariables ? sanitizeCSSVariables(saved.cssVariables) : {}
        useState(THEME_STATE_KEYS.stylePrefs).value = saved.style ?? {}
        useState(THEME_STATE_KEYS.paletteParams).value = saved.paletteParams ?? {}
        useState(THEME_STATE_KEYS.themePreset).value = saved.preset
        useState<Record<string, any>>('nuxt-ui-ai-theme').value = {
          ...(saved.colors ? { colors: { ...saved.colors } } : {}),
          ...(saved.components ? { ui: { ...saved.components } } : {})
        }

        // Same distribution order the per-key restores used, which carries
        // two fixes worth keeping. Colors land now, before hydration, because
        // the FOUC script already rewrote the style tags before first paint.
        // Icons land deferred: icon names compile into element CLASSES and
        // Vue only warns about a class that disagrees with the server, it
        // never patches it, so assigning pre-hydration silently dropped the
        // saved pack every reload. Same SAFE_NAME gate the live path
        // (applyThemeSettings) enforces: these names end up dereferenced
        // inside <style> text.
        for (const alias of Object.keys(DEFAULT_COLORS) as Array<keyof typeof DEFAULT_COLORS>) {
          const value = alias === 'primary' ? saved.primary : alias === 'neutral' ? saved.neutral : saved.colors?.[alias]
          ;(appConfig.ui.colors as any)[alias] = typeof value === 'string' && SAFE_NAME.test(value) ? value : DEFAULT_COLORS[alias]
        }

        const pack = saved.icons && Object.hasOwn(themeIcons, saved.icons) ? themeIcons[saved.icons as keyof typeof themeIcons] : themeIcons.lucide
        defer(() => (appConfig.ui.icons = pack as any))

        // The class bundle is DERIVED from the style prefs, so it is rebuilt
        // here rather than stored. A generator change therefore reaches
        // already-saved themes instead of serving a frozen bundle. Guarded
        // like the studio's own rebuild: a corrupt persisted style must not
        // take the whole plugin down before the persistence watcher even
        // registers.
        let styleUi: Record<string, any> = {}
        try {
          styleUi = saved.style ? styleComponents(saved.style) : {}
        } catch {
          // ignored: the theme still restores, minus the style bundle
        }
        useState<Record<string, any>>('nuxt-ui-style-ui').value = styleUi
        defer(() => {
          // same order as the live path: style bundle first, explicit wins;
          // keys a previous distribution touched but this one doesn't reset
          const merged = mergeUi(styleUi, saved.components || {})
          for (const key of appliedUiKeys) {
            if (!(key in merged)) (appConfig.ui as any)[key] = undefined
          }
          for (const [key, value] of Object.entries(merged)) {
            if (key === 'colors' || key === 'icons') continue
            (appConfig.ui as any)[key] = defu(value as Record<string, any>, (appConfig.ui as any)[key] || {})
          }
          appliedUiKeys = Object.keys(merged).filter(key => key !== 'colors' && key !== 'icons')
        })
      }

      // A shared theme link (/theme?doc=, see pages/theme.vue) renders
      // server-side in its own theme; restoring the stored one here would
      // paint over it between SSR and hydration. The page applies the link
      // instead and stores it, or calls the restore back when the payload
      // turns out not to be a theme.
      restoreStoredTheme = () => distribute(readStoredTheme(), onNuxtReady)
      const linked = /^\/theme\/?$/.test(window.location.pathname) && /[?&]doc=/.test(window.location.search)
      if (!linked) {
        restoreStoredTheme()
      }

      // Another tab wrote the theme: adopt it, or this tab's next debounced
      // write would clobber it with stale state (the single key is atomic
      // per write, not across tabs).
      window.addEventListener('storage', (event) => {
        if (event.key !== null && event.key !== THEME_STORAGE_KEY) return
        distribute(readStoredTheme(), fn => fn())
      })

      // One watcher owns every write. Each setting used to persist itself, so
      // a reload could restore them out of step and the derived stores needed
      // self-heals to reconcile; one atomic write makes that impossible.
      // Debounced: the getter still runs per flush, but a slider drag no
      // longer costs a synchronous localStorage write per frame.
      watchDebounced(() => JSON.stringify(snapshotStoredTheme()), json => writeStoredTheme(JSON.parse(json)), { debounce: 250, flush: 'post' })
    }

    if (import.meta.server) {
      // One FOUC script over the one storage key. Every setting used to ship
      // its own inline script re-reading its own key, eight of them, each
      // duplicating a slice of useTheme's reactive style tags. This still
      // duplicates the derivations (it has to run before paint, before any
      // Vue code exists) but it parses once and writes every tag in order.
      // It stands down on a theme link, like the boot restore above: the
      // server already rendered the linked theme.
      useHead({
        script: [{
          innerHTML: `
            (function() {
              if (/^\\/theme\\/?$/.test(location.pathname) && /[?&]doc=/.test(location.search)) { return; }
              var T = {};
              try { T = JSON.parse(localStorage.getItem('nuxt-ui-theme') || '{}') || {}; } catch (e) { return; }
              var SAFE = /^[\\w -]{1,50}$/;
              function num(v, lo, hi) { var n = parseFloat(v); return isFinite(n) ? Math.min(hi, Math.max(lo, n)) : undefined; }
              function set(id, css) { var el = document.getElementById(id); if (el) { el.textContent = css; } }

              var primaryColor = SAFE.test(T.primary || '') ? T.primary : undefined;
              var neutralColor = SAFE.test(T.neutral || '') ? T.neutral : undefined;
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


              set('nuxt-ui-black-as-primary', T.blackAsPrimary ? ':root { --ui-primary: black; } .dark { --ui-primary: white; }' : '');

              var prefs = T.font || {};
              var font = (prefs.sans && SAFE.test(prefs.sans)) ? prefs.sans : 'Public Sans';
              var css = ':root { --font-sans: \\'' + font + '\\', sans-serif; }';
              var serif = (prefs.serif && SAFE.test(prefs.serif)) ? prefs.serif : undefined;
              var mono = (prefs.mono && SAFE.test(prefs.mono)) ? prefs.mono : undefined;
              if (serif) { css += ' :root { --font-serif: \\'' + serif + '\\', serif; }'; }
              if (mono) { css += ' :root { --font-mono: \\'' + mono + '\\', monospace; }'; }
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
              if (Object.keys(prefs).length) { set('nuxt-ui-font', css); }
              [font, serif, mono].forEach(function(name) {
                if (!name || name === 'Public Sans') return;
                var id = 'font-' + name.toLowerCase().replace(/\\s+/g, '-');
                if (document.getElementById(id)) return;
                var lnk = document.createElement('link');
                lnk.rel = 'stylesheet';
                lnk.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(name) + ':wght@300;400;500;600;700;800&display=swap';
                lnk.id = id;
                document.head.appendChild(lnk);
              });

              var BREAKOUT = /[;{}<>]/;
              var SHADE = /^\\d{2,3}$/;
              var VAR_KEY = /^--[\\w-]+$/;
              var custom = T.customColors;
              if (custom) {
                var vars = [];
                for (var name in custom) {
                  if (!SAFE.test(name)) continue;
                  for (var shade in custom[name]) { if (SHADE.test(shade) && !BREAKOUT.test(String(custom[name][shade]))) { vars.push('--color-' + name + '-' + shade + ': ' + custom[name][shade] + ';'); } }
                }
                if (vars.length) { set('nuxt-ui-custom-colors', ':root { ' + vars.join(' ') + ' }'); }
              }

              var cssVars = T.cssVariables;
              if (cssVars) {
                var defaults = ${JSON.stringify(cssVariableDefaults)};
                var merge = function(defs, overrides) {
                  var result = [];
                  var safe = function(v) { return v != null && !BREAKOUT.test(String(v)); };
                  for (var key in defs) { result.push(key + ': ' + (safe(overrides[key]) ? overrides[key] : defs[key]) + ';'); }
                  for (var key2 in overrides) { if (!defs[key2] && VAR_KEY.test(key2) && safe(overrides[key2])) result.push(key2 + ': ' + overrides[key2] + ';'); }
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

    return {
      provide: { restoreStoredTheme }
    }
  }
})
