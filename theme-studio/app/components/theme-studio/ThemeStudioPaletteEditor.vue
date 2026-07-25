<script setup lang="ts">
import { useThrottleFn, watchIgnorable } from '@vueuse/core'
import { SHADES_ALL, SHADE_STEPS, SHADE_SETS, CURVE_DEFAULTS, NEUTRAL_CURVE_DEFAULTS, PALETTE_EFFECT_DEFAULTS, generatePalette, buildRampSampler, fitPalette, applyPaletteEffects, isDefaultEffects, sampleCurve, shadeX, storedStopStep, detectStopStep, clampToGamut, formatOklch, parseColor, oklchToRgb, rgbToHex } from '../../utils/theme-engine'
import type { PaletteCurveParams, PaletteEffects, StoredPaletteParams, PalettePin, Shade, ShadeStep, ColorAlias } from '../../utils/theme-engine'

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

// Clone-safe copy of the pins: reading elements off the reactive ref yields Vue
// Proxies that toRaw doesn't unwrap, so structuredClone would throw. Rebuilding
// from scalar fields sidesteps the proxy.
function plainPins(pins: readonly PalettePin[]): PalettePin[] {
  return pins.map(pin => ({ shade: pin.shade, l: pin.l, c: pin.c, h: pin.h }))
}

// The modifier lens, restored alongside the base so a reload lands exactly
// where the session left off instead of silently baking the sliders in.
const stored = paletteParams.value[props.alias]
const effects = reactive<PaletteEffects>({ ...PALETTE_EFFECT_DEFAULTS, ...(stored?.effects ?? {}) })
const effectAmount = ref(stored?.amount ?? 100)

// Stop density: 100 is the standard 11 Tailwind stops, finer steps subdivide
// them into 19, 37 or 91 and expose every one to the shade sliders.
const stopStep = ref<ShadeStep>(storedStopStep(stored))
const stopSet = computed(() => SHADE_SETS[stopStep.value])

/** The density dropdown — the step itself, so it reads like the shade names. */
const stopItems = SHADE_STEPS.map(step => ({ label: `${step}`, value: step }))

// Stops locked to an exact colour — the curves bend to pass through them.
// Keyed edits go through setPin/removePin so the array stays a plain, cloneable
// value (it's persisted and fed to generatePalette on every apply).
const pins = ref<PalettePin[]>(stored?.pins ? plainPins(stored.pins) : [])
// Keyed by shade, valued by the pin's lightness: `has` still answers "pinned?"
// while the strip's badge reads the lightness to pick a contrasting colour.
const pinnedShades = computed(() => new Map(pins.value.map(pin => [pin.shade, pin.l])))

// OKLCH L above which a stop reads as light and takes the dark badge (sRGB
// mid-gray sits at ~0.6). Whole class strings, since tailwind's scanner only
// sees literals — never build these by concatenation.
const LIGHT_STOP_L = 0.62
const PIN_BADGE_CLASS = {
  text: { onLight: 'text-(--ui-color-neutral-950)', onDark: 'text-(--ui-color-neutral-50)' },
  bg: { onLight: 'bg-(--ui-color-neutral-950)', onDark: 'bg-(--ui-color-neutral-50)' }
} as const

/**
 * The badge colour for a pinned stop — the neutral end that contrasts with the
 * stop's own colour. A blend mode can't do this: `difference` against white
 * lands back on the stop's colour at mid lightness (badge vanishes) and inverts
 * the hue on saturated stops.
 */
