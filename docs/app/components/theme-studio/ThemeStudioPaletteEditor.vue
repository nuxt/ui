<script setup lang="ts">
import { useThrottleFn, watchIgnorable } from '@vueuse/core'
import { SHADES, SHADES_FINE, CURVE_DEFAULTS, NEUTRAL_CURVE_DEFAULTS, PALETTE_EFFECT_DEFAULTS, generatePalette, fitPalette, applyPaletteEffects, isDefaultEffects, sampleCurve, shadeX, clampToGamut, formatOklch, parseColor, oklchToRgb, rgbToHex } from '../../utils/theme-engine'
import type { PaletteCurveParams, PaletteEffects, StoredPaletteParams, ColorAlias } from '../../utils/theme-engine'

const props = defineProps<{
  alias: ColorAlias
}>()

const appConfig = useAppConfig()
const { paletteParams, isCustomPalette, paletteShades, setPaletteFromCurve } = useThemeStudio()

const open = defineModel<boolean>('open', { default: false })
const tab = ref<'lightness' | 'chroma' | 'hue'>('lightness')

const tabs = [
  { label: 'Lightness', value: 'lightness' as const },
  { label: 'Chroma', value: 'chroma' as const },
  { label: 'Hue', value: 'hue' as const }
]

function defaults(): PaletteCurveParams {
  return structuredClone(props.alias === 'neutral' ? NEUTRAL_CURVE_DEFAULTS : CURVE_DEFAULTS)
}

/** The stored entry's base curves, without the lens. */
function pickCurves(value: StoredPaletteParams): PaletteCurveParams {
  return structuredClone({ lightness: toRaw(value.lightness), chroma: toRaw(value.chroma), hue: toRaw(value.hue) })
}

// The modifier lens, restored alongside the base so a reload lands exactly
// where the session left off instead of silently baking the sliders in.
const stored = paletteParams.value[props.alias]
const effects = reactive<PaletteEffects>({ ...PALETTE_EFFECT_DEFAULTS, ...(stored?.effects ?? {}) })
const effectAmount = ref(stored?.amount ?? 100)

// Opt-in to the 100-step midpoints (150…850). Off keeps the standard 11
// Tailwind stops; on generates 19 and exposes them to the shade sliders.
const fineStops = ref(stored?.fineStops ?? false)
const stopSet = computed(() => (fineStops.value ? SHADES_FINE : SHADES))

/** The stop-count dropdown — numeric so USelect never has to bind a falsy value. */
const stopItems = [
  { label: '11 stops', value: SHADES.length },
  { label: '19 stops', value: SHADES_FINE.length }
]
const stopCount = computed({
  get: () => (fineStops.value ? SHADES_FINE.length : SHADES.length),
  set: value => (fineStops.value = value === SHADES_FINE.length)
})

/** Base curves the modifiers transform from, so they never compound. */
let seedBase: PaletteCurveParams
  = stored && 'lightness' in stored ? pickCurves(stored) : defaults()
// Stored params may predate the fixed 0–360 axis (or carry unwrapped hues).
normalizeHue(seedBase)

/** The DISPLAYED curves: base with the lens applied — what generates the ramp. */
const params = reactive<PaletteCurveParams>(applyPaletteEffects(seedBase, effects, effectAmount.value))

const active = computed(() => isCustomPalette(props.alias))

const shades = computed(() => generatePalette(params, fineStops.value))
const stopColors = computed(() => stopSet.value.map(shade => shades.value[shade]))
const stopXs = computed(() => stopSet.value.map(shadeX))

/**
 * The strip tiles — just shade + live color. Kept deliberately light (no
 * hex/rgb parse) because it recomputes on every drag frame across all 19
 * stops; the costly parse is deferred to the single open swatch below.
 */
const swatches = computed(() => stopSet.value.map(shade => ({ shade, oklch: shades.value[shade]! })))

