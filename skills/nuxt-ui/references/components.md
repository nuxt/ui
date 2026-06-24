# Components

Quick-reference index of all 125+ components. For full API docs (props, slots, events, examples), use the MCP `get_component` or `get_component_metadata` tools.

## Layout

| Component | Purpose |
|---|---|
| `UApp` | **Required** root wrapper — toasts, tooltips, overlays, i18n |
| `UHeader` | Responsive header with mobile menu |
| `UFooter` | Footer with left/right/top/bottom slots |
| `UFooterColumns` | Multi-column footer with link groups |
| `UMain` | Main content area |
| `UContainer` | Centered max-width container |
| `ULink` | Enhanced link — NuxtLink/RouterLink with active states |

## Element

| Component | Purpose |
|---|---|
| `UButton` | Buttons — links, actions, icons, loading states |
| `UBadge` | Labels, tags, status indicators |
| `UAvatar` | User photos, initials, icons |
| `UAvatarGroup` | Stacked avatars with `max` limit |
| `UIcon` | Iconify icons (`i-{collection}-{name}`) |
| `UCard` | Bordered container with header/body/footer |
| `UAlert` | Inline messages — info, warning, error, success |
| `UBanner` | App-wide sticky announcement bar |
| `UChip` | Notification dot overlay on children |
| `UKbd` | Keyboard key display |
| `USeparator` | Divider line with optional label |
| `USkeleton` | Loading placeholder |
| `UProgress` | Progress bar |
| `UToast` | Toast notification (shown via `useToast`) |
| `UCalendar` | Date calendar (single, range, multiple) |
| `UCollapsible` | Animated expand/collapse |
| `UFieldGroup` | Group form inputs horizontally |
| `UMarquee` | Scrolling content ticker |
| `UCarousel` | Image/content carousel with autoplay |
| `UEmpty` | Empty state placeholder with icon, title, actions |
| `UError` | Error display with retry action |
| `UScrollArea` | Scrollable area with custom scrollbar |
| `UTimeline` | Timeline display for events and activity |
| `UUser` | User display — avatar + name + description |
| `UTheme` | Theme provider — scoped color overrides for children |

## Form

| Component | Purpose |
|---|---|
| `UAuthForm` | Pre-built auth form with social providers |
| `UInput` | Text input — text, email, password, search |
| `UTextarea` | Multi-line text with autoresize |
| `USelect` | Native-like dropdown for small lists |
| `USelectMenu` | Rich searchable dropdown, multi-select, groups |
| `UInputMenu` | Autocomplete / combobox |
| `UInputNumber` | Numeric input with +/- controls |
| `UInputDate` | Date picker with calendar |
| `UInputTime` | Time picker (12/24h) |
| `UInputTags` | Tag/chip input |
| `UPinInput` | Verification code input |
| `UCheckbox` | Single boolean checkbox |
| `UCheckboxGroup` | Multiple checkboxes |
| `URadioGroup` | Radio button group |
| `USwitch` | Toggle switch |
| `USlider` | Range slider |
| `UColorPicker` | Color picker (hex/rgb/hsl) |
| `UFileUpload` | File upload (button or drop area) |
| `UForm` | Validation wrapper with Standard Schema |
| `UFormField` | Field wrapper with label, hint, errors |

## Overlay

| Component | Purpose |
|---|---|
| `UModal` | Centered dialog — confirmations, forms |
| `USlideover` | Side panel — details, editing |
| `UDrawer` | Bottom sheet — mobile actions |
| `UPopover` | Contextual popup attached to trigger |
| `UTooltip` | Hover/focus hint (non-interactive) |
| `UContextMenu` | Right-click menu |
| `UCommandPalette` | Search + keyboard navigation (Cmd+K) |

## Navigation

| Component | Purpose |
|---|---|
| `USidebar` | Standalone sidebar with header/body/footer |
| `UNavigationMenu` | Primary nav — horizontal or vertical |
| `UTabs` | Tab switcher within a page |
| `UBreadcrumb` | Location hierarchy |
| `UDropdownMenu` | Action menu on a trigger |
| `UPagination` | Page navigation |
| `UStepper` | Multi-step wizard |
| `UAccordion` | Collapsible sections |

## Data

| Component | Purpose |
|---|---|
| `UTable` | Data table (TanStack Table) with sorting, selection, pinning |
| `UTree` | Hierarchical tree view |

## Dashboard

| Component | Purpose |
|---|---|
| `UDashboardGroup` | Root dashboard wrapper |
| `UDashboardSidebar` | Resizable, collapsible sidebar |
| `UDashboardPanel` | Content panel with header/body/footer |
| `UDashboardNavbar` | Panel header bar |
| `UDashboardToolbar` | Filter/action bar below navbar |
| `UDashboardResizeHandle` | Resize handle between panels |
| `UDashboardSidebarToggle` | Mobile sidebar toggle button |
| `UDashboardSearchButton` | Search button for sidebar |
| `UDashboardSearch` | Dashboard-level search overlay |
| `UDashboardSidebarCollapse` | Collapse button for sidebar |

## Page (marketing)

