<script setup lang="ts">
import { sampleCurve, SHADES, shadeX, parseColor, oklchToRgb } from '../../utils/theme-engine'
import type { ChannelCurve } from '../../utils/theme-engine'

const props = defineProps<{
  /** Display window for the channel value axis */
  yMin: number
  yMax: number
  /** Fill colors for the stop dots along the curve, one per stop. */
  stopColors?: string[]
  /** Curve x (0–1) per stop; omit for the standard 11 evenly-ranked stops. */
  stopXs?: number[]
  /** Which stops are pinned to an exact colour, aligned with `stopXs`. */
  stopPinned?: boolean[]
  /** Pin-corrected value per stop, so every dot sits on the colour it produces. */
  stopValues?: number[]
  /** Pin-corrected curve as a dense polyline — drawn in place of the raw bézier. */
  actualCurve?: { x: number, v: number }[]
  /** Colour field behind the plot: columns of oklch samples, top (yMax) to bottom. */
  field?: string[][]
}>()

const curve = defineModel<ChannelCurve>({ required: true })

const emit = defineEmits<{
  dragStart: []
  dragEnd: []
}>()

const W = 200
const H = 180
const PAD = 10

function toX(x: number) {
  return PAD + x * (W - 2 * PAD)
}

function toY(value: number) {
  return PAD + (1 - (value - props.yMin) / (props.yMax - props.yMin)) * (H - 2 * PAD)
}

/** Handles stay grabbable even when a fitted param sits outside the window. */
function toHandleY(value: number) {
  return Math.min(H - PAD, Math.max(PAD, toY(value)))
}

function fromX(px: number) {
  return Math.min(1, Math.max(0, (px - PAD) / (W - 2 * PAD)))
}

function fromY(py: number) {
  return props.yMin + (1 - (py - PAD) / (H - 2 * PAD)) * (props.yMax - props.yMin)
}

const path = computed(() => {
  // with pins the parent passes the corrected curve — draw it through the stops
  if (props.actualCurve?.length) {
    return props.actualCurve.map((p, i) => `${i ? 'L' : 'M'} ${toX(p.x).toFixed(2)} ${toY(p.v).toFixed(2)}`).join(' ')
  }
  const c = curve.value
  return `M ${toX(0)} ${toY(c.y0)} C ${toX(c.p1x)} ${toY(c.p1y)}, ${toX(c.p2x)} ${toY(c.p2y)}, ${toX(1)} ${toY(c.y1)}`
})

// Paint the field as a small bitmap the canvas scales up with bilinear
// smoothing — does what the SVG needed a blur filter for, without the filter
// re-rasterising on every page restyle.
const fieldCanvas = useTemplateRef<HTMLCanvasElement>('fieldCanvas')
let sourceCanvas: HTMLCanvasElement | undefined

function drawField() {
  const canvas = fieldCanvas.value
  const columns = props.field
  if (!canvas || !columns?.length) return
  const nCol = columns.length
  const nRow = columns[0]!.length
  if (!nRow) return

  // low-res backing store stretched by CSS — indistinguishable for a soft gradient
  if (canvas.width !== W * 3) {
    canvas.width = W * 3
    canvas.height = H * 3
  }

  const grid = new ImageData(nCol, nRow)
  for (let col = 0; col < nCol; col++) {
    const column = columns[col]!
    for (let row = 0; row < nRow; row++) {
      const parsed = parseColor(column[row]!)
      const [r, g, b] = parsed ? oklchToRgb(parsed) : [0, 0, 0]
      const i = (row * nCol + col) * 4
      grid.data[i] = Math.round(r * 255)
      grid.data[i + 1] = Math.round(g * 255)
      grid.data[i + 2] = Math.round(b * 255)
      grid.data[i + 3] = 255
    }
  }

  if (!sourceCanvas) sourceCanvas = document.createElement('canvas')
  sourceCanvas.width = nCol
  sourceCanvas.height = nRow
  sourceCanvas.getContext('2d')!.putImageData(grid, 0, 0)

  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(sourceCanvas, 0, 0, nCol, nRow, 0, 0, canvas.width, canvas.height)
}

