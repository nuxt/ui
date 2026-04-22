import { fileURLToPath } from 'node:url';
import { join, normalize } from 'pathe';
import { createUnplugin } from 'unplugin';
import { defu } from 'defu';
import tailwind from '@tailwindcss/vite';
import { g as getTemplates, p as publicComposables, d as defaultOptions, r as resolveColors, a as getDefaultConfig } from './shared/ui.DN1xpmfD.mjs';
import fs from 'node:fs';
import path from 'node:path';
import MagicString from 'magic-string';
import { genSafeVariableName } from 'knitwork';
import { resolvePathSync } from 'mlly';
import { globSync } from 'tinyglobby';
import AutoImportComponents from 'unplugin-vue-components';
import AutoImport from 'unplugin-auto-import';
import '../dist/runtime/utils/index.js';
import 'scule';
import 'tailwindcss/colors';
import '@nuxt/kit';
import 'node:fs/promises';

function TemplatePlugin(options, appConfig) {
  const templates = getTemplates(options, appConfig.ui);
  const templateKeys = new Set(templates.map((t) => `#build/${t.filename}`));
  async function writeTemplates(root) {
    const map = {};
    const dir = path.join(root, "node_modules", ".nuxt-ui");
    for (const template of templates) {
      if (!template.write || !template.filename) {
        continue;
      }
      const filePath = path.join(dir, template.filename);
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }
      fs.writeFileSync(filePath, await template.getContents({}));
      map[`#build/${template.filename}`] = filePath;
    }
    return map;
  }
  return {
    name: "nuxt:ui:templates",
    enforce: "pre",
    vite: {
      async config(config) {
        const alias = await writeTemplates(config.root || process.cwd());
        return {
          resolve: {
            alias
          }
        };
      }
    },
    resolveId(id) {
      if (templateKeys.has(id + ".ts")) {
        return id.replace("#build/", "virtual:nuxt-ui-templates/") + ".ts";
      }
    },
    loadInclude: (id) => templateKeys.has(id.replace("virtual:nuxt-ui-templates/", "#build/")),
    load(id) {
      id = id.replace("virtual:nuxt-ui-templates/", "#build/");
      return templates.find((t) => `#build/${t.filename}` === id).getContents({});
    }
  };
}

function PluginsPlugin(options) {
  const plugins = globSync(["**/*", "!*.d.ts"], { cwd: join(runtimeDir, "plugins"), absolute: true });
  plugins.unshift(resolvePathSync("../runtime/vue/plugins/router", { extensions: [".ts", ".mjs", ".js"], url: import.meta.url }));
  plugins.unshift(resolvePathSync("../runtime/vue/plugins/head", { extensions: [".ts", ".mjs", ".js"], url: import.meta.url }));
  if (options.colorMode) {
    plugins.push(resolvePathSync("../runtime/vue/plugins/color-mode", { extensions: [".ts", ".mjs", ".js"], url: import.meta.url }));
  }
  const proseComponents = options.prose || options.mdc ? globSync(["**/*.vue"], { cwd: join(runtimeDir, "components/prose"), absolute: true }) : [];
  return {
    name: "nuxt:ui:plugins",
    enforce: "pre",
    resolveId(id) {
      if (id === "@nuxt/ui/vue-plugin") {
        return "virtual:nuxt-ui-plugins";
      }
    },
    transform(code, id) {
      if (plugins.some((p) => id.startsWith(p)) && code.includes("import.meta.client")) {
        const s = new MagicString(code);
        s.replaceAll("import.meta.client", "true");
        if (s.hasChanged()) {
          return {
            code: s.toString(),
            map: s.generateMap({ hires: true })
          };
        }
      }
    },
    loadInclude: (id) => id === "virtual:nuxt-ui-plugins",
    load() {
      const proseImports = proseComponents.map((p) => {
        const name = `Prose${p.split("/").pop()?.replace(/\.vue$/, "")}`;
        return { name, path: p };
      });
      return `
        ${plugins.map((p) => `import ${genSafeVariableName(p)} from "${p}"`).join("\n")}
        ${proseImports.map((c) => `import ${c.name} from "${c.path}"`).join("\n")}

export default {
  install (app, pluginOptions = {}) {
${plugins.map((p) => `    app.use(${genSafeVariableName(p)}, pluginOptions)`).join("\n")}
${proseImports.map((c) => `    app.component('${c.name}', ${c.name})`).join("\n")}
  }
}
        `;
    },
    // Argument Vite specific configuration
    vite: {
      config() {
        return {
          // Opt-out Nuxt UI from Vite's pre-bundling,
          // as we need Vite's pipeline to resolve imports like `#imports`
          optimizeDeps: {
            exclude: ["@nuxt/ui"]
          }
        };
      }
    }
  };
}

