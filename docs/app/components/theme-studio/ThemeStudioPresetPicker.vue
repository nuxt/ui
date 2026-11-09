<script setup lang="ts">
import { upperFirst } from 'scule'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { ThemeDoc } from '../../utils/theme/engine/types'
import { DEFAULT_PRESET_ID } from '../../utils/theme/engine/types'
import { studioIcons as stockIcons } from '../../utils/theme/icons'
import { keepPanels, paletteLabel, rampCssName, themeChipStyle, loadFontPreviews, PRESET_ICONS, FONTS } from '../../utils/theme/studio'

/**
 * The header's theme menu: the applied preset up top with the presets a
 * submenu away, then the theme's headline settings (primary, neutral, font,
 * icons, radius) as rows with a submenu each, color mode as an inline
 * segmented control, and the full studio at the bottom. The header drops this on /theme, where the
 * studio's own toolbar covers it.
 *
 * Hovering an option previews it on the page, picking it applies it. The menu
 * itself keeps showing the applied theme while a preview runs.
 */
const { track } = useAnalytics()
const appConfig = useAppConfig()
const colorMode = useColorMode()
const studioIcons = useStudioIcons()
const { primary, primaryColors, neutral, neutralColors, blackAsPrimary, setBlackAsPrimary, radius, radiuses, font, icon, icons, currentDoc } = useTheme()
const { presets, selectedPreset, applyPreset, selectPalette, isCustomPalette, neutralChip, sectionDirty } = useThemeStudio()
// "changed from the preset" per control, the cue the studio toolbar carries
const { groupDirtyFlags } = useThemeStudioToolbar()
const { show, cancel, commit } = useThemePreview()

// The persisted theme is client-only, resolve once the client has it so
// hydration matches the server's fallback (the stock preset). Shared, or the
// copy the mobile menu mounts would flash the fallback.
const mounted = useThemeMounted()

const preset = computed(() => (mounted.value ? presets.find(entry => entry.id === selectedPreset.value) : presets[0]))
// the color mode preference is client-only too
const mode = computed(() => (mounted.value ? colorMode.preference : 'system') as 'light' | 'dark' | 'system')
const name = computed(() => `${preset.value?.name ?? 'Custom'} theme`)
const modified = computed(() => Object.values(groupDirtyFlags).some(flag => flag.value))
// the toolbar's colors flag spans both ramps, the two rows each want their own
const primaryDirty = sectionDirty('primary')
const neutralDirty = sectionDirty('neutral')

/** What the menu shows of the applied theme: names, checks and dirty cues. */
const live = computed(() => ({
  preset: preset.value,
  // a custom theme's chip is drawn from the live doc
  doc: preset.value?.doc ?? currentDoc(),
  name: name.value,
  modified: modified.value,
  primary: blackAsPrimary.value ? 'black' : isCustomPalette('primary') ? 'custom' : primary.value,
  primaryDirty: mounted.value && primaryDirty.value,
  neutral: isCustomPalette('neutral') ? 'custom' : neutral.value,
  neutralChip: neutralChip.value,
  neutralDirty: mounted.value && neutralDirty.value,
  font: font.value,
  fontDirty: groupDirtyFlags.font.value,
  icon: icon.value,
  iconsDirty: groupDirtyFlags.icons.value,
  radius: radius.value,
  radiusDirty: groupDirtyFlags.radius.value
}))

// held while a preview runs: a check that follows the pointer would stop
// telling which option is applied
const view = useHeldDuringPreview(() => live.value)

/** A preset's glyph in the menu; a custom theme wears the studio's palette. */
const presetIcon = (id?: string) => (id && PRESET_ICONS[id]) || studioIcons.palette

// The trigger keeps the palette for the stock theme: the header button stands
// for the theme picker, and a Nuxt mark there would read as a Nuxt link. The
// stock glyph until mounted: this hydrates on idle, after the plugin has
// applied the saved pack, and a class that disagrees with the server's
// markup is never patched during hydration.
const triggerIcon = computed(() => {
  if (!mounted.value) return stockIcons.palette
  const id = view.value.preset?.id
  return (id && id !== DEFAULT_PRESET_ID && PRESET_ICONS[id]) || studioIcons.palette
})

/** A palette's swatch, through the ramp name the docs expose it under. */
const swatch = (palette: string) => `var(--color-${rampCssName(palette)}-500)`

/** A theme as a chip avatar: its icon in its primary, on that primary's tint. */
function chip(id: string | undefined, doc: ThemeDoc): DropdownMenuItem['avatar'] {
  return {
    icon: presetIcon(id),
    class: 'bg-(image:--chip-bg-light) dark:bg-(image:--chip-bg-dark)',
    style: themeChipStyle(doc),
    ui: { icon: 'text-(--chip-icon-light) dark:text-(--chip-icon-dark)' }
  }
}

/**
 * What an option does, from the key its row carries (`kind:value`), so the
 * hover preview and the pick run the same change.
 */
