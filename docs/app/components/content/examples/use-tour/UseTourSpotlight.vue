<script setup lang="ts">
import type { UseTourReturn } from '@nuxt/ui/composables'
import { useWindowSize } from '@vueuse/core'

const props = withDefaults(defineProps<{
  tour: UseTourReturn
  padding?: number
}>(), {
  padding: 8
})

const { width, height } = useWindowSize()

// The target's own corner radius, so the theme radius carries over. Read once per step, not per frame.
const targetRadius = computed(() => {
  const el = props.tour.reference.value
  return el instanceof Element ? Number.parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0 : 0
})

// `rect` is physical even in RTL, hence `left-0` + `translate` on the ring below.
const hole = computed(() => {
  const rect = props.tour.rect.value
  if (!rect) {
    return null
  }

  const p = props.padding
  const w = rect.width + p * 2
  const h = rect.height + p * 2
  // Concentric corners: a rounded target gets its radius plus the padding, a square one stays square.
  const r = targetRadius.value > 0 ? targetRadius.value + p : 0
  return { x: rect.left - p, y: rect.top - p, w, h, r: Math.min(r, w / 2, h / 2) }
})

// Full-viewport backdrop minus a rounded cutout. `clip-path` also clips hit testing,
// so the target stays clickable while the rest of the page is blocked.
const clipPath = computed(() => {
  if (!hole.value) {
    return undefined
  }

  const { x, y, w, h, r } = hole.value
  return `path(evenodd, "M0 0H${width.value}V${height.value}H0Z M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${2 * r - w}a${r} ${r} 0 0 1 ${-r} ${-r}v${2 * r - h}a${r} ${r} 0 0 1 ${r} ${-r}Z")`
})
</script>

<template>
  <Teleport to="body">
    <template v-if="tour.open.value">
      <div aria-hidden="true" class="fixed inset-0 z-40 bg-black/50" :style="{ clipPath }" />
      <div
        v-if="hole"
        aria-hidden="true"
        class="fixed top-0 left-0 z-40 pointer-events-none ring-2 ring-primary"
        :style="{ width: `${hole.w}px`, height: `${hole.h}px`, borderRadius: `${hole.r}px`, transform: `translate(${hole.x}px, ${hole.y}px)` }"
      />
    </template>
  </Teleport>
</template>
