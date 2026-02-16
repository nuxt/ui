---
title: DashboardSearch
description: 'A ready to use CommandPalette to add to your dashboard.'
category: dashboard
links:
  - label: CommandPalette
    to: /docs/components/command-palette
    icon: i-simple-icons-nuxtdotjs
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/DashboardSearch.vue
---

## Usage

The DashboardSearch component extends the [CommandPalette](/docs/components/command-palette) component, so you can pass any property such as `icon`, `placeholder`, etc.

Use it inside the default slot of the [DashboardGroup](/docs/components/dashboard-group) component:

```vue [layouts/dashboard.vue]{3}
<template>
  <UDashboardGroup>
    <UDashboardSidebar>
      <UDashboardSearchButton />
    </UDashboardSidebar>

    <UDashboardSearch />

    <slot />
  </UDashboardGroup>
</template>
```

::tip
You can open the CommandPalette by pressing :kbd{value="meta"} :kbd{value="K" class="ms-px"}, by using the [DashboardSearchButton](/docs/components/dashboard-search-button) component or by using a `v-model:open`{lang="ts"} directive.
::

### Shortcut

Use the `shortcut` prop to change the shortcut used in [defineShortcuts](/docs/composables/define-shortcuts) to open the ContentSearch component. Defaults to `meta_k` (:kbd{value="meta"} :kbd{value="K"}).

```vue [app.vue]{4}
<template>
  <UDashboardSearch
    v-model:search-term="searchTerm"
    shortcut="meta_k"
    :groups="groups"
    :fuse="{ resultLimit: 42 }"
  />
</template>
```

### Color Mode

By default, a group of commands will be added to the command palette so you can switch between light and dark mode. This will only take effect if the `colorMode` is not forced in a specific page which can be achieved through `definePageMeta`:

```vue [pages/index.vue]
<script setup lang="ts">
definePageMeta({
  colorMode: 'dark'
})
</script>
```

You can disable this behavior by setting the `color-mode` prop to `false`:

```vue [app.vue]{4}
<template>
  <UDashboardSearch
    v-model:search-term="searchTerm"
    :color-mode="false"
    :groups="groups"
    :fuse="{ resultLimit: 42 }"
  />
</template>
```

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

### Expose

When accessing the component via a template ref, you can use the following:

| Name | Type |
| ---- | ---- |
| `commandPaletteRef`{lang="ts-type"} | `Ref<InstanceType<typeof UCommandPalette> \| null>`{lang="ts-type"} |

## Theme

:component-theme

## Changelog

:component-changelog