function pinBadgeClass(shade: number, property: 'text' | 'bg') {
  const lightness = pinnedShades.value.get(shade as Shade) ?? 0
  return PIN_BADGE_CLASS[property][lightness > LIGHT_STOP_L ? 'onLight' : 'onDark']
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

/** The DISPLAYED curves: base with the lens applied — what generates the ramp. */
const params = reactive<PaletteCurveParams>(applyPaletteEffects(seedBase, effects, effectAmount.value))

const active = computed(() => isCustomPalette(props.alias))

const shades = computed(() => generatePalette(params, stopStep.value, pins.value))
const stopColors = computed(() => stopSet.value.map(shade => shades.value[shade]))
const stopXs = computed(() => stopSet.value.map(shadeX))
const stopPinned = computed(() => stopSet.value.map(shade => pinnedShades.value.has(shade)))
// The active channel's pin-corrected value at each stop and as a dense
// polyline: the curve editor draws the polyline (so the line bends THROUGH
// pinned stops and shows their pull on neighbours) and sits every dot on it.
// The sampler is built with the REACTIVE params (not a toRaw snapshot) so
// sampling inside these computeds tracks curve edits — a handle drag redraws.
const CHANNEL_KEY = { lightness: 'l', chroma: 'c', hue: 'h' } as const
const stopValues = computed(() => {
  const key = CHANNEL_KEY[tab.value]
  const sample = buildRampSampler(params, pins.value)
  return stopSet.value.map(shade => sample(shadeX(shade))[key])
})
const actualCurve = computed(() => {
  // No pins → no correction, so let the editor draw the exact bézier.
  if (!pins.value.length) return undefined
  const key = CHANNEL_KEY[tab.value]
  const sample = buildRampSampler(params, pins.value)
  return Array.from({ length: 48 }, (_, i) => {
    const x = i / 47
    return { x, v: sample(x)[key] }
  })
})

/**
 * The strip tiles — just shade + live color. Kept deliberately light (no
 * hex/rgb parse) because it recomputes on every drag frame across every
 * stop (up to 91); the costly parse is deferred to the single open swatch.
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
 * Swatch details live in a popover, not a tooltip: the copy button and the
 * editable colour inputs inside must be keyboard-reachable, and popover
 * content can take focus. Hover previews it (hand-rolled, with a grace gap so
 * the pointer can cross onto the content); clicking a swatch STICKS it open so
 * you can type into the inputs. Sticking-open is separate from pinning: a stuck
 * popover is just "kept visible", while a pin locks the stop's exact colour.
 */
const stuckShade = ref<number>()
const hoveredShade = ref<number>()
let hoverLeaveTimeout: ReturnType<typeof setTimeout> | undefined

// One popover serves the whole strip (all tiles anchor to it anyway), driven
// by whichever swatch is active — a stuck one wins over a hover. Rendering a
// single Reka popover instead of one per stop is the bulk of the 19-stop speedup.
const activeShade = computed(() => stuckShade.value ?? hoveredShade.value)

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
    rgb: rgb ? `rgb(${rgb.map(channel => Math.round(channel * 255)).join(', ')})` : '',
    pinned: pinnedShades.value.has(shade as Shade)
  }
})

// Always-defined mirror for the slot template (avoids undefined-narrowing).
// Holds the last real detail after the swatch goes inactive so the content
// doesn't flash the placeholder while the popover animates closed.
const lastDetail = ref({ shade: -1, oklch: '', hex: '', rgb: '', pinned: false })
watch(activeSwatch, (value) => {
  if (value) lastDetail.value = value
})
const swatchDetail = computed(() => activeSwatch.value ?? lastDetail.value)

