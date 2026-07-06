<script setup lang="ts">
import { sampleCurve, SHADES } from '../../utils/theme-engine'
import type { ChannelCurve } from '../../utils/theme-engine'

const props = defineProps<{
  /** Display window for the channel value axis */
  yMin: number
  yMax: number
  /** Fill colors for the 11 stop dots along the curve */
  stopColors?: string[]
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
  const c = curve.value
  return `M ${toX(0)} ${toY(c.y0)} C ${toX(c.p1x)} ${toY(c.p1y)}, ${toX(c.p2x)} ${toY(c.p2y)}, ${toX(1)} ${toY(c.y1)}`
})

const stops = computed(() => SHADES.map((shade, index) => {
  const x = index / (SHADES.length - 1)
  return {
    shade,
    cx: toX(x),
    cy: toY(sampleCurve(x, curve.value)),
    fill: props.stopColors?.[index] || 'currentColor'
  }
}))

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
  const point = svgPoint(event)
  const c = curve.value

  const targets = [
    { id: 'p1' as const, x: toX(c.p1x), y: toHandleY(c.p1y) },
    { id: 'p2' as const, x: toX(c.p2x), y: toHandleY(c.p2y) },
    { id: 'y0' as const, x: toX(0), y: toHandleY(c.y0) },
    { id: 'y1' as const, x: toX(1), y: toHandleY(c.y1) }
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
  // Strictly window-clamped: an overshot handle would leave the canvas and
  // become ungrabbable (and out-of-range lightness exports nonsense).
  // Reaching further is the window's job — hue auto-pans at the edges.
  const clamped = Math.min(props.yMax, Math.max(props.yMin, value))

  if (dragging.value === 'y0') {
    curve.value = { ...curve.value, y0: clamped }
  } else if (dragging.value === 'y1') {
    curve.value = { ...curve.value, y1: clamped }
  } else if (dragging.value === 'p1') {
    curve.value = { ...curve.value, p1x: fromX(point.x), p1y: clamped }
  } else {
    curve.value = { ...curve.value, p2x: fromX(point.x), p2y: clamped }
  }
}

function onPointerUp(event: PointerEvent) {
  if (dragging.value) {
    dragging.value = null
    svgRef.value!.releasePointerCapture(event.pointerId)
    emit('dragEnd')
  }
}
</script>

<template>
  <svg
    ref="svgRef"
    data-curve-editor
    :viewBox="`0 0 ${W} ${H}`"
    class="w-full rounded-t-sm ring ring-default bg-elevated/30 touch-none select-none cursor-crosshair"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <!-- grid -->
    <line
      v-for="fraction in [0.25, 0.5, 0.75]"
      :key="`v${fraction}`"
      :x1="toX(fraction)"
      :x2="toX(fraction)"
      :y1="PAD"
      :y2="H - PAD"
      class="stroke-(--ui-border) opacity-40"
      stroke-width="0.5"
    />
    <line
      v-for="fraction in [0.25, 0.5, 0.75]"
      :key="`h${fraction}`"
      :x1="PAD"
      :x2="W - PAD"
      :y1="PAD + fraction * (H - 2 * PAD)"
      :y2="PAD + fraction * (H - 2 * PAD)"
      class="stroke-(--ui-border) opacity-40"
      stroke-width="0.5"
    />

    <!-- handle connectors -->
    <line
      :x1="toX(0)"
      :y1="toHandleY(curve.y0)"
      :x2="toX(curve.p1x)"
      :y2="toHandleY(curve.p1y)"
      class="stroke-(--ui-text-dimmed)"
      stroke-width="0.75"
      stroke-dasharray="2 2"
    />
    <line
      :x1="toX(1)"
      :y1="toHandleY(curve.y1)"
      :x2="toX(curve.p2x)"
      :y2="toHandleY(curve.p2y)"
      class="stroke-(--ui-text-dimmed)"
      stroke-width="0.75"
      stroke-dasharray="2 2"
    />

    <!-- curve -->
    <path :d="path" fill="none" class="stroke-(--ui-primary)" stroke-width="1.5" />

    <!-- shade stops on the curve -->
    <circle
      v-for="stop in stops"
      :key="stop.shade"
      :cx="stop.cx"
      :cy="stop.cy"
      r="2.25"
      :fill="stop.fill"
      class="stroke-(--ui-bg)"
      stroke-width="0.5"
    />

    <!-- handles -->
    <circle :cx="toX(curve.p1x)" :cy="toHandleY(curve.p1y)" r="4" class="fill-(--ui-bg) stroke-(--ui-text-muted)" stroke-width="1.25" />
    <circle :cx="toX(curve.p2x)" :cy="toHandleY(curve.p2y)" r="4" class="fill-(--ui-bg) stroke-(--ui-text-muted)" stroke-width="1.25" />

    <!-- endpoints, filled with the ramp's 50 and 950 so the drag targets show
         what they steer -->
    <circle
      :cx="toX(0)"
      :cy="toHandleY(curve.y0)"
      r="4.5"
      :fill="stopColors?.[0] || 'currentColor'"
      class="stroke-(--ui-text-highlighted)"
      stroke-width="1.5"
    />
    <circle
      :cx="toX(1)"
      :cy="toHandleY(curve.y1)"
      r="4.5"
      :fill="stopColors?.[stopColors.length - 1] || 'currentColor'"
      class="stroke-(--ui-text-highlighted)"
      stroke-width="1.5"
    />
  </svg>
</template>
