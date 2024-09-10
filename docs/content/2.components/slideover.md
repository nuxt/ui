---
description: Display a dialog that slides in from the edge of the screen.
links:
  - label: 'Dialog'
    icon: i-simple-icons-headlessui
    to: 'https://headlessui.com/v1/vue/dialog'
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/overlays/Slideover.vue
---

## Usage

Use a `v-model` to control the Slideover state.

:component-example{component="slideover-example-basic"}

You can put a [Card](/components/card) component inside your Slideover to handle forms and take advantage of `header` and `footer` slots:

:component-example{component="slideover-example-card"}

### Disable overlay

Set the `overlay` prop to `false` to disable it.

:component-example{component="slideover-example-disable-overlay"}

### Disable transition

Set the `transition` prop to `false` to disable it.

:component-example{component="slideover-example-disable-transition"}

### Prevent close

Use the `prevent-close` prop to disable the outside click alongside the `esc` keyboard shortcut. A `close-prevented` event will be emitted when the user tries to close the slideover.

:component-example{component="slideover-example-prevent-close"}

You can still handle the `esc` shortcut yourself by using our [defineShortcuts](/getting-started/shortcuts#defineshortcuts) composable.

```vue
<script setup lang="ts">
const isOpen = ref(false)

defineShortcuts({
  escape: {
    usingInput: true,
    whenever: [isOpen],
    handler: () => { isOpen.value = false }
  }
})
</script>
```

### Control programmatically

First of all, add the `USlideovers` component to your app, preferably inside `app.vue`.

```vue [app.vue]
<template>
  <div>
    <UContainer>
      <NuxtPage />
    </UContainer>
    <USlideovers />
  </div>
</template>
```

Then, you can use the `useSlideover` composable to control your slideovers within your app.

:component-example{component="slideover-example-composable"}
## Props

:component-props

## Config

:component-preset
