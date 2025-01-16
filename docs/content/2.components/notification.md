---
description: Display a toast notification in your app.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/overlays/Notification.vue
---

## Usage

First of all, add the `Notifications` component to your app, preferably inside `app.vue`.

```vue [app.vue]
<template>
  <div>
    <UContainer>
      <NuxtPage />
    </UContainer>

    <UNotifications />
  </div>
</template>
```

This component will render the notifications at the bottom right of the screen by default. You can configure its behavior in the `app.config.ts` through `ui.notifications`:

```ts [app.config.ts]
export default defineAppConfig({
  ui: {
    notifications: {
      // Show toasts at the top right of the screen
      position: 'top-0 bottom-[unset]'
    }
  }
})
```

::callout{icon="i-heroicons-light-bulb"}
The `position` defaults to `bottom-0 end-0`, the `bottom-[unset]` class overrides `bottom-0` so the result is `top-0 end-0`.
::

Then, you can use the `useToast` composable to add notifications to your app:

:component-example{component="notification-example-basic"}

When using `toast.add`, this will push a new notification to the stack displayed in `<UNotifications />`. All the props of the `Notification` component can be passed to `toast.add`.

```vue
<script setup lang="ts">
const toast = useToast()

onMounted(() => {
  toast.add({
    id: 'update_downloaded',
    title: 'Update downloaded.',
    description: 'It will be installed on restart. Restart now?',
    icon: 'i-octicon-desktop-download-24',
    timeout: 0,
    actions: [{
      label: 'Restart',
      click: () => {

      }
    }]
  })
})
</script>
```

You can also use the `Notification` component directly in your app as an alert for example.

### Title

Pass a `title` to your Notification.

::component-card
---
baseProps:
  id: 1
  timeout: 0
props:
  title: 'Notification'
---
::

### Description

You can add a `description` in addition of the `title`.

::component-card
---
baseProps:
  id: 2
  timeout: 0
  title: 'Notification'
props:
  description: 'This is a notification.'
---
::

### Icon

Use any icon from [Iconify](https://icones.js.org) by setting the `icon` prop by using this pattern: `i-{collection_name}-{icon_name}` or change it globally in `ui.notification.default.icon`.

::component-card
---
baseProps:
  id: 3
  timeout: 0
  title: 'Notification'
props:
  icon: 'i-heroicons-check-circle'
  description: 'This is a notification.'
excludedProps:
  - icon
---
::

### Avatar

Use the [avatar](/components/avatar) prop as an `object` and configure it with any of its props.

::component-card
---
baseProps:
  id: 4
  timeout: 0
  title: 'Notification'
props:
  description: 'This is a notification.'
  avatar:
    src: 'https://avatars.githubusercontent.com/u/739984?v=4'
excludedProps:
  - avatar
---
::

### Timeout

Use the `timeout` prop to configure how long the Notification will remain. The default value is  `5000`, set it to `0` to disable the timeout. The `pauseTimeoutOnHover` prop (`true` by default) controls whether hovering the notification should pause the timeout.

You will see a progress bar at the bottom of the Notification which will indicate the remaining time. When hovering the Notification, the progress bar will be paused if `pauseTimeoutOnHover` is enabled; otherwise, it won't stop.

::component-card
---
baseProps:
  id: 5
  title: 'Notification'
  description: 'This is a notification.'
props:
  timeout: 60000
  pauseTimeoutOnHover: true
---
::

### Style

Use the `color` prop to change the progress and icon color of the Notification.

::component-card
---
baseProps:
  id: 6
  title: 'Notification'
  description: 'This is a notification.'
  timeout: 600000
props:
  icon: 'i-heroicons-check-badge'
  color: 'primary'
options:
  - name: color
    restriction: included
    values:
      - gray
excludedProps:
  - icon
---
::

### Click

Use the `click` prop to execute a function when the Notification is clicked.

:component-example{component="notification-example-click"}

### Callback

Use the `callback` prop to execute a function when the Notification expires.

:component-example{component="notification-example-callback"}

### Close

Use the `close-button` prop to hide or customize the close button on the Notification.

You can pass all the props of the [Button](/components/button) component to customize it through the `close-button` prop or globally through `ui.notification.default.closeButton`.

::component-card
---
baseProps:
  id: 7
  title: 'Notification'
  timeout: 0
props:
  closeButton:
    icon: 'i-heroicons-archive-box-x-mark'
    color: 'primary'
    variant: 'outline'
    padded: true
    size: '2xs'
    ui:
      rounded: 'rounded-full'
excludedProps:
  - closeButton
---
::

### Actions

Use the `actions` prop to add actions to the Notification.

:component-example{component="notification-example-actions"}

Like for `closeButton`, you can pass all the props of the [Button](/components/button) component inside the action or globally through `ui.notification.default.actionButton`.

::component-card
---
baseProps:
  id: 8
  title: 'Notification'
  timeout: 0
props:
  actions:
    - label: Action 1
    - variant: 'solid'
      color: 'gray'
      label: Action 2
excludedProps:
  - actions
---
::

Actions will render differently whether you have a `description` set.

::component-card
---
baseProps:
  id: 9
  title: 'Notification'
  description: 'This is a notification.'
  timeout: 0
props:
  actions:
    - variant: 'solid'
      color: 'primary'
      label: Action 1
    - variant: 'outline'
      color: 'primary'
      label: Action 2
excludedProps:
  - actions
---
::

## Slots

### `title` / `description`

Use the `#title` and `#description` slots to customize the Notification.

This can be handy when you want to display HTML content. To achieve this, you can define those slots in the top-level `<UNotifications />` component in your `app.vue` and use the `v-html` directive.

```vue [app.vue]
<template>
  <UNotifications>
    <template #title="{ title }">
      <span v-html="title" />
    </template>

    <template #description="{ description }">
      <span v-html="description" />
    </template>
  </UNotifications>
</template>
```

This way, you can use HTML tags in the `title` and `description` props when using `useToast`.

:component-example{component="notification-example-html"}

::callout{icon="i-heroicons-light-bulb"}
Slots defined in the `<UNotifications />` component are automatically passed down to the `Notification` children.
::

## Props

::tabs
  :component-props{label="Notification"}
  :component-props{label="Notifications" slug="UNotifications"}
::

## Config

::tabs
  :component-preset{label="Notification"}
  :component-preset{label="Notifications" slug="Notifications"}
::