function AppConfigPlugin(_options, appConfig) {
  return {
    name: "nuxt:ui:app-config",
    enforce: "pre",
    resolveId(id) {
      if (id === "#build/app.config") {
        return "virtual:nuxt-ui-app-config";
      }
    },
    loadInclude: (id) => id === "virtual:nuxt-ui-app-config",
    load() {
      return `
          export default ${JSON.stringify(appConfig)}
        `;
    },
    vite: {
      config() {
        return {
          test: {
            server: {
              deps: {
                inline: ["@nuxt/ui"]
              }
            }
          }
        };
      }
    }
  };
}

function resolveRouterMode(options) {
  if (options.router === false) {
    return "none";
  }
  if (options.router === "inertia") {
    return "inertia";
  }
  if (options.router === void 0 && options.inertia === true) {
    return "inertia";
  }
  return "vue-router";
}

function createComponentSource(cwd, prefix, ignore = []) {
  const files = globSync("**/*.vue", { cwd, ignore: ignore.filter(Boolean) });
  const names = new Set(files.map((c) => `${prefix}${c.split("/").pop()?.replace(/\.vue$/, "")}`));
  const paths = new Map(files.map((c) => {
    const componentName = `${prefix}${c.split("/").pop()?.replace(/\.vue$/, "")}`;
    return [componentName, c];
  }));
  return {
    has: (name) => names.has(name),
    resolve: (componentName) => {
      const relativePath = paths.get(componentName);
      if (!relativePath) return;
      return { name: "default", from: join(cwd, relativePath) };
    },
    resolveFile: (filename) => {
      const componentName = `${prefix}${filename}`;
      const relativePath = paths.get(componentName);
      if (!relativePath) return;
      return join(cwd, relativePath);
    }
  };
}
function ComponentImportPlugin(options, meta) {
  const colorModeIgnore = !options.colorMode ? ["color-mode/**/*.vue"] : [];
  const routerMode = resolveRouterMode(options);
  const routerOverrides = {
    "vue-router": createComponentSource(join(runtimeDir, "vue/overrides/vue-router"), options.prefix),
    "inertia": createComponentSource(join(runtimeDir, "vue/overrides/inertia"), options.prefix),
    "none": createComponentSource(join(runtimeDir, "vue/overrides/none"), options.prefix)
  };
  const unpluginComponents = createComponentSource(
    join(runtimeDir, "vue/components"),
    options.prefix,
    colorModeIgnore
  );
  const overrideSources = [routerOverrides[routerMode], unpluginComponents].filter((s) => !!s);
  const internalResolverPlugin = {
    /**
     * This plugin aims to ensure we override certain components with Vue-compatible versions:
     * <UIcon> and <ULink> currently.
     */
    name: "nuxt:ui:components",
    enforce: "pre",
    resolveId(id, importer) {
      if (!importer || !normalize(importer).includes(runtimeDir)) {
        return;
      }
      if (!RELATIVE_IMPORT_RE.test(id)) {
        return;
      }
      const filename = id.match(/([^/]+)\.vue$/)?.[1];
      if (filename) {
        for (const source of overrideSources) {
          const resolved = source.resolveFile(filename);
          if (resolved) return resolved;
        }
      }
    }
  };
  if (options.components === false) {
    return [internalResolverPlugin];
  }
  const defaultComponents = createComponentSource(
    join(runtimeDir, "components"),
    options.prefix,
    [...colorModeIgnore, "content/*.vue", "prose/**/*.vue"]
  );
  const proseComponents = options.prose || options.mdc ? createComponentSource(join(runtimeDir, "components/prose"), "Prose") : void 0;
  const allSources = [routerOverrides[routerMode], unpluginComponents, defaultComponents, proseComponents];
  const filteredSources = allSources.filter((s) => !!s);
  const packagesToScan = [
    "@nuxt/ui",
    "@compodium/examples",
    ...Array.isArray(options.scanPackages) ? options.scanPackages : []
  ];
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const packagesRegex = packagesToScan.map(escapeRegex).join("|");
  const excludeRegex = new RegExp(`[\\\\/]node_modules[\\\\/](?!\\.pnpm|${packagesRegex})`);
  const pluginOptions = defu(options.components, {
    dts: options.dts ?? true,
    exclude: [
      excludeRegex,
      /[\\/]\.git[\\/]/,
      /[\\/]\.nuxt[\\/]/
    ],
    resolvers: [
      (componentName) => {
        for (const source of filteredSources) {
          const resolved = source.resolve(componentName);
          if (resolved) return resolved;
        }
      }
    ]
  });
  return [
    internalResolverPlugin,
    AutoImportComponents.raw(pluginOptions, meta)
  ];
}
const RELATIVE_IMPORT_RE = /^\.{1,2}\//;

