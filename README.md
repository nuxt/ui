# @nuxthq/ui

Components library as a Nuxt module using [TailwindCSS](https://tailwindcss.com) and [HeadlessUI](https://headlessui.com).

## Installation

```bash
yarn add --dev @nuxthq/ui
```

Then, register the module in your `nuxt.config.js`:

```js
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  buildModules: [
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
