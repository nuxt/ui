---
navigation: false
---

## Breaking Changes

Components now have a `ui` prop to override the entire preset instead of individual props.

### `Avatar`

- `wrapperClass`, `backgroundClass`, `placeholderClass` and `roundedClass` props have been removed in favor of `ui`
- `rounded` prop is now a class defaulting to `rounded-full` instead of a boolean prop, can be overriden through `ui.avatar.rounded`
- `chip` prop is now `chipVariant`

### `AvatarGroup`

- `ringClass` and `marginClass` props have been removed in favor of `ui`
- `group` prop has been removed in favor of slots

### `Badge`

- `baseClass` prop has been removed in favor of `ui`
- `rounded` prop is now a class defaulting to `rounded-md` instead of a boolean prop, can be overriden through `ui.badge.rounded`
- `color` prop has been added to change the color scheme of the badge
- `variant` prop is now the variant instead of the color

### `Button`

- `customClass` prop have been removed
- `baseClass`, `iconBaseClass`, `loadingIcon` and `roundedClass` props have been removed in favor of `ui`
- `leadingIconClass` and `trailingIconClass` props have been moved to `ui.button.leading.icon.base` and `ui.button.trailing.icon.base`
- `rounded` prop is now a class defaulting to `rounded-md` instead of a boolean prop, can be overriden through `ui.button.rounded`
- `color` prop has been added to change the color scheme of the badge
- `variant` prop is now the variant instead of the color

### `ButtonGroup`

> New component to group buttons together.

### `Dropdown`

- `wrapperClass`, `containerClass`, `widthClass`, `backgroundClass`, `shadowClass`, `roundedClass`, `ringClass`, `divideClass`, `baseClass`, `transitionClass`, `groupClass`, `itemBaseClass`, `itemActiveClass`, `itemInactiveClass`, `itemDisabledClass`, `itemIconClass`, `itemAvatarClass` and `itemShortcutsClass` props have been removed in favor of `ui`
- preset has been updated to improve dark mode

### `Pills`

> `Pills` component has been removed in favor of `Tabs`.

### `SelectCustom`

- `placeholder` prop is now `null` by default

### `Card`

- `baseClass`, `backgroundClass`, `borderColorClass`, `shadowClass`, `ringClass`, `roundedClass`, `bodyClass`, `bodyBackgroundClass`, `headerClass`, `headerBackgroundClass`, `footerClass`, `footerBackgroundClass` props have been removed in favor of `ui`
- `rounded` prop is now a class defaulting to `rounded-lg` instead of a boolean prop, can be overriden through `ui.avatar.rounded`
- `padded` prop has been removed, use `ui.rounded = 'sm:rounded-lg'` instead when false
- `ui.card.border` has been removed in favor of `ui.card.divide`
- `ui.card.header` & `ui.card.footer` are now `{ spacing: '', background: '' }`

### `Container`

- `constrainedClass` prop has been removed in favor of `ui`
- `ui.container.base` and `ui.container.spacing` have been added
- `padded` prop has been removed, use `ui.spacing = 'sm:px-6 lg:px-8'` instead when false
- `constrained` prop has been removed, use `ui.constrained = ''` instead when false
