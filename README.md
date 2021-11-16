# @nuxthq/ui

Components library as a Nuxt3 module.

## Installation

```bash
yarn add --dev @nuxthq/ui
```

Register the module in your `nuxt.config.js`:

```js
import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  buildModules: [
    '@nuxthq/ui'
  ]
})
```

## Options

- `primary`

Define the primary variant. Defaults to `indigo`.

**Example:**

```js
import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  buildModules: [
    '@nuxthq/ui'
  ],
  ui: {
    primary: 'blue'
  }
})
```
