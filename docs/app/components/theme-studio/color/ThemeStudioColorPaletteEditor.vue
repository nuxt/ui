<script setup lang="ts">
import { useThrottleFn, watchIgnorable } from '@vueuse/core'
import { SHADES, CURVE_DEFAULTS, NEUTRAL_CURVE_DEFAULTS, PALETTE_EFFECT_DEFAULTS, generatePalette, buildRampSampler, fitPalette, applyPaletteEffects, isDefaultEffects, sampleCurve, shadeX, clampToGamut, formatOklch, parseColor, oklchToRgb, rgbToHex } from '../../../utils/theme/engine'
import type { PaletteCurveParams, PaletteEffects, StoredPaletteParams, PalettePin, Shade, ColorAlias } from '../../../utils/theme/engine'

const props = defineProps<{
  alias: ColorAlias
}>()

const appConfig = useAppConfig()
const studioIcons = useStudioIcons()
const { paletteParams, isCustomPalette, paletteShades, setPaletteFromCurve } = useThemeStudio()

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

// Elements read off the reactive ref are Vue Proxies toRaw doesn't unwrap,
// structuredClone would throw. Rebuild from scalars.
function plainPins(pins: readonly PalettePin[]): PalettePin[] {
  return pins.map(pin => ({ shade: pin.shade, l: pin.l, c: pin.c, h: pin.h }))
}

// Restore the lens too, so a reload doesn't silently bake the sliders in.
const stored = paletteParams.value[props.alias]
const effects = reactive<PaletteEffects>({ ...PALETTE_EFFECT_DEFAULTS, ...(stored?.effects ?? {}) })
const effectAmount = ref(stored?.amount ?? 100)

// Stops locked to an exact colour, the curves bend to pass through them.
// Kept a plain cloneable array (persisted, fed to generatePalette).
const pins = ref<PalettePin[]>(stored?.pins ? plainPins(stored.pins) : [])
// shade → pin lightness: `has` answers "pinned?", the badge reads L for contrast
const pinnedShades = computed(() => new Map(pins.value.map(pin => [pin.shade, pin.l])))

// L above which a stop takes the dark badge. Whole class strings, tailwind's
// scanner only sees literals.
const LIGHT_STOP_L = 0.62

// The neutral end that contrasts with the stop, a `difference` blend vanishes
// at mid lightness and inverts saturated hues.
function pinBadgeClass(shade: number) {
  const lightness = pinnedShades.value.get(shade as Shade) ?? 0
  return lightness > LIGHT_STOP_L ? 'text-(--ui-color-neutral-950)' : 'text-(--ui-color-neutral-50)'
}

function setPin(shade: number, oklch: string) {
  const parsed = parseColor(oklch)
  if (!parsed) return false
  const next = pins.value.filter(pin => pin.shade !== shade)
  next.push({ shade: shade as Shade, l: parsed.l, c: parsed.c, h: parsed.h })
  pins.value = next
  return true
}

function removePin(shade: number) {
  pins.value = pins.value.filter(pin => pin.shade !== shade)
}

/** Toggle a lock; pinning grabs whatever colour the stop currently shows. */
function togglePinExact(shade: number) {
  if (pinnedShades.value.has(shade as Shade)) removePin(shade)
  else setPin(shade, shades.value[shade as Shade] ?? '')
}

/** Base curves the modifiers transform from, so they never compound. */
let seedBase: PaletteCurveParams
  = stored && 'lightness' in stored ? pickCurves(stored) : defaults()
// Stored params may predate the fixed 0–360 axis (or carry unwrapped hues).
normalizeHue(seedBase)

/** The DISPLAYED curves: base with the lens applied, what generates the ramp. */
const params = reactive<PaletteCurveParams>(applyPaletteEffects(seedBase, effects, effectAmount.value))

const active = computed(() => isCustomPalette(props.alias))