const { copy: copyShade } = useClipboard()
const copiedShade = ref<number>()
let copiedTimeout: ReturnType<typeof setTimeout> | undefined

function copySwatch(info: { shade: number, oklch: string }) {
  copyShade(info.oklch)
  copiedShade.value = info.shade
  clearTimeout(copiedTimeout)
  copiedTimeout = setTimeout(() => {
    copiedShade.value = undefined
  }, 1500)
}
onUnmounted(() => clearTimeout(copiedTimeout))

/**
 * Swatch details live in a popover, not a tooltip: the copy/pin buttons
 * inside must be keyboard-reachable, and popover content can take focus.
 * Hover previews it (hand-rolled, with a grace gap so the pointer can cross
 * onto the content); click or Enter pins it open — one pin at a time.
 */
const pinnedShade = ref<number>()
const hoveredShade = ref<number>()
let hoverLeaveTimeout: ReturnType<typeof setTimeout> | undefined

// One popover serves the whole strip (all tiles anchor to it anyway), driven
// by whichever swatch is active — a pin wins over a hover. Rendering a single
// Reka popover instead of one per stop is the bulk of the 19-stop speedup.
const activeShade = computed(() => pinnedShade.value ?? hoveredShade.value)

/**
 * Full detail for the ONE open swatch — the oklch→rgb→hex parse runs here,
 * not across all 19 tiles every frame. Undefined when nothing is open.
 */
const activeSwatch = computed(() => {
  const shade = activeShade.value
  if (shade === undefined) return undefined
  const oklch = (shades.value as Record<number, string>)[shade]
  if (!oklch) return undefined
  const parsed = parseColor(oklch)
  const rgb = parsed ? oklchToRgb(parsed) : undefined
  return {
    shade,
    oklch,
    hex: rgb ? rgbToHex(rgb) : '',
    rgb: rgb ? `rgb(${rgb.map(channel => Math.round(channel * 255)).join(', ')})` : ''
  }
})

// The single popover stays mounted and toggles via `:open` (cheap — one Reka
// instance, not 19). This always-defined mirror lets the slot template read
// details without tripping undefined-narrowing in Vue's slot scope; its
// placeholder is never shown because the popover is closed when inactive.
const swatchDetail = computed(() => activeSwatch.value ?? { shade: -1, oklch: '', hex: '', rgb: '' })

function onSwatchEnter(shade: number) {
  // a pin means "I'm reading this one" — other swatches don't hover-open
  // until it's released (clicking another still migrates the pin)
  if (pinnedShade.value !== undefined && pinnedShade.value !== shade) return
  clearTimeout(hoverLeaveTimeout)
  hoveredShade.value = shade
}

function onSwatchLeave() {
  clearTimeout(hoverLeaveTimeout)
  hoverLeaveTimeout = setTimeout(() => (hoveredShade.value = undefined), 150)
}

onUnmounted(() => clearTimeout(hoverLeaveTimeout))

/** One pin at a time — pinning a swatch unpins any other. */
function togglePin(shade: number) {
  pinnedShade.value = pinnedShade.value === shade ? undefined : shade
}

/**
 * Reka emits update:open(false) for trigger clicks as well as dismissals —
 * clearing the pin here would race togglePin into re-pinning. Only hover
 * intent clears; the pin is released by togglePin or Esc alone.
 */
function onSwatchOpenUpdate(shade: number, open: boolean) {
  if (open) return
  if (hoveredShade.value === shade) hoveredShade.value = undefined
}

function onSwatchEscape(shade: number) {
  if (pinnedShade.value === shade) pinnedShade.value = undefined
}

/**
 * A closing hover-popover would return focus to its trigger tile — Reka
 * treats that focusin as focus-outside on the popover that just opened and
 * dismisses it (hover A→B closed B). Only keyboard flows (focus actually
 * inside the closing content) keep the focus return.
 */