// Watch both explicitly — read-tracking would miss props.field behind the
// early return while the canvas isn't mounted yet.
watch([() => props.field, fieldCanvas], drawField, { immediate: true, flush: 'post' })

// Endpoint handles ride the corrected line when a pin pulls the edge; a pinned
// endpoint is locked from dragging — the pin owns it.
const lastStop = computed(() => (props.stopValues?.length ?? 1) - 1)
const startPinned = computed(() => props.stopPinned?.[0] ?? false)
const endPinned = computed(() => props.stopPinned?.[lastStop.value] ?? false)
const startY = computed(() => props.stopValues?.[0] ?? curve.value.y0)
const endY = computed(() => props.stopValues?.[lastStop.value] ?? curve.value.y1)

const stopXs = computed(() => props.stopXs ?? SHADES.map(shadeX))
const stops = computed(() => stopXs.value.map((x, index) => {
  // dots ride the drawn (pin-corrected) line; bézier sample when no pins
  const value = props.stopValues?.[index] ?? sampleCurve(x, curve.value)
  return {
    key: index,
    cx: toX(x),
    cy: toY(value),
    fill: props.stopColors?.[index] || 'currentColor',
    pinned: props.stopPinned?.[index] ?? false
  }
}))

// Dots track the stop spacing, or a dense ramp draws them as one fat band.
const stopRadius = computed(() => Math.min(2.25, Math.max(0.9, (W - 2 * PAD) / (stops.value.length * 2.4))))

const svgRef = ref<SVGSVGElement>()
const dragging = ref<'y0' | 'y1' | 'p1' | 'p2' | null>(null)

function svgPoint(event: PointerEvent): { x: number, y: number } {
  const rect = svgRef.value!.getBoundingClientRect()
  return {
    x: (event.clientX - rect.left) * (W / rect.width),
    y: (event.clientY - rect.top) * (H / rect.height)
  }
}

function onPointerDown(event: PointerEvent) {
  // right/middle clicks must not start a drag (the context menu would
  // strand the page-wide dragging state)
  if (event.button !== 0) return
  const point = svgPoint(event)
  const c = curve.value

  const targets = [
    { id: 'p1' as const, x: toX(c.p1x), y: toHandleY(c.p1y) },
    { id: 'p2' as const, x: toX(c.p2x), y: toHandleY(c.p2y) },
    // a pinned endpoint is locked
    ...(startPinned.value ? [] : [{ id: 'y0' as const, x: toX(0), y: toHandleY(startY.value) }]),
    ...(endPinned.value ? [] : [{ id: 'y1' as const, x: toX(1), y: toHandleY(endY.value) }])
  ]

  let best: { id: typeof dragging.value, distance: number } = { id: null, distance: 14 }
  for (const target of targets) {
    const distance = Math.hypot(target.x - point.x, target.y - point.y)
    if (distance < best.distance) {
      best = { id: target.id, distance }
    }
  }

  if (best.id) {
    dragging.value = best.id
    svgRef.value!.setPointerCapture(event.pointerId)
    event.preventDefault()
    emit('dragStart')
  }
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) return

  const point = svgPoint(event)
  const value = fromY(point.y)
  // window-clamped: an overshot handle would leave the canvas and become
  // ungrabbable (and out-of-range lightness exports nonsense)
  const clamped = Math.min(props.yMax, Math.max(props.yMin, value))

  // An endpoint drag carries its control handle by the same delta (tangent
  // preserved). The handle sits on the corrected curve but steers the raw
  // control — back out the pin pull (corrected − raw) to track the pointer.
  if (dragging.value === 'y0') {
    const raw = Math.min(props.yMax, Math.max(props.yMin, clamped - (startY.value - curve.value.y0)))
    const delta = raw - curve.value.y0
    const p1y = Math.min(props.yMax, Math.max(props.yMin, curve.value.p1y + delta))
    curve.value = { ...curve.value, y0: raw, p1y }
  } else if (dragging.value === 'y1') {
    const raw = Math.min(props.yMax, Math.max(props.yMin, clamped - (endY.value - curve.value.y1)))
    const delta = raw - curve.value.y1
    const p2y = Math.min(props.yMax, Math.max(props.yMin, curve.value.p2y + delta))
    curve.value = { ...curve.value, y1: raw, p2y }
  } else if (dragging.value === 'p1') {
    curve.value = { ...curve.value, p1x: fromX(point.x), p1y: clamped }
  } else {
    curve.value = { ...curve.value, p2x: fromX(point.x), p2y: clamped }
  }
}