function action(key: string): (() => void) | undefined {
  const index = key.indexOf(':')
  const kind = key.slice(0, index)
  const value = key.slice(index + 1)
  switch (kind) {
    case 'preset': {
      const entry = presets.find(entry => entry.id === value)
      return entry && (() => applyPreset(entry))
    }
    case 'black': return () => setBlackAsPrimary(true)
    case 'primary':
    case 'neutral': return () => selectPalette(kind, value)
    case 'font': return () => (font.value = value)
    case 'radius': return () => (radius.value = Number(value))
  }
}

/**
 * An option that previews on hover. Its key rides the row's `data-preview`
 * marker, see the focus listener below. Picking it keeps the menu open, so
 * several settings can be changed in a row.
 */
function option(key: string, item: DropdownMenuItem): DropdownMenuItem {
  return {
    slot: 'option',
    ...item,
    preview: key,
    type: 'checkbox',
    onSelect: (event: Event) => {
      event.preventDefault()
      const apply = action(key)
      if (apply) commit(apply)
    }
  }
}

/**
 * The menu's width (ui.content) reaches every submenu too, this hands the
 * submenus their own size back.
 */
const submenu = { content: { class: 'w-auto' } }

/**
 * A setting row: its value and swatch ride the trailing slot, its options the
 * submenu. A value changed from the preset shows in primary. The label keeps
 * its width (the menu's label wrapper is flex-1, it would give way first),
 * a long value ("Saturated mauve") is the part that truncates.
 */
function setting(row: { label: string, icon: string, value: string, dot?: string, dirty?: boolean, children: NonNullable<DropdownMenuItem['children']> }): DropdownMenuItem {
  return { ...row, ...submenu, slot: 'setting', ui: { itemWrapper: 'flex-none', itemTrailing: 'min-w-0' } }
}

/** A font as a menu option, previewing its own face through the `font` slot. */
function fontOption(name: string): DropdownMenuItem {
  return option(`font:${name}`, {
    label: name,
    slot: 'font',
    checked: view.value.font === name
  })
}

/**
 * The shortlist grouped by category, each group led by its label, the way
 * the studio's font picker lays it out. A face picked through the picker's
 * search isn't in the shortlist, it sits on top so its check stays visible.
 */
const fontGroups = computed<DropdownMenuItem[][]>(() => [
  ...(FONTS.some(entry => entry.name === view.value.font) ? [] : [[fontOption(view.value.font)]]),
  ...(['Sans', 'Serif', 'Mono'] as const).map(category => [
    { label: category, type: 'label' as const },
    ...FONTS.filter(entry => entry.category === category).map(entry => fontOption(entry.name))
  ])
])

const items = computed<DropdownMenuItem[][]>(() => [[{
  ...submenu,
  label: view.value.preset?.name ?? 'Custom',
  avatar: chip(view.value.preset?.id, view.value.doc),
  // edits on top of a preset keep its name (it stays the baseline), the name
  // goes primary like a changed value does
  ui: { itemLabel: `font-semibold ${view.value.preset && view.value.modified ? 'text-primary' : 'text-highlighted'}` },
  // picking the current preset again reapplies it, dropping the edits on top
  children: presets.map(entry => option(`preset:${entry.id}`, {
    label: entry.name,
    checked: entry.id === view.value.preset?.id,
    avatar: chip(entry.id, entry.doc)
  }))
}], [
  setting({
    label: 'Primary',
    dirty: view.value.primaryDirty,
    icon: studioIcons.brush,
    value: upperFirst(paletteLabel(view.value.primary)),
    // the live var only for black and a custom ramp, which have no held swatch
    dot: view.value.primary === 'black' || view.value.primary === 'custom' ? 'var(--ui-primary)' : swatch(view.value.primary),
    children: [option('black:', {
      label: 'Black',
      slot: 'color',
      dot: 'var(--ui-text-highlighted)',
      checked: view.value.primary === 'black'
    }), ...primaryColors.map(color => option(`primary:${color}`, {
      label: upperFirst(paletteLabel(color)),
      slot: 'color',
      dot: swatch(color),
      checked: view.value.primary === color
    }))]
  }),
  setting({
    label: 'Neutral',
    dirty: view.value.neutralDirty,
    icon: studioIcons.contrast,
    value: upperFirst(paletteLabel(view.value.neutral)),
    dot: `var(--color-${view.value.neutralChip}-500)`,
    children: neutralColors.map(color => option(`neutral:${color}`, {
      label: upperFirst(paletteLabel(color)),
      slot: 'color',
      dot: swatch(color),
      checked: view.value.neutral === color
    }))
  }),
  setting({
    label: 'Font',
    dirty: view.value.fontDirty,
    icon: studioIcons.text,
    value: view.value.font,
    children: fontGroups.value
  }),
  setting({
    label: 'Icons',
    dirty: view.value.iconsDirty,
    icon: studioIcons.shapes,
    value: icons.find(pack => pack.value === view.value.icon)?.label ?? view.value.icon,
    // no preview: a pack swap re-renders every icon on the page
    children: icons.map(pack => ({
      label: pack.label,
      icon: pack.icon,
      type: 'checkbox' as const,
      checked: view.value.icon === pack.value,
      // through commit all the same, a preview still ending must not restore over it
      onSelect: (event: Event) => {
        event.preventDefault()
        commit(() => (icon.value = pack.value))
      }
    }))
  }),
  setting({
    label: 'Radius',
    dirty: view.value.radiusDirty,
    icon: studioIcons.radius,
    value: `${view.value.radius}rem`,
    children: radiuses.map(value => option(`radius:${value}`, {
      label: `${value}rem`,
      checked: view.value.radius === value
    }))
  })
], [{
  // a label, not an item: the segmented control inside takes the clicks
  type: 'label',
  slot: 'color-mode',
  label: upperFirst(mode.value),
  icon: appConfig.ui.icons[mode.value],
  // a row, not a group label: item size and weight
  ui: { label: 'font-normal text-sm text-default' }
}], [{
  label: 'Edit theme',
  icon: studioIcons.options,
  slot: 'link',
  to: '/theme'
}]])