function onSwatchCloseAutoFocus(event: Event) {
  // "inside a popper wrapper" is not enough — the whole palette editor
  // lives in the Colors panel's wrapper. Only a swatch DETAIL popover
  // (recognizable by its copy button) marks a keyboard flow.
  const wrapper = document.activeElement?.closest('[data-reka-popper-content-wrapper]')
  if (!wrapper?.querySelector('[aria-label^="Copy oklch"]')) {
    event.preventDefault()
  }
}

/** The strip element — every swatch popover anchors to it, not its tile. */
const stripRef = useTemplateRef<HTMLElement>('stripRef')
const stripEl = computed(() => stripRef.value ?? undefined)

/**
 * Every axis is a fixed 1:1 window — the full physical range fits the
 * canvas, so dragging never pans or rescales under the pointer. Hue params
 * are normalized into 0–360 on seed (cyclic, so shifting by full turns is
 * color-identical; fitPalette unwraps across the seam), but a seam-crossing
 * fit legitimately leaves individual points outside [0, 360] — the window
 * stretches once, at seed, to include them, or the drag clamp would snap a
 * merely-grabbed handle back into range and shift the color uninvited.
 */
const seedHues = [params.hue.y0, params.hue.y1, params.hue.p1y, params.hue.p2y]
const windows = {
  lightness: { min: 0, max: 1 },
  chroma: { min: 0, max: 0.35 },
  hue: {
    min: Math.min(0, Math.floor(Math.min(...seedHues) / 10) * 10),
    max: Math.max(360, Math.ceil(Math.max(...seedHues) / 10) * 10)
  }
}

/**
 * The color field behind the active tab's curve: columns follow the ramp,
 * rows sweep the edited channel across its window (top = max) while the
 * other two channels track the live curves — each point shows the color
 * that dragging the curve there would produce, gamut clamp included.
 */
const FIELD_COLUMNS = 24
const FIELD_ROWS = 12
const CHANNEL_KEYS = { lightness: 'l', chroma: 'c', hue: 'h' } as const

// The field's 288 gamut-mapped cells are the editor's single biggest chunk of
// per-frame work. It's a background aid, so feed it a throttled snapshot of
// the curves: it repaints a few times a second while dragging and settles
// exactly on release, while the curve line and stops track the pointer live.
const fieldCurves = ref<PaletteCurveParams>(structuredClone(toRaw(params)))
const syncFieldCurves = useThrottleFn(() => {
  fieldCurves.value = structuredClone(toRaw(params))
}, 110, true, true)
watch(params, () => syncFieldCurves(), { deep: true })

const field = computed(() => {
  const channel = tab.value
  const { min, max } = windows[channel]
  const curves = fieldCurves.value

  // Fence-post: column i is sampled AT ramp position i/(n-1) — the editor
  // draws each column centered on that plot x, endpoints under the
  // endpoint controls.
  return Array.from({ length: FIELD_COLUMNS }, (_, columnIndex) => {
    const x = columnIndex / (FIELD_COLUMNS - 1)
    const base = {
      l: sampleCurve(x, curves.lightness),
      c: Math.max(0, sampleCurve(x, curves.chroma)),
      h: sampleCurve(x, curves.hue)
    }

    return Array.from({ length: FIELD_ROWS }, (_, rowIndex) => {
      const value = max - (rowIndex / (FIELD_ROWS - 1)) * (max - min)
      return formatOklch(clampToGamut({ ...base, [CHANNEL_KEYS[channel]]: value }))
    })
  })
})

function normalizeHue(values: PaletteCurveParams) {
  const points = [values.hue.y0, values.hue.y1, values.hue.p1y, values.hue.p2y]
  const mean = points.reduce((sum, value) => sum + value, 0) / points.length
  const shift = -360 * Math.floor(mean / 360)
  if (shift !== 0) {
    values.hue.y0 += shift
    values.hue.y1 += shift
    values.hue.p1y += shift
    values.hue.p2y += shift
  }
}

