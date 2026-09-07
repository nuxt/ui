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
 */
const { track } = useAnalytics()
const appConfig = useAppConfig()
const colorMode = useColorMode()
const studioIcons = useStudioIcons()
const { primary, primaryColors, neutral, neutralColors, blackAsPrimary, setBlackAsPrimary, radius, radiuses, font, icon, icons, currentDoc } = useTheme()
const { presets, selectedPreset, applyPreset, selectPalette, isCustomPalette, neutralChip, sectionDirty } = useThemeStudio()
// "changed from the preset" per control, the cue the studio toolbar carries
const { groupDirtyFlags } = useThemeStudioToolbar()

// The persisted theme is client-only, resolve after mount so hydration
// matches the server's fallback (the stock preset).
const mounted = useMounted()

const preset = computed(() => (mounted.value ? presets.find(entry => entry.id === selectedPreset.value) : presets[0]))
// the color mode preference is client-only too
const mode = computed(() => (mounted.value ? colorMode.preference : 'system') as 'light' | 'dark' | 'system')
const name = computed(() => `${preset.value?.name ?? 'Custom'} theme`)
const modified = computed(() => Object.values(groupDirtyFlags).some(flag => flag.value))
// the toolbar's colors flag spans both ramps, the two rows each want their own
const primaryDirty = sectionDirty('primary')
const neutralDirty = sectionDirty('neutral')

/** A preset's glyph in the menu; a custom theme wears the studio's palette. */
const presetIcon = (id?: string) => (id && PRESET_ICONS[id]) || studioIcons.palette