function asRow(item: unknown) {
  return item as { label: string, icon?: string, value?: string, dot?: string, dirty?: boolean, preview?: string }
}

const open = ref(false)

watch(open, (isOpen) => {
  if (isOpen) {
    track('Theme Picker Opened')
    // the font submenu previews each face, load them once the menu is in use
    loadFontPreviews(FONTS.map(entry => entry.name))
  } else {
    cancel()
  }
})

// The highlighted row holds focus, the pointer moves it as well as the keys,
// so focus is the hover. A row without a marker (a submenu trigger, or the
// menu itself once the pointer leaves an item) ends the preview.
useEventListener('focusin', (event) => {
  if (!open.value) return
  const key = (event.target as Element | null)?.closest?.('[role^="menuitem"]')?.querySelector('[data-preview]')?.getAttribute('data-preview')
  show(key && !isApplied(key) ? action(key) : undefined)
})

/**
 * The applied option previews nothing, like the studio's lists: a preset
 * previewed over its own edits would drop them. Picking it still reapplies.
 */
function isApplied(key: string) {
  const { preset, primary, neutral, font, radius } = view.value
  return [`preset:${preset?.id}`, primary === 'black' ? 'black:' : `primary:${primary}`, `neutral:${neutral}`, `font:${font}`, `radius:${radius}`].includes(key)
}
</script>

<template>
  <UDropdownMenu
    v-model:open="open"
    :items="items"
    :content="{ align: 'start', alignOffset: -4, onInteractOutside: keepPanels }"
    :ui="{ content: 'w-56 min-w-36 max-h-98', label: 'text-xs' }"
  >
    <UTooltip :text="view.name" ignore-non-keyboard-focus>
      <UButton
        :icon="triggerIcon"
        color="neutral"
        variant="ghost"
        :ui="{ leadingIcon: 'text-primary' }"
        :aria-label="view.name"
      />
    </UTooltip>

    <template #setting-trailing="{ item }">
      <span class="flex items-center gap-1.5 min-w-0" :class="asRow(item).dirty ? 'text-primary' : 'text-muted'">
        <span v-if="asRow(item).dot" class="size-2 shrink-0 rounded-full" :style="{ backgroundColor: asRow(item).dot }" />
        <span class="truncate">{{ asRow(item).value }}</span>
      </span>

      <UIcon :name="appConfig.ui.icons.chevronRight" class="size-5 shrink-0 text-dimmed" />
    </template>

    <!-- the swatch sits in the box an item icon takes, so it centers on the label -->
    <template #color-leading="{ item }">
      <span class="size-5 shrink-0 flex items-center justify-center">
        <span class="size-2 rounded-full" :style="{ backgroundColor: asRow(item).dot }" />
      </span>
    </template>

    <template #color-mode="{ item }">
      <UIcon :name="asRow(item).icon" class="size-5 shrink-0 text-dimmed" />
      {{ asRow(item).label }}
      <ThemeStudioColorModeTabs class="ms-auto -my-1.5 [&>div]:ring-0" />
    </template>

    <!-- its own slot: the menu only draws a trailing icon for submenus, and
         appConfig.ui.icons is swapped whole with the pack so this follows it -->
    <template #link-trailing>
      <UIcon :name="appConfig.ui.icons.arrowRight" class="size-5 shrink-0 text-dimmed" />
    </template>

    <template #font-label="{ item }">
      <span :data-preview="asRow(item).preview" :style="{ fontFamily: `'${asRow(item).label}', sans-serif` }">{{ asRow(item).label }}</span>
    </template>

    <!-- the marker the focus listener reads the option's key from -->
    <template #option-label="{ item }">
      <span :data-preview="asRow(item).preview">{{ asRow(item).label }}</span>
    </template>

    <template #color-label="{ item }">
      <span :data-preview="asRow(item).preview">{{ asRow(item).label }}</span>
    </template>
  </UDropdownMenu>
</template>
