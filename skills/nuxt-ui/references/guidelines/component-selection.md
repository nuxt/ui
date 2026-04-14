# Component Selection

Decision matrices for choosing the right component. When in doubt, use the MCP `search_components` tool.

## Overlays

| Need | Component | Why |
|---|---|---|
| Confirmation dialog, focused task, form | `UModal` | Blocks page interaction, centered, draws focus |
| Detail panel, settings, secondary content | `USlideover` | Slides from edge, doesn't feel as interruptive as modal |
| Mobile-first bottom sheet | `UDrawer` | Natural mobile pattern, swipe to dismiss |
| Contextual info attached to a trigger | `UPopover` | No backdrop, positioned relative to trigger |
| Simple hover hint | `UTooltip` | Non-interactive, hover/focus only |

### Rules
- Use `UModal` for destructive confirmations ("Are you sure you want to delete?")
- Use `USlideover` for detail views in dashboards (email preview, user profile)
- Use `UDrawer` for mobile navigation or action sheets
- Modal and Slideover support `mode="drawer"` for automatic mobile drawer behavior
- For programmatic overlays, use `useOverlay()` instead of `v-model:open`
- Never put interactive content (buttons, links) inside `UTooltip`

## Navigation

| Need | Component | Why |
|---|---|---|
| Primary site/app navigation | `UNavigationMenu` | Horizontal (header) or vertical (sidebar) |
| Switch between views on same page | `UTabs` | Content stays on page, no route change needed |
| Show current location in hierarchy | `UBreadcrumb` | Nested page structures |
| Search + keyboard-driven navigation | `UCommandPalette` | Power users, global search |
| Contextual actions on a trigger element | `UDropdownMenu` | Right-click menus, action buttons |
| Step-by-step process | `UStepper` | Multi-step forms, wizards |

### Rules
- Use `UNavigationMenu` with `orientation="vertical"` in sidebars, default horizontal in headers
- Use `UTabs` when switching views that don't need their own URL
- Use route-based navigation (`to` prop) when views should have shareable URLs
- `UCommandPalette` is typically opened via `Cmd+K` shortcut — use `defineShortcuts` to wire it up

## Inputs

| Need | Component | Why |
|---|---|---|
| Small fixed list (< 10 items) | `USelect` | Native-like, simple, lightweight |
| Searchable list, multiple selection, groups | `USelectMenu` | Rich dropdown with search, multi-select, grouped items |
| Autocomplete / combobox (type + select) | `UInputMenu` | User can type freely AND pick from suggestions |
| Free text entry | `UInput` | Plain text, email, password, search |
| Multi-line text | `UTextarea` | With `autoresize` and `maxrows` |
| Numeric value with +/- controls | `UInputNumber` | Min/max/step constraints |
| Date selection | `UInputDate` | Calendar dropdown, supports ranges |
| Time selection | `UInputTime` | Hour/minute picker, 12/24 hour |
| Tags / multi-value free text | `UInputTags` | Chip-style input with max limit |
| Verification code | `UPinInput` | Fixed-length code entry |
| Boolean toggle | `USwitch` | On/off, enable/disable |
| Boolean checkbox | `UCheckbox` | Single option with label |
| Multiple choices from a list | `UCheckboxGroup` | Multiple selection, vertical or horizontal |
| Single choice from a list (visible) | `URadioGroup` | All options visible, one selected |
| Range value | `USlider` | Min/max with visual track |
| Color value | `UColorPicker` | Hex/RGB/HSL picker |
| File upload | `UFileUpload` | Button or drop area variants |

### Rules
- Use `UAuthForm` for login/signup pages — handles fields, social providers, validation, and layout out of the box
- Use `USelect` for short, known lists (country, status, role)
- Use `USelectMenu` when the list is long or needs search
- Use `UInputMenu` when the user might want to type a value that's not in the list
- Wrap all form inputs in `UFormField` for labels, descriptions, hints, and validation errors
- Group related inline inputs with `UFieldGroup`

## Feedback

| Need | Component | Why |
|---|---|---|
| Ephemeral notification after action | `useToast()` | Auto-dismisses, stacks, non-blocking |
| Inline persistent message | `UAlert` | Stays visible, in-page context |
| App-wide announcement | `UBanner` | Sticky top bar, dismissible |
| Loading state | `USkeleton` | Placeholder shimmer while loading |
| Progress indicator | `UProgress` | Determinate or indeterminate progress |

### Rules
- Use `useToast()` for action feedback: "Item saved", "Email sent", "Error occurred"
- Use `UAlert` for contextual warnings in forms or sections
- Use `UBanner` for site-wide messages (maintenance, new feature)
- Never use a toast for information the user needs to act on — use an alert or modal instead

## Layout containers

| Need | Component | Why |
|---|---|---|
| Grouped content with header/body/footer | `UCard` | Bordered/shadow container with slots |
| Rich content card with icon, badge, links | `UPageCard` | Extended card for grids — supports icon, badge, highlight, links |
| Marketing page section | `UPageSection` | Full-width section with headline, title, features |
| Page hero | `UPageHero` | Title + description + links + optional media |
| Call to action | `UPageCTA` | Highlighted section with action links |
| Feature grid | `UPageGrid` + `UPageCard` | Multi-column card grid |
| Centered content wrapper | `UContainer` | Max-width container |
| Collapsible section | `UCollapsible` | Animated expand/collapse |
| Accordion (multiple collapsibles) | `UAccordion` | FAQ, grouped collapsible content |

### Rules
- Don't overuse `UCard` — plain content with spacing is often better than wrapping everything in cards
- Use `UPageCard` instead of `UCard` when you need icon, badge, highlight, or links — it's designed for feature grids and landing pages
- Use `UPageSection` for marketing/landing page sections, not for app UI
- Use `UContainer` inside `UDashboardPanel` body for consistent content width