function onSwatchEnter(shade: number) {
  // a stuck swatch means "I'm reading/editing this one" — other swatches don't
  // hover-open until it's released (clicking another still migrates the stick)
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

/**
 * Commit an edited readout: parse whatever format was typed (hex/rgb/oklch),
 * pin the stop to it, and keep the popover stuck open so further edits land.
 * A rejected value leaves the pin untouched — the input restates the old text.
 */
function commitSwatchColor(shade: number, value: string): boolean {
  const ok = setPin(shade as Shade, value)
  if (ok) stuckShade.value = shade
  return ok
}

/**
 * Commit an edited colour input. A parseable value (any format) pins the stop;
 * a rejected one leaves the pin untouched and the field restates its own
 * canonical text so the box never shows an unparseable string.
 */
function onColorCommit(shade: number, field: 'oklch' | 'hex' | 'rgb', event: Event) {
  const input = event.target as HTMLInputElement
  if (!commitSwatchColor(shade, input.value)) {
    input.value = swatchDetail.value[field]
  }
}

/**
 * Reka emits update:open(false) for trigger clicks as well as dismissals —
 * clearing the stick here would race toggleStuck into re-sticking. Only hover
 * intent clears; the stick is released by toggleStuck or Esc alone.
 */
function onSwatchOpenUpdate(shade: number, open: boolean) {
  if (open) return
  if (hoveredShade.value === shade) hoveredShade.value = undefined
}

function onSwatchEscape(shade: number) {
  if (stuckShade.value === shade) stuckShade.value = undefined
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
function hueWindow(hue: PaletteCurveParams['hue']) {
  const points = [hue.y0, hue.y1, hue.p1y, hue.p2y]
  return {
    min: Math.min(0, Math.floor(Math.min(...points) / 10) * 10),
    max: Math.max(360, Math.ceil(Math.max(...points) / 10) * 10)
  }
}
// Hue window stretches to fit each seed (a later palette can cross the seam
// elsewhere) but never mid-drag, or a grabbed handle would rescale under the
// pointer. Lightness/chroma are fixed physical ranges.
const windows = ref({
  lightness: { min: 0, max: 1 },
  chroma: { min: 0, max: 0.35 },
  hue: hueWindow(params.hue)
})

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
  const { min, max } = windows.value[channel]
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

// The reactive apply: regenerate the ramp, inject it (rebuilding the custom-
// colours <style>), and persist. This reparses the whole stylesheet and churns
// Vue state + localStorage — fine once, but ~16×/sec during a drag it's the
// dominant cost, so a live drag routes through the CSSOM fast path below and
// only lands here on the first edit and on release.
const isDragging = ref(false)
const customName = computed(() => `custom-${props.alias}`)

function applyReactive() {
  setPaletteFromCurve(props.alias, structuredClone(seedBase), { ...effects }, effectAmount.value, stopStep.value, plainPins(pins.value))
  clearCssomPreview()
}

// Fast path: write the ramp's vars straight onto :root. Inline custom
// properties outrank the <style>'s `:root {}` rule, so the preview updates
// with only the unavoidable restyle — no stylesheet reparse, no reactive
// re-inject, no localStorage write. Only valid once the alias already resolves
// through --color-custom-* (an active ramp); the first edit takes the reactive
// path to create it. Reconciled + cleared by applyReactive on release.
function previewViaCssom() {
  if (!import.meta.client) return
  const root = document.documentElement.style
  const ramp = shades.value
  for (const shade of stopSet.value) root.setProperty(`--color-${customName.value}-${shade}`, ramp[shade]!)
}

// Sweeps every stop any density can emit, not just the current set — the
// density may have changed since the preview was written.
function clearCssomPreview() {
  if (!import.meta.client) return
  const root = document.documentElement.style
  for (const shade of SHADES_ALL) root.removeProperty(`--color-${customName.value}-${shade}`)
}

// Throttled (not debounced) so the theme streams live while dragging a
// curve — the trailing call catches the release position. With a neutral
// lens the base simply tracks the edited curves.
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

// A density change re-tiles the strip, so pins on stops the new set doesn't
// emit lose their tile — drop them rather than let them keep bending the ramp
// invisibly (their x still lies between stops, so it relaxes back to the curve
// there). Note the 25 and 10 sets are siblings, not nested: moving between them
// drops pins either way. Only reassigns when it actually removes one — the
// combined watcher below covers the density change and the resulting apply.
watch(stopStep, (step) => {
  const stops = SHADE_SETS[step] as readonly number[]
  const kept = pins.value.filter(pin => stops.includes(pin.shade))
  if (kept.length !== pins.value.length) pins.value = kept
  // A stuck/hovered tile can be gone too — drop the popover state so it can't
  // dangle over a stop that no longer renders.
  if (stuckShade.value !== undefined && !stops.includes(stuckShade.value)) stuckShade.value = undefined
  if (hoveredShade.value !== undefined && !stops.includes(hoveredShade.value)) hoveredShade.value = undefined
})

// params, pins and the density all reshape the ramp, so any of them changing
// re-applies. Programmatic writes (seeding, external sync — e.g. an undo/redo
// restore) wrap ALL of these in ignoreUpdates so restoring state never fires a
// spurious apply that regenerates and clobbers it; only genuine user edits
// reach throttledApply.
const { ignoreUpdates } = watchIgnorable([() => params, pins, stopStep], () => {
  throttledApply()
}, { deep: true })

function seed(values: PaletteCurveParams) {
  const next = structuredClone(toRaw(values))
  normalizeHue(next)
  seedBase = structuredClone(next)
  // All apply-triggering writes go through ignoreUpdates together: a seed is
  // never a user edit, so it must not re-apply (which would, e.g., turn a stock
  // ramp custom the instant the editor opens, or clobber an undo/redo restore).
  ignoreUpdates(() => {
    Object.assign(effects, PALETTE_EFFECT_DEFAULTS)
    effectAmount.value = 100
    // A fresh fit is 11-stop; seedFromCurrent re-detects the density after.
    stopStep.value = 100
    // Fresh curves own no pins — a reseed starts from the raw ramp.
    pins.value = []
    Object.assign(params, next)
  })
  // Restretch the hue window — this seed may cross the seam differently.
  windows.value.hue = hueWindow(next.hue)
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
  isDragging.value = true
  clearTimeout(dragEndTimeout)
  document.documentElement.classList.add('theme-studio-dragging')
}

function onDragEnd() {
  dragEndTimeout = setTimeout(() => {
    document.documentElement.classList.remove('theme-studio-dragging')
  }, 200)
  isDragging.value = false
  // Land the drag on the reactive path once: persist and hand the vars back to
  // the <style> (a pending trailing throttle can't be relied on to fire after
  // release). applyReactive clears the inline preview so there's no double
  // definition left behind.
  if (!effectsDirty.value) {
    seedBase = structuredClone(toRaw(params))
  }
  // Only the active ramp reconciles via applyReactive; an inactive alias still
  // set preview vars during the drag, so clear them directly.
  if (active.value) applyReactive()
  else clearCssomPreview()
}

onUnmounted(() => {
  clearTimeout(dragEndTimeout)
  if (import.meta.client) {
    document.documentElement.classList.remove('theme-studio-dragging')
    // The fold can unmount mid-drag — don't strand inline preview vars that
    // would then shadow the reactive <style> for this ramp.
    clearCssomPreview()
  }
})

/** Fit curves from whatever palette the alias currently shows. */
function seedFromCurrent() {
  const name = (appConfig.ui.colors as Record<string, string>)[props.alias]
  if (!name) return

  const source = paletteShades(name)
  if (source) {
    seed(fitPalette(source))
    // A ramp that already carries a finer density keeps it, so opening the
    // editor doesn't silently narrow it back to 11. Ignored like the rest of
    // the seed — following a palette must not apply.
    const step = detectStopStep(source)
    if (step !== 100) ignoreUpdates(() => (stopStep.value = step))
  }
}

// External writes to the stored entry — reflect them here, lens included.
// The effective-curve comparison is what breaks the echo loop for our own
// throttled applies (the callback runs queued, after any sync flag reset).
watch(() => paletteParams.value[props.alias], (value) => {
  if (!value || !('lightness' in value)) return
  // Echo guard: skip only when curves, pins AND density all match — comparing
  // curves alone would swallow a pin-only or density-only external change (e.g.
  // undo/redo) and leave stale pins over correct curves.
  const effective = applyPaletteEffects(pickCurves(value), value.effects, value.amount)
  const curvesMatch = JSON.stringify(effective) === JSON.stringify(toRaw(params))
  const pinsMatch = JSON.stringify(value.pins ?? []) === JSON.stringify(toRaw(pins.value))
  const stepMatch = storedStopStep(value) === stopStep.value
  if (curvesMatch && pinsMatch && stepMatch) return

  seedBase = pickCurves(value)
  normalizeHue(seedBase)
  // Wrap every apply-triggering write: reflecting an external change must not
  // echo back into an apply that re-persists and clobbers what's being restored.
  ignoreUpdates(() => {
    Object.assign(effects, PALETTE_EFFECT_DEFAULTS, value.effects ?? {})
    effectAmount.value = value.amount ?? 100
    pins.value = value.pins ? plainPins(value.pins) : []
    stopStep.value = storedStopStep(value)
    Object.assign(params, applyPaletteEffects(seedBase, effects, effectAmount.value))
  })
  // A restored curve can cross the hue seam elsewhere — refit the window too.
  windows.value.hue = hueWindow(toRaw(params).hue)
})

// Follow the selected palette so opening the editor starts from the curves of
// the colour already on screen. We fit from the applied shades unless the
// editor already OWNS curves for this alias (a ramp it built, in paletteParams)
// — a preset's custom ramp is active but has no stored curves, so it must still
// be fitted rather than showing the blank defaults. Stuck/hover popover state
// resets too: the swatch strip unmounts with the fold, so a stale stick would
// pop a popover for a palette the user never opened.
watch([() => (appConfig.ui.colors as Record<string, string>)[props.alias], open], ([, isOpen]) => {
  stuckShade.value = undefined
  hoveredShade.value = undefined
  const owned = paletteParams.value[props.alias]
  if (isOpen && !(owned && 'lightness' in owned)) {
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
            :stop-pinned="stopPinned"
            :stop-values="stopValues"
            :actual-curve="actualCurve"
            :field="field"
            @drag-start="onDragStart"
            @drag-end="onDragEnd"
          />

          <!-- Plain tiles recolor live every frame (cheap); a single popover,
               anchored to the strip and driven by the active swatch, carries
               the details — 1 Reka instance instead of one per stop. A pin
               badge, in whichever neutral end contrasts with the stop, marks
               stops locked to an exact value. The strip keeps the height it has
               at 11 stops (hence the 11:1 ratio rather than square tiles), so a
               denser ramp only makes the tiles narrower. -->
          <div ref="stripRef" class="flex aspect-11/1 rounded-b-sm overflow-hidden ring ring-default">
            <button
              v-for="info in swatches"
              :key="info.shade"
              type="button"
              class="relative flex-1"
              :style="{ backgroundColor: info.oklch }"
              :aria-label="`Shade ${info.shade}: ${info.oklch}`"
              :aria-pressed="stuckShade === info.shade"
              @click="toggleStuck(info.shade)"
              @mouseenter="onSwatchEnter(info.shade)"
              @mouseleave="onSwatchLeave"
            >
              <!-- Past 19 stops a tile is narrower than the icon, so the badge
                   becomes a full-height hairline instead. -->
              <template v-if="pinnedShades.has(info.shade)">
                <UIcon
                  v-if="stopStep >= 50"
                  name="i-lucide-pin"
                  class="absolute inset-0 m-auto size-2.5 pointer-events-none"
                  :class="pinBadgeClass(info.shade, 'text')"
                />
                <span
                  v-else
                  class="absolute inset-0 mx-auto w-px pointer-events-none"
                  :class="pinBadgeClass(info.shade, 'bg')"
                />
              </template>
            </button>
          </div>

          <UPopover
            arrow
            :open="!!activeSwatch"
            :reference="stripEl"
            :content="{
              side: 'right',
              onEscapeKeyDown: () => onSwatchEscape(swatchDetail.shade),
              onCloseAutoFocus: onSwatchCloseAutoFocus,
              sideOffset: 0,
              // hover-opened popovers must not steal focus; a stuck one takes
              // it so Tab lands on the copy button and colour inputs
              onOpenAutoFocus: stuckShade === swatchDetail.shade ? undefined : (event: Event) => event.preventDefault(),
              // stuck means kept-open: clicks elsewhere (curve drags, sliders)
              // must not dismiss — only Esc, unstick or another stick
              onInteractOutside: stuckShade === swatchDetail.shade ? (event: Event) => event.preventDefault() : undefined,
              onFocusOutside: stuckShade === swatchDetail.shade ? (event: Event) => event.preventDefault() : undefined
            }"
            @update:open="onSwatchOpenUpdate(swatchDetail.shade, $event)"
          >
            <template #content>
              <div
                class="p-2 text-xs font-mono flex flex-col gap-1.5 w-60"
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
                        :icon="copiedShade === swatchDetail.shade ? 'i-lucide-copy-check' : 'i-lucide-copy'"
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
                        :icon="swatchDetail.pinned ? 'i-lucide-pin-off' : 'i-lucide-pin'"
                        :aria-label="swatchDetail.pinned ? 'Unpin this colour' : 'Pin this colour exactly'"
                        @click="togglePinExact(swatchDetail.shade)"
                      />
                    </UTooltip>
                  </div>
                </div>

                <!-- Paste any format (hex / rgb / oklch) into any field: it
                     parses, pins the stop to that colour, and the ramp bends to
                     pass through it. All three fields restate on commit. -->
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
            <!-- Density picker rides the Modifiers row so it never overlaps
                 the curve handles or swatches above. Its own click must not
                 toggle the fold. -->
            <UTooltip text="Shade interval">
              <USelect
                v-model="stopStep"
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
