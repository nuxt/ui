<script setup lang="ts">
import { camelCase } from 'scule'
import * as theme from '#build/ui'
import { motion } from 'motion-v'
import type { DOMKeyframesDefinition } from 'motion-v'

const props = defineProps<{
  /**
   * The container element to visualize slots for.
   */
  container: HTMLElement | null
  /**
   * Override the component slug taken from the route.
   */
  slug?: string
  /**
   * Whether the component is a prose component.
   */
  prose?: boolean
}>()

const route = useRoute()

const camelName = computed(() => camelCase(props.slug ?? route.path.split('/').pop() ?? ''))
const componentTheme = computed(() => ((props.prose ? theme.prose : theme) as any)[camelName.value])

// Get all slot names from theme definition
const themeSlots = computed(() => Object.keys(componentTheme.value?.slots ?? {}))

const open = ref(false)
const visualizerRef = ref<HTMLElement | null>(null)
const highlightedSlot = ref<string | null>(null)

const animate = ref<DOMKeyframesDefinition>({
  opacity: 0
})

function getSlotClasses(slotName: string): string {
  const baseClasses = componentTheme.value?.slots?.[slotName] || ''
  return Array.isArray(baseClasses) ? baseClasses.filter(Boolean).join(' ') : baseClasses
}

function highlightSlot(slotName: string) {
  if (!props.container) {
    animate.value = { opacity: 0 }
    highlightedSlot.value = slotName
    return
  }

  // Find element with data-slot attribute, excluding visualizer elements
  const elements = props.container.querySelectorAll(`[data-slot="${slotName}"]`)
  let slotElement: Element | null = null

  for (const el of elements) {
    if (!visualizerRef.value?.contains(el)) {
      slotElement = el
      break
    }
  }

  if (!slotElement) {
    animate.value = { opacity: 0 }
    highlightedSlot.value = slotName
    return
  }

  highlightedSlot.value = slotName

  const containerRect = props.container.getBoundingClientRect()
  const targetRect = slotElement.getBoundingClientRect()

  const left = targetRect.left - containerRect.left
  const top = targetRect.top - containerRect.top

  animate.value = {
    x: left,
    y: top,
    width: targetRect.width,
    height: targetRect.height,
    opacity: 1
  }
}

function clearHighlight() {
  highlightedSlot.value = null
  animate.value = { opacity: 0 }
}

function isSlotRendered(slotName: string): boolean {
  if (!props.container) return false

  const elements = props.container.querySelectorAll(`[data-slot="${slotName}"]`)
  for (const el of elements) {
    if (!visualizerRef.value?.contains(el)) {
      return true
    }
  }
  return false
}

// Clear highlight when popover closes
watch(open, (isOpen) => {
  if (!isOpen) {
    clearHighlight()
  }
})
</script>

<template>
  <div ref="visualizerRef" class="group">
    <UPopover
      v-model:open="open"
      :content="{ align: 'start' }"
      :ui="{ content: 'w-64 max-h-72 overflow-y-auto' }"
    >
      <UButton
        icon="i-lucide-scan-eye"
        color="neutral"
        variant="outline"
        size="sm"
        class="absolute -top-[11px] -right-[11px] z-55 rounded-full lg:opacity-0 lg:group-hover/component:opacity-100 ring-muted"
        :class="[open && 'lg:opacity-100 bg-elevated']"
      />

      <template #content>
        <div class="px-2.5 py-1.5 text-xs font-semibold text-highlighted border-b border-default">
          Theme slots
        </div>
        <div class="p-1">
          <div
            v-for="slotName in themeSlots"
            :key="slotName"
            class="p-1.5 cursor-default hover:bg-elevated/50 transition-colors rounded"
            :class="[highlightedSlot === slotName && 'bg-elevated/50']"
            @mouseenter="highlightSlot(slotName)"
            @mouseleave="clearHighlight"
          >
            <div class="flex items-center gap-2">
              <code class="text-xs font-medium" :class="[isSlotRendered(slotName) ? 'text-highlighted' : 'text-muted']">{{ slotName }}</code>
              <span v-if="!isSlotRendered(slotName)" class="text-[10px] text-muted">(not rendered)</span>
            </div>
            <div v-if="getSlotClasses(slotName)" class="mt-0.5 text-[10px] text-muted line-clamp-2 font-mono">
              {{ getSlotClasses(slotName) }}
            </div>
          </div>
          <div v-if="!themeSlots.length" class="p-1.5 text-xs text-muted">
            No slots found
          </div>
        </div>
      </template>
    </UPopover>

    <!-- Highlight overlay with motion animation -->
    <component
      :is="motion.div"
      :animate="animate"
      :transition="{ type: 'spring', stiffness: 500, damping: 30 }"
      class="absolute top-0 left-0 pointer-events-none border border-dashed border-primary invert z-55"
    >
      <div
        v-if="highlightedSlot && (animate as any).opacity === 1"
        class="absolute -top-6 left-0 px-1.5 py-0.5 text-xs font-medium font-mono bg-gray-900 text-white rounded-t whitespace-nowrap"
      >
        {{ highlightedSlot }}
      </div>
    </component>
  </div>
</template>
