# @nuxthq/ui

Components library as a Nuxt module using [TailwindCSS](https://tailwindcss.com).

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

## Options

- `primary`

Define the primary variant. Defaults to `indigo`. You can specify your own object of colors like here:

**Example:**

```js
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  buildModules: [
    '@nuxthq/ui'
  ],
  ui: {
    primary: 'blue'
  }
})
```

- `prefix`

Define the prefix of the imported components. Defaults to `u`.

**Example:**

```js
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  buildModules: [
    '@nuxthq/ui'
  ],
  ui: {
    prefix: 'tw'
  }
})
```
