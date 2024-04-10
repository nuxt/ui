---
description: Display a dialog that slides in from the edge of the screen.
links:
  - label: 'Dialog'
    icon: i-simple-icons-headlessui
    to: 'https://headlessui.com/vue/dialog'
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

### Control programmatically :u-badge{label="New" class="align-middle ml-2 !rounded-full" variant="subtle"}

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

### Enable resize :u-badge{label="New" class="align-middle ml-2 !rounded-full" variant="subtle"}

**Drag** or **click** (automatically decide whether to reach 50% or 100% of the screen according to the current width) to change the prop of the slideover body width

Set the `resize` prop to enable it. Similarly, the aforementioned props can be employed in conjunction.

:component-example{component="slideover-example-enable-resize"}

Set the `resize.width` prop to establish the initial width of the Slideover's main section. Moreover, you can customize the drag icon and its size by set `resize.icon` and `resize.size` respectively.

:component-example{component="slideover-example-enable-resize-options"}

By adjusting the `resize.duration` and `resize.transition` props, you can modify the transition effects (Please refer to the [`@vueuse/core: useTransition()`](https://vueuse.org/core/useTransition/#usetransition) for further details). Additionally, setting `resize.percentage` allows you to change the proportion at which the width automatically snaps while adjusting, aligning it seamlessly to full screen.

## Props

:component-props

## Config

:component-preset
