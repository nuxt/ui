[![nuxt-ui.png](https://repository-images.githubusercontent.com/428329515/43fec891-9030-4601-8233-5d45ba5c6013)](https://ui.nuxt.com)

# Nuxt UI

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Nuxt UI is a module that provides a set of Vue components and composables built with [Tailwind CSS](https://tailwindcss.com/) and [Headless UI](https://headlessui.dev/) to help you build beautiful and accessible user interfaces.

Its goal is to provide everything related to UI when building a Nuxt app. This includes components, icons, colors, dark mode but also keyboard shortcuts.

## Features

- Built with [Headless UI](https://headlessui.dev/) and [Tailwind CSS](https://tailwindcss.com/)
- HMR support through Nuxt App Config
- Dark mode support
- Support for LTR and RTL languages
- Keyboard shortcuts
- Bundled icons
- Fully typed
- [Figma Kit](https://www.figma.com/community/file/1288455405058138934)

Read more on [ui.nuxt.com](https://ui.nuxt.com)

## Installation

```bash
npx nuxi@latest module add ui
```

If you want latest updates, please use `@nuxt/ui-edge` in your `package.json`:

```json
{
  "devDependencies": {
    "@nuxt/ui": "npm:@nuxt/ui-edge@latest"
  }
}
```

## Documentation

Visit https://ui.nuxt.com to explore the documentation.

## Credits

- [nuxt/nuxt](https://github.com/nuxt/nuxt)
- [nuxt-modules/color-mode](https://github.com/nuxt-modules/color-mode)
- [nuxt-modules/tailwindcss](https://github.com/nuxt-modules/tailwindcss)
- [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)
- [tailwindlabs/headlessui](https://github.com/tailwindlabs/headlessui)
- [vueuse/vueuse](https://github.com/vueuse/vueuse)
- [egoist/tailwindcss-icons](https://github.com/egoist/tailwindcss-icons)

## Contributing

Thank you for considering contributing to Nuxt UI. Here are a few ways you can get involved:

- Reporting Bugs: If you come across any bugs or issues, please check out the reporting bugs guide to learn how to submit a bug report.
- Suggestions: Have any thoughts to enhance Nuxt UI? We'd love to hear them! Check out the [contribution guide](https://ui.nuxt.com/getting-started/contributing) to share your suggestions.

## Local Development

Follow the docs to [Set up your local development environment](https://ui.nuxt.com/getting-started/contributing#_2-local-development-setup) and contribute.

## License

Licensed under the [MIT license](https://github.com/nuxt/ui/blob/dev/LICENSE.md).

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxt/ui/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@nuxt/ui

[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxt/ui.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@nuxt/ui

[license-src]: https://img.shields.io/github/license/nuxt/ui.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://github.com/nuxt/ui/blob/main/LICENSE

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