// Throttled (not debounced) so the theme streams live while dragging a
// curve — the trailing call catches the release position. With a neutral
// lens the base simply tracks the edited curves.
const throttledApply = useThrottleFn(() => {
  if (!effectsDirty.value) {
    seedBase = structuredClone(toRaw(params))
  }
  setPaletteFromCurve(props.alias, structuredClone(seedBase), { ...effects }, effectAmount.value, fineStops.value)
}, 60, true, true)

// Toggling the stop set isn't a curve edit, so drive an apply directly to
// regenerate the ramp (and persist the choice) at the new granularity.
watch(fineStops, () => throttledApply())

// Programmatic writes into `params` (seeding, external sync) must not
// live-apply — only user edits do. watchIgnorable scopes the suppression
// to the seed's own writes instead of a whole tick.
const { ignoreUpdates } = watchIgnorable(params, () => {
  throttledApply()
})

function seed(values: PaletteCurveParams) {
  const next = structuredClone(toRaw(values))
  normalizeHue(next)
  seedBase = structuredClone(next)
  Object.assign(effects, PALETTE_EFFECT_DEFAULTS)
  effectAmount.value = 100
  // A fresh fit is 11-stop; seedFromCurrent re-detects midpoints after.
  fineStops.value = false
  ignoreUpdates(() => {
    Object.assign(params, next)
  })
}

// While dragging, a global class turns on short color transitions so the
// page glides between throttle ticks instead of stepping.
let dragEndTimeout: ReturnType<typeof setTimeout> | undefined

function onDragStart() {
  // Editing a curve commits the lens: the base becomes the curves on
  // screen (the look doesn't change) and the modifier sliders reset, so
  // a later modifier edit can never throw the drag away.
  if (effectsDirty.value) {
    seedBase = structuredClone(toRaw(params))
    Object.assign(effects, PALETTE_EFFECT_DEFAULTS)
    effectAmount.value = 100
  }
  clearTimeout(dragEndTimeout)
  document.documentElement.classList.add('theme-studio-dragging')
}

function onDragEnd() {
  dragEndTimeout = setTimeout(() => {
    document.documentElement.classList.remove('theme-studio-dragging')
  }, 200)
}

onUnmounted(() => {
  clearTimeout(dragEndTimeout)
  if (import.meta.client) {
    document.documentElement.classList.remove('theme-studio-dragging')
  }
})

/** Fit curves from whatever palette the alias currently shows. */
function seedFromCurrent() {
  const name = (appConfig.ui.colors as Record<string, string>)[props.alias]
  if (!name) return

  const source = paletteShades(name)
  if (source) {
    seed(fitPalette(source))
    // A ramp that already carries midpoints (an imported fine palette) keeps
    // them, so opening the editor doesn't silently narrow it back to 11.
    if (source[150] !== undefined) fineStops.value = true
  }
}

// External writes to the stored entry — reflect them here, lens included.
// The effective-curve comparison is what breaks the echo loop for our own
// throttled applies (the callback runs queued, after any sync flag reset).
watch(() => paletteParams.value[props.alias], (value) => {
  if (!value || !('lightness' in value)) return
  const effective = applyPaletteEffects(pickCurves(value), value.effects, value.amount)
  if (JSON.stringify(effective) === JSON.stringify(toRaw(params))) return

  seedBase = pickCurves(value)
  normalizeHue(seedBase)
  Object.assign(effects, PALETTE_EFFECT_DEFAULTS, value.effects ?? {})
  effectAmount.value = value.amount ?? 100
  fineStops.value = value.fineStops ?? false
  ignoreUpdates(() => {
    Object.assign(params, applyPaletteEffects(seedBase, effects, effectAmount.value))
  })
})

