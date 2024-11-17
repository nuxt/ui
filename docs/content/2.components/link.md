---
title: 'Link'
description: Render a NuxtLink but with superpowers.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/elements/Link.vue
---

## Usage

The Link component is a wrapper around [`<NuxtLink>`](https://nuxt.com/docs/api/components/nuxt-link) through the [`custom`](https://router.vuejs.org/api/interfaces/RouterLinkProps.html#Properties-custom) prop that provides a few extra props:

- `inactive-class` prop to set a class when the link is inactive, `active-class` is used when active.
- `exact` prop to style with `active-class` when the link is active and the route is exactly the same as the current route.
- `exact-query` and `exact-hash` props to style with `active-class` when the link is active and the query or hash is exactly the same as the current query or hash.
  - use `exact-query="partial"` to style with `active-class` when the link is active and the query partially match the current query. 

The incentive behind this is to provide the same API as NuxtLink back in Nuxt 2 / Vue 2. You can read more about it in the Vue Router [migration from Vue 2](https://router.vuejs.org/guide/migration/#removal-of-the-exact-prop-in-router-link) guide.

::component-card
---
props:
  to: /components/link
  activeClass: 'text-primary'
  inactiveClass: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
code: ' Link '
---

Link
::

It also renders an `<a>` tag when a `to` prop is provided, otherwise it defaults to rendering a `<button>` tag. The default behavior can be customized using the `as` prop.

It is used underneath by the [Button](/components/button), [Dropdown](/components/dropdown) and [VerticalNavigation](/components/vertical-navigation) components.

## IntelliSense
If you're using VSCode and wish to get autocompletion for the classes `active-class` and `inactive-class`, you can add the following settings to your `.vscode/settings.json`:

```json [.vscode/settings.json]
{
    "tailwindCSS.classAttributes": [
      "active-class",
      "inactive-class"
  ],
}
```

## Props

:component-props
