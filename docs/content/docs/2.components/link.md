---
description: A wrapper around <NuxtLink> with extra props.
category: navigation
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Link.vue
---

## Usage

The Link component is a wrapper around [`<NuxtLink>`](https://nuxt.com/docs/api/components/nuxt-link) using the [`custom`](https://router.vuejs.org/api/interfaces/RouterLinkProps.html#Properties-custom) prop. It provides a few extra props:

- `inactive-class` prop to set a class when the link is inactive, `active-class` is used when active.
- `exact` prop to style with `active-class` when the link is active and the route is exactly the same as the current route.
- `exact-query` and `exact-hash` props to style with `active-class` when the link is active and the query or hash is exactly the same as the current query or hash.
  - use `exact-query="partial"` to style with `active-class` when the link is active and the query partially match the current query.

The incentive behind this is to provide the same API as NuxtLink back in Nuxt 2 / Vue 2. You can read more about it in the Vue Router [migration from Vue 2](https://router.vuejs.org/guide/migration/#removal-of-the-exact-prop-in-router-link) guide.

::note
It is used by the [`Breadcrumb`](/docs/components/breadcrumb), [`Button`](/docs/components/button), [`ContextMenu`](/docs/components/context-menu), [`DropdownMenu`](/docs/components/dropdown-menu) and [`NavigationMenu`](/docs/components/navigation-menu) components.
::

### Tag

The `Link` components renders an `<a>` tag when a `to` prop is provided, otherwise it renders a `<button>` tag. You can use the `as` prop to change fallback tag.

::component-code
---
props:
  to: ''
  as: 'button'
slots:
  default: Link
---
::

::note
You can inspect the rendered HTML by changing the `to` prop.
::

### Style

By default, the link has default active and inactive styles, check out the [#theme](#theme) section.

::component-code
---
props:
  to: /docs/components/link
slots:
  default: Link
---
::

::note
Try changing the `to` prop to see the active and inactive states.
::

You can override this behavior by using the `raw` prop and provide your own styles using `class`, `active-class` and `inactive-class`.

::component-code
---
ignore:
  - raw
props:
  raw: true
  to: /docs/components/link
  activeClass: 'font-bold'
  inactiveClass: 'text-muted'
slots:
  default: Link
---

Link
::

::callout{icon="i-simple-icons-visualstudiocode"}
If you're using the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension for VSCode and wish to get autocompletion for the `active-class` and `inactive-class` props, you can add the following settings to your `.vscode/settings.json`:

```json [.vscode/settings.json]
{
  "tailwindCSS.classAttributes": [
    "active-class",
    "inactive-class"
  ]
}
```
::

### Locale :badge{label="4.7+" class="align-text-top"}

The Link component automatically integrates with [`@nuxtjs/i18n`](https://i18n.nuxtjs.org/) when installed. Internal links are automatically localized using the `$localePath` helper without requiring manual wrapping.

```vue
<template>
  <!-- Automatically becomes /en/about or /fr/about based on current locale -->
  <ULink to="/about">About</ULink>
</template>
```

::tip
You can still manually use `localePath()` or `localeRoute()` if needed.
::

::note{to="/docs/getting-started/integrations/i18n/nuxt#dynamic-locale"}
Learn more about Internationalization in Nuxt UI.
::

## API

### Props

::component-props
---
ignore:
  - custom
---
::

::callout{icon="i-simple-icons-mdnwebdocs" to="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes" target="_blank"}
This component also supports all native `<a>` HTML attributes.
::

### Slots

:component-slots

## Theme

:component-theme

## Changelog

:component-changelog