const shades = computed(() => generatePalette(params, pins.value))
const stopColors = computed(() => SHADES.map(shade => shades.value[shade]))
const stopXs = SHADES.map(shadeX)
const stopPinned = computed(() => SHADES.map(shade => pinnedShades.value.has(shade)))
// Pin-corrected values: the editor draws the polyline so the line bends THROUGH
// pinned stops. Sampler built on the reactive params so a handle drag redraws.
const CHANNEL_KEY = { lightness: 'l', chroma: 'c', hue: 'h' } as const
// one pin-corrected sampler per (curves, pins) change, both consumers below read it
const rampSampler = computed(() => buildRampSampler(params, pins.value))
const stopValues = computed(() => {
  const key = CHANNEL_KEY[tab.value]
  return SHADES.map(shade => rampSampler.value(shadeX(shade))[key])
})
const actualCurve = computed(() => {
  // no pins → no correction, draw the exact bézier
  if (!pins.value.length) return undefined
  const key = CHANNEL_KEY[tab.value]
  return Array.from({ length: 48 }, (_, i) => {
    const x = i / 47
    return { x, v: rampSampler.value(x)[key] }
  })
})

// Kept light (no hex/rgb parse), recomputes every drag frame across up to 91
// stops; the parse is deferred to the single open swatch.
const swatches = computed(() => SHADES.map(shade => ({ shade, oklch: shades.value[shade]! })))

// useClipboard's `copied` already resets itself after 1.5s; the shade ref
// only remembers WHICH tile the checkmark belongs to
const { copy: copyShade, copied: shadeCopied } = useClipboard()
const copiedShade = ref<number>()

function copySwatch(info: { shade: number, oklch: string }) {
  copyShade(info.oklch)
  copiedShade.value = info.shade
}

// A popover, not a tooltip: the copy button and inputs must take focus. Hover
// previews it (with a grace gap); click STICKS it open for typing. Stick ≠ pin:
// a stick keeps the popover visible, a pin locks the stop's colour.
const stuckShade = ref<number>()
const hoveredShade = ref<number>()
let hoverLeaveTimeout: ReturnType<typeof setTimeout> | undefined

// One popover serves the whole strip (stuck wins over hover), a single Reka
// instance instead of one per stop is the bulk of the 19-stop speedup.
const activeShade = computed(() => stuckShade.value ?? hoveredShade.value)

// Full detail for the ONE open swatch, the oklch→rgb→hex parse runs here only.
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
    rgb: rgb ? `rgb(${rgb.map(channel => Math.round(channel * 255)).join(', ')})` : '',
    pinned: pinnedShades.value.has(shade as Shade)
  }
})

// Always-defined mirror; holds the last detail so content doesn't flash while
// the popover animates closed.
const lastDetail = ref({ shade: -1, oklch: '', hex: '', rgb: '', pinned: false })
watch(activeSwatch, (value) => {
  if (value) lastDetail.value = value
})
const swatchDetail = computed(() => activeSwatch.value ?? lastDetail.value)

function onSwatchEnter(shade: number) {
  // a stuck swatch blocks other hover-opens (clicking another migrates the stick)
  if (stuckShade.value !== undefined && stuckShade.value !== shade) return
  clearTimeout(hoverLeaveTimeout)
  hoveredShade.value = shade
}

function onSwatchLeave() {
  clearTimeout(hoverLeaveTimeout)
  hoverLeaveTimeout = setTimeout(() => (hoveredShade.value = undefined), 150)
}

onUnmounted(() => clearTimeout(hoverLeaveTimeout))

/** Click a swatch to keep its popover open (for editing); click again to release. */
function toggleStuck(shade: number) {
  stuckShade.value = stuckShade.value === shade ? undefined : shade
}

/** Pin the stop to whatever format was typed; keep the popover stuck open. */
function commitSwatchColor(shade: number, value: string): boolean {
  const ok = setPin(shade as Shade, value)
  if (ok) stuckShade.value = shade
  return ok
}

// A rejected value restates the field's canonical text, the box never shows
// an unparseable string.
function onColorCommit(shade: number, field: 'oklch' | 'hex' | 'rgb', event: Event) {
  const input = event.target as HTMLInputElement
  if (!commitSwatchColor(shade, input.value)) {
    input.value = swatchDetail.value[field]
  }
}