// While inactive, follow the selected palette so opening the editor starts
// from the curves of the color already on screen. Pin/hover tooltip state
// resets with it: the swatch strip unmounts with the fold, so a stale pin
// would pop a tooltip for a palette the user never pinned.
watch([() => (appConfig.ui.colors as Record<string, string>)[props.alias], open], ([, isOpen]) => {
  pinnedShade.value = undefined
  hoveredShade.value = undefined
  if (isOpen && !active.value) {
    seedFromCurrent()
  }
})

/* ---------------------------------------------------------- modifiers -- */

/** The modifiers fold — closed by default like the other advanced panels. */
const modifiersOpen = ref(false)

const effectRows = [
  { key: 'lightness', label: 'Lightness', min: -30, max: 30, step: 1, unit: '%' },
  { key: 'contrast', label: 'Contrast', min: -50, max: 50, step: 1, unit: '%' },
  { key: 'saturation', label: 'Saturation', min: -100, max: 200, step: 1, unit: '%' },
  { key: 'hueShift', label: 'Hue', min: -180, max: 180, step: 1, unit: '°' }
] as const

/** Re-derive the displayed curves from the base — a user edit, live-applied. */
function applyEffects() {
  Object.assign(params, applyPaletteEffects(seedBase, effects, effectAmount.value))
}

const effectsDirty = computed(() => !isDefaultEffects(effects, effectAmount.value))

function resetEffects() {
  Object.assign(effects, PALETTE_EFFECT_DEFAULTS)
  effectAmount.value = 100
  applyEffects()
}
</script>