function onPointerUp(event: PointerEvent) {
  if (dragging.value) {
    dragging.value = null
    // after a pointercancel the capture is gone and release throws — which
    // would skip dragEnd and strand the page-wide dragging class
    if (svgRef.value?.hasPointerCapture(event.pointerId)) {
      svgRef.value.releasePointerCapture(event.pointerId)
    }
    emit('dragEnd')
  }
}

// Closing the fold mid-drag unmounts the SVG without a pointerup — emit dragEnd
// so the parent isn't left with isDragging and stranded preview vars.
onUnmounted(() => {
  if (dragging.value) {
    dragging.value = null
    emit('dragEnd')
  }
})
</script>

<template>
  <div class="relative w-full rounded-t-sm ring ring-default bg-elevated/30 overflow-hidden">
    <!-- canvas, not SVG gradients + blur: the filter re-rasterised on every
         page restyle (~7ms per apply during a drag) -->
    <canvas
      ref="fieldCanvas"
      class="absolute inset-0 size-full opacity-75 pointer-events-none"
    />
    <svg
      ref="svgRef"
      data-curve-editor
      :viewBox="`0 0 ${W} ${H}`"
      class="relative block w-full touch-none select-none cursor-crosshair"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <!-- handle connectors -->
      <line
        :x1="toX(0)"
        :y1="toHandleY(startY)"
        :x2="toX(curve.p1x)"
        :y2="toHandleY(curve.p1y)"
        class="stroke-(--ui-text-dimmed)"
        stroke-width="0.75"
        stroke-dasharray="2 2"
      />
      <line
        :x1="toX(1)"
        :y1="toHandleY(endY)"
        :x2="toX(curve.p2x)"
        :y2="toHandleY(curve.p2y)"
        class="stroke-(--ui-text-dimmed)"
        stroke-width="0.75"
        stroke-dasharray="2 2"
      />

      <!-- curve -->
      <path :d="path" fill="none" class="stroke-(--ui-primary)" stroke-width="1.5" />

      <!-- shade stops on the curve; a pinned stop wears a larger primary ring -->
      <template v-for="stop in stops" :key="stop.key">
        <circle
          v-if="stop.pinned"
          :cx="stop.cx"
          :cy="stop.cy"
          :r="stopRadius + 1.75"
          fill="none"
          class="stroke-(--ui-primary)"
          stroke-width="1.25"
        />
        <circle
          :cx="stop.cx"
          :cy="stop.cy"
          :r="stop.pinned ? stopRadius + 0.25 : stopRadius"
          :fill="stop.fill"
          class="stroke-(--ui-bg)"
          stroke-width="0.5"
        />
      </template>

      <!-- handles -->
      <circle :cx="toX(curve.p1x)" :cy="toHandleY(curve.p1y)" r="4" class="fill-(--ui-bg) stroke-(--ui-text-muted)" stroke-width="1.25" />
      <circle :cx="toX(curve.p2x)" :cy="toHandleY(curve.p2y)" r="4" class="fill-(--ui-bg) stroke-(--ui-text-muted)" stroke-width="1.25" />

      <!-- endpoints, filled with the ramp's 50 and 950 so the drag targets show
         what they steer -->
      <circle
        :cx="toX(0)"
        :cy="toHandleY(startY)"
        r="4.5"
        :fill="stopColors?.[0] || 'currentColor'"
        class="stroke-(--ui-text-highlighted)"
        stroke-width="1.5"
      />
      <circle
        :cx="toX(1)"
        :cy="toHandleY(endY)"
        r="4.5"
        :fill="stopColors?.[stopColors.length - 1] || 'currentColor'"
        class="stroke-(--ui-text-highlighted)"
        stroke-width="1.5"
      />
    </svg>
  </div>
</template>
