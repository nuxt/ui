---
description: Display a modal within your application.
links:
  - label: 'Dialog'
    icon: i-simple-icons-headlessui
    to: 'https://headlessui.com/v1/vue/dialog'
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/overlays/Modal.vue
---

## Usage

Use a `v-model` to control the Modal state.

:component-example{component="modal-example-basic"}

You can put a [Card](/components/card) component inside your Modal to handle forms and take advantage of `header` and `footer` slots:

:component-example{component="modal-example-card"}

### Disable overlay

Set the `overlay` prop to `false` to disable it.

:component-example{component="modal-example-disable-overlay"}

### Disable transition

Set the `transition` prop to `false` to disable it.

:component-example{component="modal-example-disable-transition"}

### Prevent close

Use the `prevent-close` prop to disable the outside click alongside the `esc` keyboard shortcut. A `close-prevented` event will be emitted when the user tries to close the modal.

:component-example{component="modal-example-prevent-close"}

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

### Fullscreen

Set the `fullscreen` prop to `true` to enable it.

:component-example{component="modal-example-fullscreen"}

### Control programmatically

First of all, add the `Modals` component to your app, preferably inside `app.vue`. This component provides your application a place to render programmatically created modals.

```vue [app.vue]
<template>
  <div>
    <UContainer>
      <NuxtPage />
    </UContainer>

    <UModals />
  </div>
</template>
```

Then, you can use the `useModal` composable to control your modals within your app.

<!-- For prerendering -->
:component-example{component="modal-example-component" hiddenCode hiddenPreview }

::code-group{class="[&>div:last-child>div:first-child]:!rounded-t-none"}
  :component-example{component="modal-example-composable" label="index.vue" }
  :component-example{component="modal-example-component" hiddenPreview label="components/ModalExampleComponent.vue" }
::

Additionally, you can close the modal within the modal component by calling `modal.close()`.

## Props

:component-props

## Config

:component-preset
