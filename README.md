[![nuxt-ui.png](https://repository-images.githubusercontent.com/428329515/43fec891-9030-4601-8233-5d45ba5c6013)](https://ui.nuxt.com)

# Nuxt UI v3

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

We're thrilled to introduce Nuxt UI v3, a significant upgrade to our UI library that delivers extensive improvements and robust new capabilities. This major update harnesses the combined strengths of [Radix Vue](https://www.radix-vue.com/), [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4-alpha), and [Tailwind Variants](https://www.tailwind-variants.org/) to offer developers an unparalleled set of tools for creating sophisticated, accessible, and highly performant user interfaces.

## Installation

1. Install the Nuxt UI v3 alpha package:

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

> [!WARNING]
> Make sure you have `typescript` installed in your dev dependencies.

2. Register the Nuxt UI module in your `nuxt.config.ts`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```

3. Import Tailwind and Nuxt UI in your `app.vue` or in your [CSS](https://nuxt.com/docs/getting-started/styling#the-css-property):

```css [main.css]
@import "tailwindcss";
@import "@nuxt/ui";
```

## Documentation

Visit https://ui3.nuxt.dev to explore the documentation.

## Credits

- [nuxt/nuxt](https://github.com/nuxt/nuxt)
- [nuxt/icon](https://github.com/nuxt/icon)
- [nuxt/fonts](https://github.com/nuxt/fonts)
- [nuxt-modules/color-mode](https://github.com/nuxt-modules/color-mode)
- [radix-vue/radix-vue](https://github.com/radix-vue/radix-vue)
- [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)
- [vueuse/vueuse](https://github.com/vueuse/vueuse)

## License

Licensed under the [MIT license](https://github.com/nuxt/ui/blob/dev/LICENSE.md).

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxt/ui/next.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@nuxt/ui

[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxt/ui.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@nuxt/ui

[license-src]: https://img.shields.io/github/license/nuxt/ui.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://github.com/nuxt/ui/blob/main/LICENSE.md

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
