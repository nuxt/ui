# @nuxthq/ui

This module has been developed by the [NuxtLabs](https://nuxtlabs.com/) team for [Volta](https://volta.net) and [Nuxt Studio](https://nuxt.studio/), its goal is to provide everything related to UI when building a Nuxt app. This includes components, icons, colors, dark mode but also keyboard shortcuts.

## Features

- Fully styled and customizable components
- HMR support through Nuxt App Config
- Dark mode support
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

Visit http://ui.nuxtlabs.com to view the documentation.

## Credits

- [nuxt/nuxt](https://github.com/nuxt/nuxt)
- [nuxt-modules/color-mode](https://github.com/nuxt-modules/color-mode)
- [nuxt-modules/tailwindcss](https://github.com/nuxt-modules/tailwindcss)
- [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)
- [tailwindlabs/headlessui](https://github.com/tailwindlabs/headlessui)
- [vueuse/vueuse](https://github.com/vueuse/vueuse)
- [egoist/tailwindcss-icons](https://github.com/egoist/tailwindcss-icons)

## License

Licensed under the [MIT license](https://github.com/nuxtlabs/ui/blob/dev/LICENSE).