// Reka emits update:open(false) for trigger clicks too, clearing the stick
// here would race toggleStuck. Only hover clears; toggleStuck/Esc release.
function onSwatchOpenUpdate(shade: number, open: boolean) {
  if (open) return
  if (hoveredShade.value === shade) hoveredShade.value = undefined
}

function onSwatchEscape(shade: number) {
  if (stuckShade.value === shade) stuckShade.value = undefined
}

// A closing hover-popover returns focus to its trigger tile, Reka reads that
// focusin as focus-outside on the newly-opened one and dismisses it (hover A→B
// closed B). Keep the focus return only for keyboard flows.
function onSwatchCloseAutoFocus(event: Event) {
  // the whole editor sits in the Colors panel's popper wrapper, only a swatch
  // detail popover (has a copy button) marks a keyboard flow
  const wrapper = document.activeElement?.closest('[data-reka-popper-content-wrapper]')
  if (!wrapper?.querySelector('[aria-label^="Copy oklch"]')) {
    event.preventDefault()
  }
}

/**
 * The canvas and strip together, not the strip alone: one popover serves every
 * tile, and the strip is an aspect-11/1 sliver, so aligning against it left the
 * detail pinned to the bottom of the editor whatever `align` said.
 */
const anchorRef = useTemplateRef<HTMLElement>('anchorRef')
const anchorEl = computed(() => anchorRef.value ?? undefined)

// Hue normalizes to 0–360 at seed, but a seam-crossing fit can leave points
// outside, stretch the window once, at seed, or the drag clamp would snap a
// merely-grabbed handle back into range.
function hueWindow(hue: PaletteCurveParams['hue']) {
  const points = [hue.y0, hue.y1, hue.p1y, hue.p2y]
  return {
    min: Math.min(0, Math.floor(Math.min(...points) / 10) * 10),
    max: Math.max(360, Math.ceil(Math.max(...points) / 10) * 10)
  }
}
// Fixed 1:1 windows, dragging never pans or rescales under the pointer.
const windows = ref({
  lightness: { min: 0, max: 1 },
  chroma: { min: 0, max: 0.35 },
  hue: hueWindow(params.hue)
})

// The colour field behind the curve: columns follow the ramp, rows sweep the
// edited channel (top = max), each cell is the colour dragging there would give.
const FIELD_COLUMNS = 24
const FIELD_ROWS = 12

// The 288 gamut-mapped cells are the biggest per-frame cost, feed a throttled
// snapshot; the curve and stops track the pointer live, the field settles on release.
const fieldCurves = ref<PaletteCurveParams>(structuredClone(toRaw(params)))
const syncFieldCurves = useThrottleFn(() => {
  fieldCurves.value = structuredClone(toRaw(params))
}, 110, true, true)
watch(params, () => syncFieldCurves(), { deep: true })

