[![nuxt-ui.png](https://volta.s3.fr-par.scw.cloud/nuxt_ui_social_card_531d133fa2.png)](https://ui.nuxt.com)

# Nuxt UI

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

We're thrilled to introduce Nuxt UI v3, a significant upgrade to our UI library that delivers extensive improvements and robust new capabilities. This major update harnesses the combined strengths of [Reka UI](https://reka-ui.com/), [Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta), and [Tailwind Variants](https://www.tailwind-variants.org/) to offer developers an unparalleled set of tools for creating sophisticated, accessible, and highly performant user interfaces.

> [!NOTE]
> You are on the `v3` development branch, check out the [dev branch](https://github.com/nuxt/ui) for Nuxt UI v2.

## Documentation

Visit https://ui3.nuxt.dev to explore the documentation.

## Installation

```bash [pnpm]
pnpm add @nuxt/ui@next
```

```bash [yarn]
yarn add @nuxt/ui@next
```

```bash [npm]
npm install @nuxt/ui@next
```

```bash [bun]
bun add @nuxt/ui@next
```

### Nuxt

1. Add the Nuxt UI module in your `nuxt.config.ts`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```

2. Import Tailwind CSS and Nuxt UI in your CSS:

```css [assets/css/main.css]
@import "tailwindcss";
@import "@nuxt/ui";
```

Learn more in the [installation guide](https://ui3.nuxt.dev/getting-started/installation/nuxt).

### Vue

1. Add the Nuxt UI Vite plugin in your `vite.config.ts`:

```ts [vite.config.ts]
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui()
  ]
})
```

2. Use the Nuxt UI Vue plugin in your `main.ts`:

```ts [main.ts]
import { createApp } from 'vue'
import ui from '@nuxt/ui/vue-plugin'
import App from './App.vue'

const app = createApp(App)

app.use(ui)

app.mount('#app')
```

3. Import Tailwind CSS and Nuxt UI in your CSS:

```css [assets/main.css]
@import "tailwindcss";
@import "@nuxt/ui";
```

Learn more in the [installation guide](https://ui3.nuxt.dev/getting-started/installation/vue).

## Credits

- [nuxt/nuxt](https://github.com/nuxt/nuxt)
- [nuxt/icon](https://github.com/nuxt/icon)
- [nuxt/fonts](https://github.com/nuxt/fonts)
- [nuxt-modules/color-mode](https://github.com/nuxt-modules/color-mode)
- [unovue/reka-ui](https://github.com/unovue/reka-ui)
- [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)
- [vueuse/vueuse](https://github.com/vueuse/vueuse)

## License

Licensed under the [MIT license](https://github.com/nuxt/ui/blob/v3/LICENSE.md).

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxt/ui/next.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@nuxt/ui

[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxt/ui.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npm.chart.dev/@nuxt/ui

[license-src]: https://img.shields.io/github/license/nuxt/ui.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://github.com/nuxt/ui/blob/v3/LICENSE.md

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
