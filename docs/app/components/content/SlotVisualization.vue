<script setup lang="ts">
import { useElementBounding, useDebounceFn } from '@vueuse/core'

const props = defineProps<{
  /**
   * The target element to visualize slots for
   */
  target?: HTMLElement | null
}>()

interface SlotOverlay {
  slot: string
  rect: DOMRect
  element: HTMLElement
  labelPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const slots = ref<SlotOverlay[]>([])
const containerRef = ref<HTMLElement | null>(null)
const isUpdating = ref(false)

// Check if two rectangles overlap with a margin
const rectsOverlap = (rect1: DOMRect, rect2: DOMRect, margin = 2) => {
  return !(
    rect1.right + margin < rect2.left
    || rect1.left - margin > rect2.right
    || rect1.bottom + margin < rect2.top
    || rect1.top - margin > rect2.bottom
  )
}

// Update slot overlays when target changes
const updateSlots = () => {
  if (isUpdating.value) return

  if (!props.target) {
    slots.value = []
    return
  }

  isUpdating.value = true

  try {
    // Get the actual DOM element from the target
    // Handle Vue component refs, component instances, and plain HTMLElements
    let targetElement: HTMLElement | null = null

    if (props.target instanceof HTMLElement) {
      targetElement = props.target
    } else if (props.target && '$el' in props.target) {
      targetElement = (props.target as any).$el
    } else if (props.target && 'value' in props.target) {
      targetElement = (props.target as any).value
    }

    if (!targetElement || !(targetElement instanceof HTMLElement)) {
      slots.value = []
      return
    }

    const elements = targetElement.querySelectorAll<HTMLElement>('[data-slot]')

    // Sort elements by size (largest first) to prioritize bigger slots
    const sortedElements = Array.from(elements).sort((a, b) => {
      const aRect = a.getBoundingClientRect()
      const bRect = b.getBoundingClientRect()
      return (bRect.width * bRect.height) - (aRect.width * aRect.height)
    })

    const overlays: SlotOverlay[] = []

    // Build overlays incrementally to avoid circular reference
    for (const element of sortedElements) {
      const rect = element.getBoundingClientRect()
      const slotName = element.getAttribute('data-slot') || ''

      // Skip extremely tiny slots (less than 10x10 pixels)
      if (rect.width < 10 || rect.height < 10) continue

      const labelWidth = Math.max(60, slotName.length * 7 + 8)
      const labelHeight = 22

      // Simple corner selection - no complex offsets
      let labelPosition: SlotOverlay['labelPosition'] = 'top-left'

      // Try each corner and pick the one with least overlap
      const positions: SlotOverlay['labelPosition'][] = ['top-left', 'top-right', 'bottom-right', 'bottom-left']
      let minOverlap = Infinity
      let bestPosition: SlotOverlay['labelPosition'] = 'top-left'

      for (const pos of positions) {
        const baseX = pos.includes('left') ? rect.left : rect.right - labelWidth
        const baseY = pos.includes('top') ? rect.top : rect.bottom - labelHeight
        const labelRect = new DOMRect(baseX, baseY, labelWidth, labelHeight)

        // Count overlaps at this position
        let overlapCount = 0
        overlays.forEach((overlay) => {
          const overlayLabelWidth = Math.max(60, overlay.slot.length * 7 + 8)
          const overlayBaseX = overlay.labelPosition.includes('left') ? overlay.rect.left : overlay.rect.right - overlayLabelWidth
          const overlayBaseY = overlay.labelPosition.includes('top') ? overlay.rect.top : overlay.rect.bottom - labelHeight

          const overlayLabelRect = new DOMRect(overlayBaseX, overlayBaseY, overlayLabelWidth, labelHeight)
          if (rectsOverlap(labelRect, overlayLabelRect, 4)) {
            overlapCount++
          }
        })

        // Pick position with minimum overlap
        if (overlapCount < minOverlap) {
          minOverlap = overlapCount
          bestPosition = pos
        }

        // If we found a clear spot, use it immediately
        if (overlapCount === 0) {
          bestPosition = pos
          break
        }
      }

      labelPosition = bestPosition

      overlays.push({
        slot: slotName,
        rect,
        element,
        labelPosition
      })
    }

    slots.value = overlays
  } finally {
    isUpdating.value = false
  }
}

// Debounced versions for scroll and resize
const debouncedScroll = useDebounceFn(updateSlots, 10)
const debouncedResize = useDebounceFn(updateSlots, 100)

// Watch for changes in the target element
watch(() => props.target, updateSlots, { immediate: true })

// Update on scroll (debounced) and resize (debounced)
if (import.meta.client) {
  useEventListener('scroll', debouncedScroll, { passive: true })
  useEventListener('resize', debouncedResize, { passive: true })
}

// Get container bounds for positioning
const { top: containerTop, left: containerLeft } = useElementBounding(containerRef)

// Calculate overlay position relative to container
const getOverlayStyle = (rect: DOMRect) => {
  return {
    top: `${rect.top - containerTop.value}px`,
    left: `${rect.left - containerLeft.value}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`
  }
}

// Get label position classes
const getLabelPositionClass = (position: SlotOverlay['labelPosition']) => {
  const classes = {
    'top-left': 'top-0.5 left-0.5',
    'top-right': 'top-0.5 right-0.5',
    'bottom-left': 'bottom-0.5 left-0.5',
    'bottom-right': 'bottom-0.5 right-0.5'
  }
  return classes[position]
}

// Generate a consistent color for each slot name
const getSlotColor = (slotName: string) => {
  const colors = [
    'from-primary-500/20 to-primary-600/20 border-primary-500/50',
    'from-success-500/20 to-success-600/20 border-success-500/50',
    'from-warning-500/20 to-warning-600/20 border-warning-500/50',
    'from-error-500/20 to-error-600/20 border-error-500/50',
    'from-info-500/20 to-info-600/20 border-info-500/50',
    'from-purple-500/20 to-purple-600/20 border-purple-500/50',
    'from-pink-500/20 to-pink-600/20 border-pink-500/50',
    'from-orange-500/20 to-orange-600/20 border-orange-500/50'
  ]

  const hash = slotName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

const getLabelColor = (slotName: string) => {
  const colors = [
    'bg-primary-500/90 text-primary-50',
    'bg-success-500/90 text-success-50',
    'bg-warning-500/90 text-warning-50',
    'bg-error-500/90 text-error-50',
    'bg-info-500/90 text-info-50',
    'bg-purple-500/90 text-purple-50',
    'bg-pink-500/90 text-pink-50',
    'bg-orange-500/90 text-orange-50'
  ]

  const hash = slotName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}
</script>

<template>
  <div ref="containerRef" class="z-[50] pointer-events-none absolute inset-0 overflow-visible">
    <div
      v-for="(overlay, index) in slots"
      :key="`${overlay.slot}-${index}`"
      class="absolute border-2 border-dashed rounded-sm bg-gradient-to-br"
      :class="getSlotColor(overlay.slot)"
      :style="getOverlayStyle(overlay.rect)"
    >
      <div
        class="absolute px-1.5 py-0.5 rounded text-[11px] font-mono font-bold whitespace-nowrap shadow-xl backdrop-blur-md border border-white/20"
        :class="[getLabelColor(overlay.slot), getLabelPositionClass(overlay.labelPosition)]"
      >
        {{ overlay.slot }}
      </div>
    </div>
  </div>
</template>