function NuxtEnvironmentPlugin(options) {
  const routerMode = resolveRouterMode(options);
  const stubsPath = `../runtime/vue/stubs/${routerMode}`;
  const stubPath = resolvePathSync(stubsPath, { extensions: [".ts", ".mjs", ".js"], url: import.meta.url });
  return {
    name: "nuxt:ui",
    enforce: "pre",
    resolveId(id) {
      if (id === "#imports") {
        return stubPath;
      }
    },
    transformInclude(id) {
      return normalize(id).includes(runtimeDir);
    },
    transform(code) {
      if (code.includes("import.meta.client")) {
        const s = new MagicString(code);
        s.replaceAll("import.meta.client", "true");
        if (s.hasChanged()) {
          return {
            code: s.toString(),
            map: s.generateMap({ hires: true })
          };
        }
      }
    }
  };
}

function AutoImportPlugin(options, meta) {
  if (options.autoImport === false) {
    return { name: "nuxt:ui:auto-import" };
  }
  const pluginOptions = defu(options.autoImport, {
    dts: options.dts ?? true,
    imports: [
      ...Object.entries(publicComposables).map(([file, names]) => ({
        from: join(runtimeDir, "composables", file),
        imports: names
      }))
    ],
    dirs: [join(runtimeDir, "vue/composables")]
  });
  return AutoImport.raw(pluginOptions, meta);
}

const runtimeDir = normalize(fileURLToPath(new URL("./runtime", import.meta.url)));
const NuxtUIPlugin = createUnplugin((_options = {}, meta) => {
  const options = defu(_options, { fonts: false }, defaultOptions);
  options.theme = options.theme || {};
  options.theme.colors = resolveColors(options.theme.colors);
  const appConfig = defu({ ui: options.ui, colorMode: options.colorMode, icon: options.icon }, { ui: getDefaultConfig(options.theme) });
  return [
    NuxtEnvironmentPlugin(options),
    ComponentImportPlugin(options, meta),
    AutoImportPlugin(options, meta),
    tailwind(),
    PluginsPlugin(options),
    TemplatePlugin(options, appConfig),
    AppConfigPlugin(options, appConfig),
    {
      name: "nuxt:ui:plugins-duplication-detection",
      vite: {
        configResolved(config) {
          const plugins = config.plugins || [];
          if (options.autoImport !== false && plugins.filter((i) => i.name === "unplugin-auto-import").length > 1) {
            throw new Error("[Nuxt UI] Multiple instances of `unplugin-auto-import` detected. Nuxt UI includes `unplugin-auto-import` already, and you can configure it using `autoImport` option in Nuxt UI module options.");
          }
          if (options.components !== false && plugins.filter((i) => i.name === "unplugin-vue-components").length > 1) {
            throw new Error("[Nuxt UI] Multiple instances of `unplugin-vue-components` detected. Nuxt UI includes `unplugin-vue-components` already, and you can configure it using `components` option in Nuxt UI module options.");
          }
        }
      }
    }
  ].flat(1);
});

export { NuxtUIPlugin, runtimeDir };
