---
description: A headless component to theme child components.
category: layout
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v5/src/runtime/components/Theme.vue
---

## Usage

The Theme component overrides default **slot classes** and **props** of all child components without modifying each one individually. It uses Vue's `provide` / `inject` mechanism under the hood, so the overrides apply at any depth.

::note
The Theme component doesn't render any HTML element, it only provides theme overrides to its children.
::

::framework-only
#nuxt
:::tip{to="/docs/getting-started/theme/components#global-config"}
To customize components across your whole app, use your `app.config.ts`, which also reaches `error.vue`. Use the Theme component for a part of your app, or to switch themes at runtime.
:::

#vue
:::tip{to="/docs/getting-started/theme/components#global-config"}
To customize components across your whole app, use the `ui` option of the Vue plugin. Use the Theme component for a part of your app, or to switch themes at runtime.
:::
::

### Slot classes

Use the `ui` prop to override slot classes of descendant components. Keys are component names (camelCase) and values are their slot class overrides. They apply like the slot classes of your app config, on top of it and of the whole theme, compound variants included.

::component-example
---
name: 'theme-ui-example'
---
::

### Prop defaults :badge{label="4.8+" class="align-text-top"}

Use the `props` prop to override the default value of any prop on descendant components. Each key maps to a partial of that component's props.

::component-example
---
name: 'theme-props-example'
---
::

::tip
Explicit props on a component (e.g. `<UButton color="primary" />`) always win over `<UTheme :props>`. Theme defaults only apply when the prop wasn't passed explicitly.
::

### Default variants

Use the `'*'` key of `props` to change the default `color` and `size` of every descendant component. It only replaces the library defaults, `primary` and `md`, so a component with its own default keeps it: Avatar, AvatarGroup, ChatMessage, Kbd, Separator and the prose Callout and Code stay `neutral`, Separator stays `xs`, and the items of DropdownMenu and ContextMenu stay uncolored. A default you give a component in `app.config.ui.<name>.defaultVariants` counts as its own too. A value a component doesn't have is skipped, like `xl` on a Kbd, which stops at `lg`. A component's own key takes priority over `'*'`, even from a Theme further out: buttons inside `<UTheme :props="{ '*': { size: 'xs' } }">` stay `xl` when an outer Theme sets `{ button: { size: 'xl' } }`.

::component-example
---
name: 'theme-default-variants-example'
---
::

::framework-only
#nuxt
:::tip
To change them for your whole app, set `ui.defaultVariants` in your `app.config.ts`.
:::

#vue
:::tip
To change them for your whole app, set `defaultVariants` in the `ui` option of the Vue plugin.
:::
::

### Unstyled

Use the `unstyled` prop to render descendant components without their theme classes. Only the classes you supply through `class`, `ui` or `app.config.ui` remain, so you can style them from scratch. The `color` prop keeps working: its `[--ui-accent:…]` class stays, so the `accent` utilities you add, like `bg-accent`, follow it. Set it to `false` on a nested Theme to style a subtree again.

::component-example
---
name: 'theme-unstyled-example'
---
::

::warning
This strips **structural** classes too (positioning, transitions, flex/grid), not just cosmetic ones. Layout-heavy components like `Modal`, `Drawer` or `Calendar` will need you to re-supply their layout.
::

::tip
To apply it to your whole app, set `ui.unstyled` in your app config.
::

### Variants

Use the `variants` prop to change the classes of a component's variant values in a subtree, or to add values. It takes the same shape as the `variants` of the component in `app.config.ui`, and its classes apply on top of your app config and of any Theme above, so the nearest wins a conflict.

::component-example
---
name: 'theme-variants-example'
---
::

::note
Unlike the `ui` prop, which applies to every instance of a component, a variant only applies where the component uses that value: here the `soft` buttons, not the `solid` one.
::

::tip
A value you add this way works at runtime, but it isn't part of the component's prop types. Add it to the component's `variants` in your app config to get it typed.
::

### Icons

Use the `icons` prop to change the icons descendant components use, merged over `app.config.ui.icons`. The icons of ContentSearch's results are the exception: its search index is shared by the whole app, so they always come from `app.config.ui.icons`. To change the icon set of your whole app, set it in your app config so ContentSearch uses it too.

::component-example
---
name: 'theme-icons-example'
---
::

## Examples

### Multiple components

Use different keys in `ui` or `props` to theme multiple component types at once.

::component-example
---
name: 'theme-multiple-example'
---
::

### Nested themes

Nest multiple Theme components to compose overrides. Each Theme's classes apply on top of the ones above it, so the innermost wins a conflict and the rest still apply. Prop defaults work the same way: the innermost Theme's value wins, and the keys it doesn't set are inherited.

::component-example
---
name: 'theme-nested-example'
---
::

### Explicit priority

Explicitly setting any prop on an individual component always takes priority over the Theme component. Its `ui` classes apply on top of the Theme's.

::component-example
---
name: 'theme-priority-example'
---
::

### Deep propagation

The overrides are available to all descendant components regardless of how deeply nested they are.

::component-example
---
name: 'theme-deep-example'
---
::

::note
In this example, `MyButton` is a custom component that renders a `UButton` internally. The theme overrides still apply because they propagate through the entire component tree.
::

::warning
Overlays and toasts opened with [`useOverlay`](/docs/composables/use-overlay) and [`useToast`](/docs/composables/use-toast) render inside `App`, not where you call them, so they take the `Theme` around `<UApp>` and not the one around your call. Wrap the overlay's content in a `UTheme` to theme it. A `UModal` or `USlideover` written in your template keeps the `Theme` around it.
::

### Form components

Use the Theme component to apply consistent styling across a group of form components.

::component-example
---
name: 'theme-form-example'
---
::

::tip
`<UFormField>`, `<UFieldGroup>` and `<UAvatarGroup>` keep precedence over `<UTheme :props>` for `size`, `color` and `highlight`. Validation errors also force the `error` color over any theme value.
::

### Prose components

Use the `prose` namespace to theme typography components. Keys are nested under `prose` (e.g. `prose.p`, `prose.code`).

::component-example
---
name: 'theme-prose-example'
---
::

## API

### Props

:component-props

### Slots

:component-slots

## Changelog

:component-changelog