const field = computed(() => {
  const channel = tab.value
  const { min, max } = windows.value[channel]
  const curves = fieldCurves.value

  // column i sampled AT x = i/(n-1), so endpoints sit under the endpoint controls
  return Array.from({ length: FIELD_COLUMNS }, (_, columnIndex) => {
    const x = columnIndex / (FIELD_COLUMNS - 1)
    const base = {
      l: sampleCurve(x, curves.lightness),
      c: Math.max(0, sampleCurve(x, curves.chroma)),
      h: sampleCurve(x, curves.hue)
    }

    return Array.from({ length: FIELD_ROWS }, (_, rowIndex) => {
      const value = max - (rowIndex / (FIELD_ROWS - 1)) * (max - min)
      return formatOklch(clampToGamut({ ...base, [CHANNEL_KEY[channel]]: value }))
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

// The reactive apply reparses the custom-colours <style> and persists, fine
// once, dominant at drag rate, so live drags ride the CSSOM fast path below
// and only land here on the first edit and on release.
const isDragging = ref(false)
const customName = computed(() => `custom-${props.alias}`)

function applyReactive() {
  setPaletteFromCurve(props.alias, structuredClone(seedBase), { ...effects }, effectAmount.value, plainPins(pins.value))
  clearCssomPreview()
}

// Fast path: inline :root custom properties outrank the <style> rule, no
// reparse, no persist. Only valid once the alias already resolves through
// --color-custom-* (the first edit takes the reactive path to create it).
function previewViaCssom() {
  if (!import.meta.client) return
  const root = document.documentElement.style
  const ramp = shades.value
  for (const shade of SHADES) root.setProperty(`--color-${customName.value}-${shade}`, ramp[shade]!)
}

function clearCssomPreview() {
  if (!import.meta.client) return
  const root = document.documentElement.style
  for (const shade of SHADES) root.removeProperty(`--color-${customName.value}-${shade}`)
}

// Throttled (not debounced) so the theme streams while dragging; the trailing
// call catches the release position.
const throttledApply = useThrottleFn(() => {
  if (!effectsDirty.value) {
    seedBase = structuredClone(toRaw(params))
  }
  if (isDragging.value && active.value) {
    previewViaCssom()
  } else {
    applyReactive()
  }
}, 60, true, true)

// Any of these reshape the ramp. Programmatic writes (seeding, undo/redo sync)
// wrap in ignoreUpdates so restores never fire an apply that clobbers them.
const { ignoreUpdates } = watchIgnorable([() => params, pins], () => {
  throttledApply()
}, { deep: true })

function seed(values: PaletteCurveParams) {
  const next = structuredClone(toRaw(values))
  normalizeHue(next)
  seedBase = structuredClone(next)
  // A seed is never a user edit, an apply here would e.g. turn a stock ramp
  // custom the instant the editor opens.
  ignoreUpdates(() => {
    Object.assign(effects, PALETTE_EFFECT_DEFAULTS)
    effectAmount.value = 100
    pins.value = []
    Object.assign(params, next)
  })
  // this seed may cross the hue seam differently
  windows.value.hue = hueWindow(next.hue)
}

function onDragStart() {
  // Editing a curve commits the lens (look unchanged, sliders reset) so a
  // later modifier edit can't throw the drag away.
  if (effectsDirty.value) {
    seedBase = structuredClone(toRaw(params))
    Object.assign(effects, PALETTE_EFFECT_DEFAULTS)
    effectAmount.value = 100
  }
  isDragging.value = true
}

function onDragEnd() {
  isDragging.value = false
  // Land once on the reactive path, a pending trailing throttle can't be
  // relied on to fire after release; applyReactive clears the inline preview.
  if (!effectsDirty.value) {
    seedBase = structuredClone(toRaw(params))
  }
  // an inactive alias still wrote preview vars during the drag, clear directly
  if (active.value) applyReactive()
  else clearCssomPreview()
}

onUnmounted(() => {
  // the fold can unmount mid-drag, don't strand inline preview vars
  if (import.meta.client) clearCssomPreview()
})

/** Fit curves from whatever palette the alias currently shows. */
function seedFromCurrent() {
  const name = (appConfig.ui.colors as Record<string, string>)[props.alias]
  if (!name) return

  const source = paletteShades(name)
  if (source) seed(fitPalette(source))
}

// External writes to the stored entry, reflect them here, lens included.
watch(() => paletteParams.value[props.alias], (value) => {
  if (!value || !('lightness' in value)) return
  // Echo guard: skip only when curves AND pins match, curves alone would
  // swallow a pin-only undo/redo.
  const effective = applyPaletteEffects(pickCurves(value), value.effects, value.amount)
  const curvesMatch = JSON.stringify(effective) === JSON.stringify(toRaw(params))
  const pinsMatch = JSON.stringify(value.pins ?? []) === JSON.stringify(toRaw(pins.value))
  if (curvesMatch && pinsMatch) return

  seedBase = pickCurves(value)
  normalizeHue(seedBase)
  // must not echo back an apply that clobbers what's being restored
  ignoreUpdates(() => {
    Object.assign(effects, PALETTE_EFFECT_DEFAULTS, value.effects ?? {})
    effectAmount.value = value.amount ?? 100
    pins.value = value.pins ? plainPins(value.pins) : []
    Object.assign(params, applyPaletteEffects(seedBase, effects, effectAmount.value))
  })
  // a restored curve can cross the hue seam elsewhere
  windows.value.hue = hueWindow(toRaw(params).hue)
})

// Seed from the curves of the colour on screen, unless the editor already OWNS
// curves for this alias: a preset's custom ramp is active but unowned, so it
// still gets fitted. Immediate because the popover mounts this on open.
watch(() => (appConfig.ui.colors as Record<string, string>)[props.alias], () => {
  stuckShade.value = undefined
  hoveredShade.value = undefined
  const owned = paletteParams.value[props.alias]
  if (!(owned && 'lightness' in owned)) {
    seedFromCurrent()
  }
}, { immediate: true })

/* ---------------------------------------------------------- modifiers -- */

const effectRows = [
  { key: 'lightness', label: 'Lightness', min: -30, max: 30, step: 1, unit: '%' },
  { key: 'contrast', label: 'Contrast', min: -50, max: 50, step: 1, unit: '%' },
  { key: 'saturation', label: 'Saturation', min: -100, max: 200, step: 1, unit: '%' },
  { key: 'hueShift', label: 'Hue', min: -180, max: 180, step: 1, unit: '°' }
] as const

/** Re-derive the displayed curves from the base, a user edit, live-applied. */
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
  <div class="flex flex-col gap-2.5">
    <UTabs
      v-model="tab"
      :items="tabs"
      :content="false"
      size="xs"
      color="neutral"
    />

    <div ref="anchorRef">
      <ThemeStudioColorCurveEditor
        v-model="params[tab]"
        :label="tabs.find(({ value }) => value === tab)!.label"
        :y-min="windows[tab].min"
        :y-max="windows[tab].max"
        :stop-colors="stopColors"
        :stop-xs="stopXs"
        :stop-pinned="stopPinned"
        :stop-values="stopValues"
        :actual-curve="actualCurve"
        :field="field"
        @drag-start="onDragStart"
        @drag-end="onDragEnd"
      />

      <!-- One tile per stop, the single popover below carries their detail. -->
      <div class="flex aspect-11/1 rounded-b-sm overflow-hidden ring ring-default">
        <button
          v-for="info in swatches"
          :key="info.shade"
          type="button"
          class="relative flex-1"
          :style="{ backgroundColor: info.oklch }"
          :aria-label="`Shade ${info.shade}: ${info.oklch}`"
          :aria-pressed="stuckShade === info.shade"
          tabindex="-1"
          @click="toggleStuck(info.shade)"
          @mouseenter="onSwatchEnter(info.shade)"
          @mouseleave="onSwatchLeave"
        >
          <UIcon
            v-if="pinnedShades.has(info.shade)"
            :name="studioIcons.pin"
            class="absolute inset-0 m-auto size-2.5 pointer-events-none"
            :class="pinBadgeClass(info.shade)"
          />
        </button>
      </div>

      <UPopover
        :open="!!activeSwatch"
        :reference="anchorEl"
        :content="{
          side: 'bottom',
          sideOffset: 0,
          onEscapeKeyDown: () => onSwatchEscape(swatchDetail.shade),
          onCloseAutoFocus: onSwatchCloseAutoFocus,
          // hover-opened popovers must not steal focus; a stuck one takes
          // it so Tab lands on the copy button and colour inputs
          onOpenAutoFocus: stuckShade === swatchDetail.shade ? undefined : (event: Event) => event.preventDefault(),
          // stuck means kept-open: clicks elsewhere (curve drags, sliders)
          // must not dismiss, only Esc, unstick or another stick
          onInteractOutside: stuckShade === swatchDetail.shade ? (event: Event) => event.preventDefault() : undefined,
          onFocusOutside: stuckShade === swatchDetail.shade ? (event: Event) => event.preventDefault() : undefined
        }"
        :ui="{ content: 'w-(--reka-popover-trigger-width)' }"
        @update:open="onSwatchOpenUpdate(swatchDetail.shade, $event)"
      >
        <template #content>
          <div
            class="p-2 text-xs font-mono flex flex-col gap-1.5"
            @mouseenter="onSwatchEnter(swatchDetail.shade)"
            @mouseleave="onSwatchLeave"
          >
            <div class="flex items-center justify-between gap-3 ps-2">
              <span class="font-semibold flex items-center gap-1.5">
                {{ swatchDetail.shade }}
                <span v-if="swatchDetail.pinned" class="text-[10px] font-normal text-primary">pinned</span>
              </span>

              <div class="flex items-center">
                <UTooltip text="Copy oklch">
                  <UButton
                    size="xs"
                    color="neutral"
                    square
                    variant="ghost"
                    :ui="{ leadingIcon: 'size-3' }"
                    :icon="shadeCopied && copiedShade === swatchDetail.shade ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
                    :aria-label="`Copy oklch ${swatchDetail.oklch}`"
                    @click="copySwatch(swatchDetail)"
                  />
                </UTooltip>

                <UTooltip :text="swatchDetail.pinned ? 'Unpin colour' : 'Pin this colour exactly'">
                  <UButton
                    size="xs"
                    color="neutral"
                    square
                    variant="ghost"
                    active-color="primary"
                    active-variant="ghost"
                    :active="swatchDetail.pinned"
                    :ui="{ leadingIcon: 'size-3' }"
                    :icon="swatchDetail.pinned ? studioIcons.pinOff : studioIcons.pin"
                    :aria-label="swatchDetail.pinned ? 'Unpin this colour' : 'Pin this colour exactly'"
                    @click="togglePinExact(swatchDetail.shade)"
                  />
                </UTooltip>
              </div>
            </div>

            <!-- paste any format into any field: it pins the stop to that colour -->
            <UInput
              :model-value="swatchDetail.oklch"
              size="xs"
              variant="ghost"
              autocomplete="off"
              spellcheck="false"
              aria-label="OKLCH value"
              :ui="{ base: 'font-mono' }"
              @focus="stuckShade = swatchDetail.shade"
              @change="onColorCommit(swatchDetail.shade, 'oklch', $event)"
              @keydown.enter="($event.target as HTMLInputElement).blur()"
            />
            <div class="flex gap-1.5">
              <UInput
                :model-value="swatchDetail.hex"
                size="xs"
                variant="ghost"
                autocomplete="off"
                spellcheck="false"
                aria-label="Hex value"
                class="w-18"
                :ui="{ base: 'font-mono' }"
                @focus="stuckShade = swatchDetail.shade"
                @change="onColorCommit(swatchDetail.shade, 'hex', $event)"
                @keydown.enter="($event.target as HTMLInputElement).blur()"
              />
              <UInput
                :model-value="swatchDetail.rgb"
                size="xs"
                variant="ghost"
                autocomplete="off"
                spellcheck="false"
                aria-label="RGB value"
                class="flex-1"
                :ui="{ base: 'font-mono' }"
                @focus="stuckShade = swatchDetail.shade"
                @change="onColorCommit(swatchDetail.shade, 'rgb', $event)"
                @keydown.enter="($event.target as HTMLInputElement).blur()"
              />
            </div>
          </div>
        </template>
      </UPopover>
    </div>

    <!-- Modifiers recompute from the fitted base. They live outside the doc,
         so their defaults ARE the preset and the reset reads the same. -->
    <ThemeStudioSection
      label="Modifiers"
      resettable
      :reset-dirty="effectsDirty"
      @reset="resetEffects"
    >
      <div class="flex flex-col gap-1.5 px-1">
        <ThemeStudioRow
          v-model="effectAmount"
          control="slider"
          label="Effect"
          :min="0"
          :max="200"
          :step="1"
          unit="%"
          @update:model-value="applyEffects()"
        />

        <ThemeStudioRow
          v-for="row in effectRows"
          :key="row.key"
          v-model="effects[row.key]"
          control="slider"
          :label="row.label"
          :min="row.min"
          :max="row.max"
          :step="row.step"
          :unit="row.unit"
          @update:model-value="applyEffects()"
        />
      </div>
    </ThemeStudioSection>
  </div>
</template>
