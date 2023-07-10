# NuxtLabs UI

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

This module has been developed by [NuxtLabs](https://nuxtlabs.com/) for [Volta](https://volta.net) and [Nuxt Studio](https://nuxt.studio/). It provides everything related to UI when building a Nuxt application, including components, icons, colors, dark mode and also keyboard shortcuts.

[![social preview](https://repository-images.githubusercontent.com/428329515/5a18c5dd-bb58-4874-b6ef-1c44e4884344)](https://ui.nuxtlabs.com)

## Features

- Built with [Headless UI](https://headlessui.dev/) and [Tailwind CSS](https://tailwindcss.com/)
- HMR support through Nuxt App Config
- Dark mode support
- Support for LTR and RTL languages
- Keyboard shortcuts
- Bundled icons
- Fully typed

## Installation

```bash
yarn add --dev @nuxthq/ui
```

Then, register the module in your `nuxt.config.ts`:

```js
export default defineNuxtConfig({
  modules: [
    '@nuxthq/ui'
  ]
})
```

If you want latest updates, please use `@nuxthq/ui-edge` in your `package.json`:

```json
{
  "devDependencies": {
    "@nuxthq/ui": "npm:@nuxthq/ui-edge@latest"
  }
}
```

## Documentation

Visit https://ui.nuxtlabs.com to view the documentation.

## Credits

- [nuxt/nuxt](https://github.com/nuxt/nuxt)
- [nuxt-modules/color-mode](https://github.com/nuxt-modules/color-mode)
- [nuxt-modules/tailwindcss](https://github.com/nuxt-modules/tailwindcss)
- [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)
- [tailwindlabs/headlessui](https://github.com/tailwindlabs/headlessui)
- [vueuse/vueuse](https://github.com/vueuse/vueuse)
- [egoist/tailwindcss-icons](https://github.com/egoist/tailwindcss-icons)

## License

Licensed under the [MIT license](https://github.com/nuxtlabs/ui/blob/dev/LICENSE.md).

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxthq/ui/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@nuxthq/ui

[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxthq/ui.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@nuxthq/ui

[license-src]: https://img.shields.io/github/license/nuxtlabs/ui.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://github.com/nuxtlabs/ui/blob/main/LICENSE

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
