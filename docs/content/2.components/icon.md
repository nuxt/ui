---
description: Display any icon (100,000+) from Iconify.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/elements/Icon.vue
---

## Usage

Use the `name` prop by following this pattern: `i-{collection_name}-{icon_name}`. You can search any icon from [Iconify](https://iconify.design/) using https://icones.js.org.

::component-card
---
props:
  name: 'i-heroicons-light-bulb'
---
::

::callout{icon="i-heroicons-exclamation-triangle"}
You won't be able to use all icons in the `name` prop here as icons are bundled using [egoist/tailwindcss-icons](https://github.com/egoist/tailwindcss-icons).
::

::callout{icon="i-heroicons-light-bulb"}
Don't forget to install and specify the icon collections you need in your `nuxt.config.ts`, read more about this in [Theming](/getting-started/theming#icons).
::

### Dynamic

You can use the `dynamic` prop to enable dynamic icon loading. This will use [`nuxt-icon`](https://github.com/nuxt-modules/icon) instead and allow you to use any icon from [Iconify](https://iconify.design/) as well as the `{collection_name}:{icon_name}` pattern.

This can be quite useful when using [dynamic class names](https://tailwindcss.com/docs/content-configuration#dynamic-class-names) or for icons that are not bundled by default (fetched from a database for example).

::component-card
---
props:
  name: 'i-ph-rocket-launch'
  dynamic: true
---
::

You can also change the default behavior of the `dynamic` prop by setting the `ui.icons.dynamic` option in your `app.config.ts`.

```ts [app.config.ts]
export default defineAppConfig({
  ui: {
    icons: {
      dynamic: true
    }
  }
})
```

## Props

:component-props
