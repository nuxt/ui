---
title: App
description: Wraps your app to provide global configurations and more.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/App.vue
---

## Usage

This component implements Reka UI [ConfigProvider](https://reka-ui.com/docs/utilities/config-provider) to provide global configuration to all components:

- Enables all primitives to inherit global reading direction.
- Enables changing the behavior of scroll body when setting body lock.
- Much more controls to prevent layout shifts.

It's also using [ToastProvider](https://reka-ui.com/docs/components/toast#provider) and [TooltipProvider](https://reka-ui.com/docs/components/tooltip#provider) to provide global toasts and tooltips, as well as programmatic modals and slideovers.

Use it as at the root of your app:

```vue [app.vue]
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

::framework-only
#nuxt
:::tip{to="/getting-started/i18n/nuxt#locale"}
Learn how to use the `locale` prop to change the locale of your app.
:::

#vue
:::tip{to="/getting-started/i18n/vue#locale"}
Learn how to use the `locale` prop to change the locale of your app.
:::
::

## API

### Props

:component-props

### Slots

:component-slots