| Component | Purpose |
|---|---|
| `UPage` | Multi-column layout with left/right sidebars |
| `UPageHero` | Hero section — title, description, links, media |
| `UPageSection` | Content section with features grid |
| `UPageCTA` | Call to action block |
| `UPageHeader` | Page title and description |
| `UPageBody` | Main content area |
| `UPageGrid` | Card grid layout |
| `UPageColumns` | Multi-column layout |
| `UPageCard` | Content card for grids |
| `UPageFeature` | Feature item |
| `UPageLogos` | Logo cloud |
| `UPageAside` | Sticky sidebar wrapper |
| `UPageAnchors` | Simple anchor links |
| `UPageLinks` | Related resource links |
| `UPageList` | List layout for page items |

## Blog & Changelog

| Component | Purpose |
|---|---|
| `UBlogPosts` | Blog post grid |
| `UBlogPost` | Individual post card |
| `UChangelogVersions` | Changelog list |
| `UChangelogVersion` | Individual changelog entry |

## Pricing

| Component | Purpose |
|---|---|
| `UPricingPlans` | Pricing plan cards |
| `UPricingPlan` | Individual pricing plan card |
| `UPricingTable` | Feature comparison table |

## Prose — Base Typography

Standard Markdown elements auto-resolved by Comark/Content/MDC. No `::` prefix needed — they map directly from markdown syntax (`# Heading` → `ProseH1`, `**bold**` → `ProseStrong`, etc.). Themed via `appConfig.ui.prose.<name>`.

| Component | Renders | Notable |
|---|---|---|
| `H1` `H2` `H3` `H4` | Headings | H1–H3 get anchor links + TOC entries |
| `P` | Paragraph | |
| `A` | Link | External links get target/rel handling |
| `Strong` | Bold | |
| `Em` | Italic | |
| `Blockquote` | Blockquote | |
| `Hr` | Horizontal rule | |
| `Ul` `Ol` `Li` | Lists | Supports nesting and mixed lists |
| `Table` `Thead` `Tbody` `Tr` `Th` `Td` | Tables | |
| `Img` | Image | Zoom on click (`:zoom="false"` to disable), `@nuxt/image` support |
| `Pre` | Code block | Copy button, filename + icon, line highlighting (`{2,4-6}`), diff |
| `Code` | Inline code | `color` and `lang` props |

## Prose — Feature Components

Nuxt UI-specific Prose components. In markdown files they are used **without the `Prose` prefix** (e.g. `::callout`, `::steps`). In Vue they are referenced as `ProseCallout`, `ProseSteps`, etc. Comark resolves them automatically when `@nuxt/ui` is installed.

Nuxt UI also registers shorthand aliases for `Callout`: `::note`, `::tip`, `::warning`, `::caution` (preset `color` + `icon`).

| Component | Purpose |
|---|---|
| `Callout` | Highlighted note/warning/tip (`color`, `icon`, `to`) |
| `Badge` | Inline badge/tag |
| `Kbd` | Keyboard key |
| `Icon` | Inline Iconify icon |
| `Prompt` | Terminal prompt block |
| `Card` `CardGroup` | Content card and card grid |
| `Steps` | Numbered step list (`level` prop sets heading depth) |
| `Tabs` `TabsItem` | Tabbed content (`sync` for localStorage, `hash` for scroll-on-change) |
| `Accordion` `AccordionItem` | Collapsible accordion sections |
| `Collapsible` | Single collapsible section |
| `Field` `FieldGroup` | Form field display |
| `CodeGroup` | Tabbed code blocks |
| `CodeCollapse` | Collapsible code block |
| `CodeIcon` | File-type icon in code headers |
| `CodePreview` | Code + live rendered preview side by side |
| `CodeTree` | File tree display |
| `Script` | Script injection |

## Content (Nuxt Content)

| Component | Purpose |
|---|---|
| `UContentNavigation` | Sidebar navigation from content |
| `UContentToc` | Table of contents |
| `UContentSurround` | Prev/next navigation |
| `UContentSearch` | Search command palette |
| `UContentSearchButton` | Trigger for content search |

## Chat (AI)

| Component | Purpose |
|---|---|
| `UChatMessages` | Scrollable message list |
| `UChatMessage` | Individual message bubble |
| `UChatReasoning` | Collapsible AI reasoning block |
| `UChatTool` | Tool invocation status |
| `UChatShimmer` | Streaming text animation |
| `UChatPrompt` | Enhanced textarea for prompts |
| `UChatPromptSubmit` | Submit button with status |
| `UChatPalette` | Chat layout for overlays |

## Editor

| Component | Purpose |
|---|---|
| `UEditor` | Rich text editor (JSON/HTML/Markdown) |
| `UEditorToolbar` | Toolbar (fixed/bubble/floating) |
| `UEditorDragHandle` | Block drag-and-drop |
| `UEditorSuggestionMenu` | Slash command menu |
| `UEditorMentionMenu` | @ mention menu |
| `UEditorEmojiMenu` | Emoji picker |

## Color Mode

| Component | Purpose |
|---|---|
| `UColorModeButton` | Toggle button (light/dark) |
| `UColorModeSwitch` | Toggle switch (light/dark) |
| `UColorModeSelect` | Dropdown (light/dark/system) |
| `UColorModeAvatar` | Avatar that changes with color mode |
| `UColorModeImage` | Image that changes with color mode |
