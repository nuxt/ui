# Nuxt UI v5 role variables

Derived from the CSS Variables page of the docs. Set them on `:root` and `.dark`, both blocks for each variable since a `:root` value also applies in dark mode, unlayered or in `@layer base`, except `--ui-control-px`, `--ui-control-py`, `--ui-control-gap`, `--ui-control-icon-size`, `--ui-control-size` and `--ui-control-thickness`, which components set in their `size` variants (see Control sizes). `neutral-<n>` means `var(--ui-color-neutral-<n>)`. An unset variable is a hook: its utility holds the default, so don't read it with `var()`.

## Colors

| Variable | Read by | Light | Dark |
| --- | --- | --- | --- |
| `--ui-color-<color>-50` … `-950` | Shade utilities (`bg-primary-600`) and the alias | From `@plugin "@nuxt/ui/colors"` | Same |
| `--ui-<color>` | `bg-<color>`, `text-<color>`, the `solid` variant | Shade `500`, `neutral` `900` | Shade `400`, `neutral` `50` |

`--ui-accent` is the color of the component, set by its `color` prop. A class like `[--ui-accent:var(--ui-success)]` sets it outside a component.

Aliases: `primary` (sky), `secondary` (violet), `success` (emerald), `info` (blue), `warning` (amber), `error` (red), `neutral` (gray). Plugin syntax: `primary: <palette>`, `primary: <palette> <light shade> <dark shade>`, or shades alone. `black` and `white` work as shades. An alias on a gray palette is monochrome.

## Text

| Variable | Read by | Light | Dark |
| --- | --- | --- | --- |
| `--ui-text-faint` | Placeholders, field and menu icons | `neutral-400` | `neutral-500` |
| `--ui-text-muted` | Descriptions, help text, inactive tabs | `neutral-500` | `neutral-400` |
| `--ui-text-default` | Body, labels, menu text | `neutral-700` | `neutral-200` |
| `--ui-text-strong` | Titles, field values, selected items | `neutral-900` | `white` |
| `--ui-text-contrast` | Text on `bg-neutral` and solids | `white` | `neutral-900` |

## Background

| Variable | Read by | Light | Dark |
| --- | --- | --- | --- |
| `--ui-bg-default` | Page, cards, `outline` variant | `white` | `neutral-900` |
| `--ui-bg-tint` | Hovered rows and items, table heads | Unset: `bg-soft` at 50% | Same |
| `--ui-bg-soft` | Highlighted items, `soft` neutral variant | `neutral-100` | `neutral-800` |
| `--ui-bg-strong` | Tracks of Progress, Slider, Switch | `neutral-200` | `neutral-700` |
| `--ui-bg-backdrop` | Behind Modal, Slideover, Drawer | `bg-soft` at 75%, `bg-default` at 75% once `--ui-bg-overlay` is set | Same |
| `--ui-bg-overlay` | Menus, popovers, tooltips, modals, toasts | Unset: `bg-default` | Same |
| `--ui-overlay-bg-soft`, `--ui-overlay-bg-strong` | `bg-soft` / `bg-strong` inside a floating layer | Unset: one step up | Same |
| `--ui-neutral-bg-hover` | Hovered `bg-neutral` | Unset: `--ui-neutral` at 90% | Same |

## Border

| Variable | Read by | Light | Dark |
| --- | --- | --- | --- |
| `--ui-border-default` | `border-default`, `ring-default`, `divide-default`, `bg-border`: cards, menus, separators | `neutral-200` | `neutral-800` |
| `--ui-border-strong` | `border-strong`, `ring-strong`: checkboxes, radios, `outline` neutral | `neutral-300` | `neutral-700` |
| `--ui-overlay-border-default`, `--ui-overlay-border-strong` | The same inside a floating layer | Unset: one step up | Same |

## Per-color roles

Unset by default, for every alias and added color. Set one only when the design system differs from the recipe.

| Variable | Read by | Recipe |
| --- | --- | --- |
| `--ui-<color>-bg-hover` | Hovered `solid` | Color at 75% |
| `--ui-<color>-bg-tint` | Callouts, highlighted menu items | Color at 5% |
| `--ui-<color>-bg-soft` | `soft`, `subtle` | Color at 10% |
| `--ui-<color>-bg-strong` | Hovered `soft`, `subtle` | Color at 15% |
| `--ui-<color>-text-strong` | `text-<color>`, prose links | `text-default` |
| `--ui-<color>-text-default` | `soft`, `subtle`, `outline`, `ghost` labels | The color |
| `--ui-<color>-text-muted` | `link` Button, Avatar fallback | Text at 75% |
| `--ui-<color>-text-faint` | Menu item icons, Callout list markers | Text at 50% |
| `--ui-<color>-text-contrast` | Text on `solid` | `--ui-text-contrast` |
| `--ui-<color>-border-default` | Callouts, colored separators | Color at 25% |
| `--ui-<color>-border-strong` | `outline`, `subtle` rings | Color at 50% |
| `--ui-<color>-outline-focus` | Focus outline | Color at 25% |

`--ui-neutral-<role>` falls back to the neutral token of the same name, except `bg-hover` (`--ui-neutral` at 90%), `bg-strong` (`bg-strong` at 75%), `text-contrast` (`--ui-text-contrast`) and `outline-focus` (`--ui-neutral` at 25%). `--ui-outline-focus` is the focus outline of components without a `color` prop, `primary` at 25%.