// The trigger keeps the palette for the stock theme: the header button stands
// for the theme picker, and a Nuxt mark there would read as a Nuxt link. The
// stock glyph until mounted: this hydrates on idle, after the plugin has
// applied the saved pack, and a class that disagrees with the server's
// markup is never patched during hydration.
const triggerIcon = computed(() => {
  if (!mounted.value) return stockIcons.palette
  const id = preset.value?.id
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

/** Picking an option keeps the menu open, so several settings can be changed in a row. */
const keep = (apply: () => void) => (event: Event) => {
  event.preventDefault()
  apply()
}

/**
 * The menu's width (ui.content) reaches every submenu too, this hands the
 * submenus their own size back.
 */
const submenu = { content: { class: 'w-auto' } }

/**
 * A setting row: its value and swatch ride the trailing slot, its options the
 * submenu. A value changed from the preset shows in primary.
 */
function setting(row: { label: string, icon: string, value: string, dot?: string, dirty?: boolean, children: NonNullable<DropdownMenuItem['children']> }): DropdownMenuItem {
  return { ...row, ...submenu, slot: 'setting' }
}

/** A font as a menu option, previewing its own face through the `font` slot. */
function fontOption(name: string): DropdownMenuItem {
  return {
    label: name,
    slot: 'font',
    type: 'checkbox',
    checked: font.value === name,
    onSelect: keep(() => (font.value = name))
  }
}

/**
 * The shortlist grouped by category, each group led by its label, the way
 * the studio's font picker lays it out. A face picked through the picker's
 * search isn't in the shortlist, it sits on top so its check stays visible.
 */
const fontGroups = computed<DropdownMenuItem[][]>(() => [
  ...(FONTS.some(entry => entry.name === font.value) ? [] : [[fontOption(font.value)]]),
  ...(['Sans', 'Serif', 'Mono'] as const).map(category => [
    { label: category, type: 'label' as const },
    ...FONTS.filter(entry => entry.category === category).map(entry => fontOption(entry.name))
  ])
])

const items = computed<DropdownMenuItem[][]>(() => [[{
  ...submenu,
  label: preset.value?.name ?? 'Custom',
  avatar: chip(preset.value?.id, preset.value?.doc ?? currentDoc()),
  // edits on top of a preset keep its name (it stays the baseline), the name
  // goes primary like a changed value does
  ui: { itemLabel: `font-semibold ${preset.value && modified.value ? 'text-primary' : 'text-highlighted'}` },
  children: presets.map(entry => ({
    label: entry.name,
    type: 'checkbox' as const,
    checked: entry.id === preset.value?.id,
    avatar: chip(entry.id, entry.doc),
    // picking the current preset again reapplies it, dropping the edits on top
    onSelect: keep(() => applyPreset(entry))
  }))
}], [
  setting({
    label: 'Primary',
    dirty: mounted.value && primaryDirty.value,
    icon: studioIcons.brush,
    value: blackAsPrimary.value ? 'Black' : isCustomPalette('primary') ? 'Custom' : upperFirst(paletteLabel(primary.value)),
    dot: 'var(--ui-primary)',
    children: [{
      label: 'Black',
      slot: 'color',
      dot: 'var(--ui-text-highlighted)',
      type: 'checkbox' as const,
      checked: blackAsPrimary.value,
      onSelect: keep(() => setBlackAsPrimary(true))
    }, ...primaryColors.map(color => ({
      label: upperFirst(paletteLabel(color)),
      slot: 'color',
      dot: swatch(color),
      type: 'checkbox' as const,
      checked: !blackAsPrimary.value && !isCustomPalette('primary') && primary.value === color,
      onSelect: keep(() => selectPalette('primary', color))
    }))]
  }),
  setting({
    label: 'Neutral',
    dirty: mounted.value && neutralDirty.value,
    icon: studioIcons.contrast,
    value: isCustomPalette('neutral') ? 'Custom' : upperFirst(paletteLabel(neutral.value)),
    dot: `var(--color-${neutralChip.value}-500)`,
    children: neutralColors.map(color => ({
      label: upperFirst(paletteLabel(color)),
      slot: 'color',
      dot: swatch(color),
      type: 'checkbox' as const,
      checked: !isCustomPalette('neutral') && neutral.value === color,
      onSelect: keep(() => selectPalette('neutral', color))
    }))
  }),
  setting({
    label: 'Font',
    dirty: groupDirtyFlags.font.value,
    icon: studioIcons.text,
    value: font.value,
    children: fontGroups.value
  }),
  setting({
    label: 'Icons',
    dirty: groupDirtyFlags.icons.value,
    icon: studioIcons.shapes,
    value: icons.find(pack => pack.value === icon.value)?.label ?? icon.value,
    children: icons.map(pack => ({
      label: pack.label,
      icon: pack.icon,
      type: 'checkbox' as const,
      checked: icon.value === pack.value,
      onSelect: keep(() => (icon.value = pack.value))
    }))
  }),
  setting({
    label: 'Radius',
    dirty: groupDirtyFlags.radius.value,
    icon: studioIcons.radius,
    value: `${radius.value}rem`,
    children: radiuses.map(value => ({
      label: `${value}rem`,
      type: 'checkbox' as const,
      checked: radius.value === value,
      onSelect: keep(() => (radius.value = value))
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
  return item as { label: string, icon?: string, value?: string, dot?: string, dirty?: boolean }
}

const open = ref(false)

watch(open, (isOpen) => {
  if (isOpen) {
    track('Theme Picker Opened')
    // the font submenu previews each face, load them once the menu is in use
    loadFontPreviews(FONTS.map(entry => entry.name))
  }
})
</script>

<template>
  <UDropdownMenu
    v-model:open="open"
    :items="items"
    :content="{ align: 'end', alignOffset: -4, onInteractOutside: keepPanels }"
    :ui="{ content: 'w-56 min-w-36 max-h-98', label: 'text-xs' }"
  >
    <UTooltip :text="name" ignore-non-keyboard-focus>
      <UButton
        :icon="triggerIcon"
        color="neutral"
        variant="ghost"
        :ui="{ leadingIcon: 'text-primary' }"
        :aria-label="name"
      />
    </UTooltip>

    <template #setting-trailing="{ item }">
      <span class="flex items-center gap-1.5" :class="asRow(item).dirty ? 'text-primary' : 'text-muted'">
        <span v-if="asRow(item).dot" class="size-2 rounded-full" :style="{ backgroundColor: asRow(item).dot }" />
        {{ asRow(item).value }}
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
      <span :style="{ fontFamily: `'${asRow(item).label}', sans-serif` }">{{ asRow(item).label }}</span>
    </template>
  </UDropdownMenu>
</template>
