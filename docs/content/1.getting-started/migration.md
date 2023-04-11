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

### `Button`

- `customClass` prop have been removed
- `baseClass`, `iconBaseClass`, `loadingIcon` and `roundedClass` props have been removed in favor of `ui`
- `leadingIconClass` and `trailingIconClass` props have been moved to `ui.button.leading.icon.base` and `ui.button.trailing.icon.base`
- `rounded` prop is now a class defaulting to `rounded-md` instead of a boolean prop, can be overriden through `ui.button.rounded`
- preset variants have been updated

### `ButtonGroup`

> New component to group buttons together.

### `Dropdown`

- `wrapperClass`, `containerClass`, `widthClass`, `backgroundClass`, `shadowClass`, `roundedClass`, `ringClass`, `divideClass`, `baseClass`, `transitionClass`, `groupClass`, `itemBaseClass`, `itemActiveClass`, `itemInactiveClass`, `itemDisabledClass`, `itemIconClass`, `itemAvatarClass` and `itemShortcutsClass` props have been removed in favor of `ui`
- preset has been updated to improve dark mode

### `Pills`

> `Pills` component has been removed in favor of `Tabs`.

### `SelectCustom`

- `placeholder` prop is now `null` by default