## Shape and layout

| Variable | Read by | Default |
| --- | --- | --- |
| `--ui-radius` | `rounded-xs` … `rounded-3xl` as `0.5`, `1`, `1.5`, `2`, `3`, `4`, `6` times it | `0.25rem` |
| `--ui-focus-width` | Focus outline width | `3px` |
| `--ui-disabled-opacity` | Disabled components | `75%` |
| `--ui-control-text-step` | Added to field text size | `0px` |
| `--ui-control-<px\|py\|gap\|icon-size>-<size>` | Sizes of Button, the fields, Select, FileUpload, Tree and the menu items | See Control sizes |
| `--ui-container-width` | Container max width | `80rem` |
| `--ui-gutter` | Container side padding, Card/Modal/Slideover padding | `--spacing(4)`, `--spacing(6)` from `sm` |
| `--ui-header-height` | Header, Main height, PageAside offset | `4rem` |
| `--font-heading` (in `@theme`) | `h1`–`h6`, component titles | Unset: body font |
| `--ui-font-weight-heading` | Prose headings, component titles | Unset |
| `--ui-font-weight-body` | Body text | Unset: `400` |
| `--ui-chart-1` … `-6` | Chart series | `--ui-primary`, blue, violet, amber, rose, cyan |

Radius steps in use: controls, menus and popovers `rounded-md` (1.5×), cards, alerts, toasts and modals `rounded-lg` (2×), small badges and tooltips `rounded-sm` (1×). A scale that isn't proportional goes in `@theme` as `--radius-md` / `--radius-lg` / `--radius-xl`, next to `--ui-radius`.

Shadows: menus, popovers, modals and toasts use `shadow-lg`, tooltips `shadow-sm`, tabs `shadow-xs`, cards none. Transitions run on `--ease-out`.

## Control sizes

`--ui-control-px`, `--ui-control-py`, `--ui-control-gap`, `--ui-control-icon-size` are set by each component's `size` variants, so `:root` can't change them. On Button, Input, Textarea, InputMenu, InputNumber, InputTags, Select, SelectMenu, FileUpload and Tree each size reads them from a scale, and so do the items of DropdownMenu, ContextMenu, Listbox, CommandPalette, EditorSuggestionMenu and the Select, SelectMenu and InputMenu menus, with `py` as their padding on every side. `:root` sets the scale, `--ui-control-<px|py|gap|icon-size>-<size>`:

| Size | Height | `py` | `px` | `gap` | Icon | Text |
| --- | --- | --- | --- | --- | --- | --- |
| `xs` | 24px | `--spacing(1)` | `--spacing(2)` | `--spacing(1)` | `--spacing(4)` | `text-xs` |
| `sm` | 28px | `--spacing(1.5)` | `--spacing(2.5)` | `--spacing(1.5)` | `--spacing(4)` | `text-xs` |
| `md` | 32px | `--spacing(1.5)` | `--spacing(2.5)` | `--spacing(1.5)` | `--spacing(5)` | `text-sm` |
| `lg` | 36px | `--spacing(2)` | `--spacing(3)` | `--spacing(2)` | `--spacing(5)` | `text-sm` |
| `xl` | 40px | `--spacing(2)` | `--spacing(3)` | `--spacing(2)` | `--spacing(6)` | `text-base` |

The heights are those of Button and the fields: the text line height plus twice `py`, so `--ui-control-py-md: --spacing(1)` makes `md` 28px. FileUpload reads the scale for its file items, its icon and the padding of its `button` variant, its `area` variant keeps `p-4` (`base` slot). The other components keep their own values, retune a size in their app config: the slot is `base` on Badge, `root` on InputDate, InputTime, Checkbox, RadioGroup, Calendar and Stepper, and `link` (per `orientation`) and `label` on NavigationMenu:

`badge`, `inputDate`, `inputTime`, `checkbox`, `radioGroup`, `navigationMenu`, `calendar`, `stepper`. Retune the ones the app uses.

The MCP `get-component-theme` tool lists the variables a component sets. Without it, read `node_modules/@nuxt/ui/dist/runtime/theme/<name>.js`. `--ui-control-size` (Calendar cells, Stepper indicators, the room around Timeline indicators) and `--ui-control-thickness` (Slider, Progress, ProgressGroup, Separator) are set per size the same way, on `root`: `calendar`, `stepper`, `timeline`, `slider`, `progress`, `progressGroup`, `separator`.

## Names an added color can't take

The name is lowercase words joined by dashes, not the name of its own palette, and none of:

- Tailwind CSS palettes and keywords: `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`, `slate`, `gray`, `zinc`, `neutral`, `stone`, `taupe`, `mauve`, `mist`, `olive`, `black`, `white`, `inherit`, `current`, `transparent`
- Nuxt UI tokens: `accent`, `backdrop`, `bg`, `border`, `contrast`, `default`, `faint`, `focus`, `muted`, `soft`, `strong`, `tint`, `highlight`, `layer`, and the seven aliases
- Any name whose `--ui-<name>` variable Nuxt UI sets, like `radius`, `gutter`, `overlay` or `text-muted`

## Internal, never set

`--ui-accent-*` (set by the `color` scope, use the per-color roles), `--ui-layer-*` (set by `bg-overlay`, use `--ui-overlay-*`), `--ui-highlight`, `--spotlight-color`, `--ui-font-heading`.
