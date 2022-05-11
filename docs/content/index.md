# Installation

```bash
yarn add --dev @nuxthq/ui
```

Then, register the module in your `nuxt.config.js`:

```js
import { defineNuxtConfig } from 'nuxt'

defineNuxtConfig({
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

### `preset`

An object can be used to override some parts of the default preset.


### `prefix`

Define the prefix of the imported components. Defaults to `u`.

```js
import { defineNuxtConfig } from 'nuxt'

defineNuxtConfig({
  ui: {
    prefix: 'tw'
  }
})
```

### `colors.primary`

Define the primary variant. Defaults to `indigo`. You can specify your own object of colors like here:

### `colors.gray`

Define the gray variant. Defaults to `zinc`. You can like the `primary` color specify your own object. https://tailwindcss.com/docs/customizing-colors#default-color-palette

```js
import { defineNuxtConfig } from 'nuxt'

defineNuxtConfig({
  ui: {
    colors: {
      primary: 'blue',
      gray: 'stone'
    }
  }
})
```
