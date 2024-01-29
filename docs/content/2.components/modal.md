---
description: Display a modal within your application.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/overlays/Modal.vue
  - label: 'Dialog'
    icon: i-simple-icons-headlessui
    to: 'https://headlessui.com/vue/dialog'
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
<script setup>
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

## Props

:component-props

## Config

:component-preset
