---
description: A wrapper to provide global configuration, toasts and tooltips to your app.
category: layout
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/App.vue
---

## Usage

This component implements Reka UI [ConfigProvider](https://reka-ui.com/docs/utilities/config-provider) to provide global configuration to all components:

- Enables all primitives to inherit global reading direction.
- Enables changing the behavior of scroll body when setting body lock.
- Much more controls to prevent layout shifts.

It's also using [ToastProvider](https://reka-ui.com/docs/components/toast#provider) and [TooltipProvider](https://reka-ui.com/docs/components/tooltip#provider) to provide global toasts and tooltips, as well as programmatic modals and slideovers.

Wrap your entire application with the App component in your `app.vue` file:

```vue [app.vue]
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

::framework-only
#nuxt
:::tip{to="/docs/getting-started/integrations/i18n/nuxt#locale"}
Learn how to use the `locale` prop to change the locale of your app. This also controls the date/time format in components like Calendar, InputDate, and InputTime.
:::

#vue
:::tip{to="/docs/getting-started/integrations/i18n/vue#locale"}
Learn how to use the `locale` prop to change the locale of your app. This also controls the date/time format in components like Calendar, InputDate, and InputTime.
:::
::

### Stable IDs

Reka UI primitives rely on Vue's [useId](https://vuejs.org/api/composition-api-helpers.html#useid) to generate the `id` attributes used for accessibility. A known upstream issue ([vuejs/core#12591](https://github.com/vuejs/core/issues/12591)) can make these ids differ between the server and the client in some Nuxt apps, causing hydration mismatches on components like Accordion or Tabs.

You can use the `useId` prop to provide your own generator as a workaround:

```vue [app.vue]
<script setup lang="ts">
let count = 0
const generateId = () => `app-${++count}`
</script>

<template>
  <UApp :use-id="generateId">
    <NuxtPage />
  </UApp>
</template>
```

::warning
A counter like this is only hydration safe when Reka UI primitives mount in the same order on the server and the client, which is not guaranteed when several lazy or data fetching components render them. Keep the default unless you actually face these mismatches.
::

## API

### Props

:component-props

### Slots

:component-slots

## Changelog

:component-changelog
