---
title: App
description: Wraps your app to provide global configurations and more.
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

## API

### Props

:component-props

### Slots

:component-slots

## Changelog

:component-changelog