<template>
  <!-- unmount-on-hide (the default) matches the old v-if: each open reseeds fresh -->
  <UCollapsible :open="open">
    <template #content>
      <div class="mt-2.5 flex flex-col gap-2.5 pb-1">
        <UTabs
          v-model="tab"
          :items="tabs"
          :content="false"
          size="xs"
          color="neutral"
        />

        <div>
          <ThemeStudioCurveEditor
            v-model="params[tab]"
            :y-min="windows[tab].min"
            :y-max="windows[tab].max"
            :stop-colors="stopColors"
            :stop-xs="stopXs"
            :field="field"
            @drag-start="onDragStart"
            @drag-end="onDragEnd"
          />

          <!-- Plain tiles recolor live every frame (cheap); a single popover,
               anchored to the strip and driven by the active swatch, carries
               the details — 1 Reka instance instead of 19. -->
          <div ref="stripRef" class="flex rounded-b-sm overflow-hidden ring ring-default">
            <button
              v-for="info in swatches"
              :key="info.shade"
              type="button"
              class="aspect-square flex-1"
              :style="{ backgroundColor: info.oklch }"
              :aria-label="`Shade ${info.shade}: ${info.oklch}`"
              :aria-pressed="pinnedShade === info.shade"
              @click="togglePin(info.shade)"
              @mouseenter="onSwatchEnter(info.shade)"
              @mouseleave="onSwatchLeave"
            />
          </div>

          <UPopover
            arrow
            :open="!!activeSwatch"
            :reference="stripEl"
            :content="{
              side: 'top',
              onEscapeKeyDown: () => onSwatchEscape(swatchDetail.shade),
              onCloseAutoFocus: onSwatchCloseAutoFocus,
              sideOffset: 0,
              // hover-opened popovers must not steal focus; a pinned one
              // takes it so Tab lands on the copy/pin buttons
              onOpenAutoFocus: pinnedShade === swatchDetail.shade ? undefined : (event: Event) => event.preventDefault(),
              // pinning means pinned: clicks elsewhere (curve drags,
              // sliders) must not dismiss — only Esc, unpin or another pin
              onInteractOutside: pinnedShade === swatchDetail.shade ? (event: Event) => event.preventDefault() : undefined,
              onFocusOutside: pinnedShade === swatchDetail.shade ? (event: Event) => event.preventDefault() : undefined
            }"
            @update:open="onSwatchOpenUpdate(swatchDetail.shade, $event)"
          >
            <template #content>
              <div
                class="px-2 py-1.5 text-xs font-mono flex flex-col gap-0.5"
                @mouseenter="onSwatchEnter(swatchDetail.shade)"
                @mouseleave="onSwatchLeave"
              >
                <div class="flex items-center justify-between gap-3">
                  <span class="font-semibold">{{ swatchDetail.shade }}</span>

                  <div class="flex items-center">
                    <UTooltip text="Copy Oklch">
                      <UButton
                        size="xs"
                        color="neutral"
                        square
                        variant="ghost"
                        :ui="{ leadingIcon: 'size-3' }"
                        :icon="copiedShade === swatchDetail.shade ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                        :aria-label="`Copy ${swatchDetail.oklch}`"
                        @click="copySwatch(swatchDetail)"
                      />
                    </UTooltip>

                    <UTooltip :text="pinnedShade === swatchDetail.shade ? 'Unpin' : 'Pin open'">
                      <UButton
                        size="xs"
                        color="neutral"
                        square
                        variant="ghost"
                        active-color="primary"
                        active-variant="ghost"
                        :active="pinnedShade === swatchDetail.shade"
                        :ui="{ leadingIcon: 'size-3' }"
                        :icon="pinnedShade === swatchDetail.shade ? 'i-lucide-pin-off' : 'i-lucide-pin'"
                        :aria-label="pinnedShade === swatchDetail.shade ? 'Unpin details' : 'Pin details open'"
                        @click="togglePin(swatchDetail.shade)"
                      />
                    </UTooltip>
                  </div>
                </div>
                <span>{{ swatchDetail.oklch }}</span>
                <span class="text-muted">{{ swatchDetail.hex }} · {{ swatchDetail.rgb }}</span>
              </div>
            </template>
          </UPopover>
        </div>

        <!-- Layered modifiers, each recomputed from the fitted base. The
             whole trigger group toggles the fold; the reset stops the click
             so it only resets. -->
        <UCollapsible v-model:open="modifiersOpen">
          <div class="flex items-center gap-1">
            <UButton
              label="Modifiers"
              :icon="modifiersOpen ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
              color="neutral"
              variant="ghost"
              size="sm"
              block
              class="flex-1 justify-start"
            />
            <!-- Stop-count picker rides the Modifiers row so it never
                 overlaps the curve handles or swatches above. Its own click
                 must not toggle the fold. -->
            <UTooltip text="Shade stops">
              <USelect
                v-model="stopCount"
                :items="stopItems"
                size="sm"
                variant="ghost"
                class="shrink-0"

                @click.stop
              />
            </UTooltip>
            <!-- Modifiers live outside the doc (presets land with them
                 zeroed), so resetting to defaults IS resetting to the
                 preset — only the dirty styling mirrors the section resets. -->
            <UTooltip :text="effectsDirty ? 'Reset modifiers' : 'No modifiers active'">
              <UButton
                icon="i-lucide-rotate-ccw"
                :color="effectsDirty ? 'primary' : 'neutral'"
                variant="ghost"
                size="sm"
                :disabled="!effectsDirty"
                aria-label="Reset modifiers"
                @click.stop="resetEffects"
              />
            </UTooltip>
          </div>

          <template #content>
            <div class="flex flex-col gap-1.5 pt-2 px-1">
              <ThemeStudioSliderRow
                v-model="effectAmount"
                label="Effect"
                icon="i-lucide-eye"
                :min="0"
                :max="200"
                :step="1"
                unit="%"
                @update:model-value="applyEffects()"
              />

              <ThemeStudioSliderRow
                v-for="row in effectRows"
                :key="row.key"
                v-model="effects[row.key]"
                :label="row.label"
                :min="row.min"
                :max="row.max"
                :step="row.step"
                :unit="row.unit"
                @update:model-value="applyEffects()"
              />
            </div>
          </template>
        </UCollapsible>
      </div>
    </template>
  </UCollapsible>
</template>
