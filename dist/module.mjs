import { defu } from 'defu';
import { defineNuxtModule, createResolver, addPlugin, hasNuxtModule, addComponentsDir, addImportsDir, addImports } from '@nuxt/kit';
import { d as defaultOptions, r as resolveColors, a as getDefaultConfig, p as publicComposables, b as addTemplates } from './shared/ui.DN1xpmfD.mjs';
import '../dist/runtime/utils/index.js';
import 'node:url';
import 'scule';
import 'knitwork';
import 'tailwindcss/colors';
import 'node:fs/promises';
import 'pathe';
import 'tinyglobby';

const name = "@nuxt/ui";
const version = "4.6.1";

const module$1 = defineNuxtModule({
  meta: {
    name,
    version,
    docs: "https://ui.nuxt.com/docs/getting-started/installation/nuxt",
    configKey: "ui",
    compatibility: {
      nuxt: ">=4.1.0"
    }
  },
  defaults: defaultOptions,
  moduleDependencies(nuxt) {
    const userUiOptions = nuxt.options.ui || {};
    return {
      "@nuxt/icon": {
        defaults: {
          cssLayer: "base"
        }
      },
      ...userUiOptions.fonts !== false && {
        "@nuxt/fonts": {
          defaults: {
            defaults: {
              weights: [400, 500, 600, 700]
            }
          }
        }
      },
      ...userUiOptions.colorMode !== false && {
        "@nuxtjs/color-mode": {
          defaults: {
            classSuffix: "",
            disableTransition: true
          }
        }
      },
      "@nuxtjs/mdc": {
        optional: !userUiOptions.mdc && !userUiOptions.content,
        defaults: {
          highlight: {
            theme: {
              light: "material-theme-lighter",
              default: "material-theme",
              dark: "material-theme-palenight"
            }
          },
          components: {
            map: {
              "accordion": "ProseAccordion",
              "accordion-item": "ProseAccordionItem",
              "badge": "ProseBadge",
              "callout": "ProseCallout",
              "card": "ProseCard",
              "card-group": "ProseCardGroup",
              "caution": "ProseCaution",
              "code-collapse": "ProseCodeCollapse",
              "code-group": "ProseCodeGroup",
              "code-icon": "ProseCodeIcon",
              "code-preview": "ProseCodePreview",
              "code-tree": "ProseCodeTree",
              "collapsible": "ProseCollapsible",
              "field": "ProseField",
              "field-group": "ProseFieldGroup",
              "icon": "ProseIcon",
              "kbd": "ProseKbd",
              "note": "ProseNote",
              "prompt": "ProsePrompt",
              "steps": "ProseSteps",
              "tabs": "ProseTabs",
              "tabs-item": "ProseTabsItem",
              "tip": "ProseTip",
              "warning": "ProseWarning"
            }
          }
        }
      }
    };
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    options.theme = options.theme || {};
    options.theme.colors = resolveColors(options.theme.colors);
    nuxt.options.ui = options;
    nuxt.options.alias["#ui"] = resolve("./runtime");
    nuxt.options.appConfig.ui = defu(nuxt.options.appConfig.ui || {}, getDefaultConfig(options.theme));
    nuxt.options.build.transpile.push("reka-ui");
    nuxt.options.app.rootAttrs = nuxt.options.app.rootAttrs || {};
    nuxt.options.app.rootAttrs.class = [nuxt.options.app.rootAttrs.class, `${options.theme?.prefix ? options.theme.prefix + ":" : ""}isolate`].filter(Boolean).join(" ");
    nuxt.hook("vite:extend", async ({ config }) => {
      const plugin = await import('@tailwindcss/vite').then((r) => r.default);
      config.plugins ||= [];
      config.plugins.push(plugin());
    });
    if (nuxt.options.builder !== "@nuxt/vite-builder") {
      nuxt.options.postcss.plugins["@tailwindcss/postcss"] = {};
    }
    addPlugin({ src: resolve("./runtime/plugins/colors") });
    if (options.prose || options.mdc || options.content || hasNuxtModule("@nuxtjs/mdc") || hasNuxtModule("@nuxt/content")) {
      addComponentsDir({
        path: resolve("./runtime/components/prose"),
        pathPrefix: false,
        prefix: "Prose",
        global: true
      });
    }
    if (options.content || hasNuxtModule("@nuxt/content")) {
      addComponentsDir({
        path: resolve("./runtime/components/content"),
        pathPrefix: false,
        prefix: options.prefix
      });
    }
    if (options.colorMode || hasNuxtModule("@nuxtjs/color-mode")) {
      addComponentsDir({
        path: resolve("./runtime/components/color-mode"),
        pathPrefix: false,
        prefix: options.prefix
      });
    } else {
      addImportsDir(resolve("./runtime/composables/color-mode"));
    }
    addComponentsDir({
      path: resolve("./runtime/components"),
      pathPrefix: false,
      prefix: options.prefix,
      ignore: ["color-mode/**", "content/**", "prose/**"]
    });
    addImports(
      Object.entries(publicComposables).flatMap(
        ([file, exports$1]) => exports$1.map((name2) => ({ name: name2, from: resolve(`./runtime/composables/${file}`) }))
      )
    );
    addTemplates(options, nuxt, resolve);
  }
});

export { module$1 as default };
