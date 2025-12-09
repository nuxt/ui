<script setup lang="ts">
import { camelCase } from 'scule'
import * as theme from '#build/ui'

const props = defineProps<{
  /**
   * The container element to find slots in.
   */
  container: HTMLElement | null
  /**
   * The positioned ancestor for highlight positioning.
   * If not provided, uses container.
   */
  positionContainer?: HTMLElement | null
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
const highlightedSlot = ref<string | null>(null)
const highlightStyle = ref<{ left: string, top: string, width: string, height: string } | null>(null)

function getSlotClasses(slotName: string): string {
  const baseClasses = componentTheme.value?.slots?.[slotName] || ''
  return Array.isArray(baseClasses) ? baseClasses.filter(Boolean).join(' ') : baseClasses
}

function getSlotPosition(slotName: string) {
  if (!props.container) return null

  const slotElement = props.container.querySelector(`[data-slot="${slotName}"]`)
  if (!slotElement) return null

  const positionEl = props.positionContainer ?? props.container
  const positionRect = positionEl!.getBoundingClientRect()
  const targetRect = slotElement.getBoundingClientRect()

  return {
    left: `${targetRect.left - positionRect.left}px`,
    top: `${targetRect.top - positionRect.top}px`,
    width: `${targetRect.width}px`,
    height: `${targetRect.height}px`
  }
}

// Initialize position to first rendered slot (so first hover can animate from there)
function initializePosition() {
  for (const slotName of themeSlots.value) {
    const position = getSlotPosition(slotName)
    if (position) {
      highlightStyle.value = position
      break
    }
  }
}

function highlightSlot(slotName: string) {
  highlightedSlot.value = slotName

  const position = getSlotPosition(slotName)
  if (!position) return

  highlightStyle.value = position
}

function clearHighlight() {
  highlightedSlot.value = null
}

function isSlotRendered(slotName: string): boolean {
  if (!props.container) return false
  return !!props.container.querySelector(`[data-slot="${slotName}"]`)
}

// Initialize position when popover opens, clear when closes
watch(open, (isOpen) => {
  if (isOpen) {
    initializePosition()
  } else {
    clearHighlight()
    highlightStyle.value = null
  }
})
</script>

<template>
  <template v-if="themeSlots.length">
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
        class="absolute -top-[11px] -right-[11px] z-1 rounded-full lg:opacity-0 lg:group-hover/component:opacity-100 ring-muted transition-opacity duration-200"
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
        </div>
      </template>
    </UPopover>

    <div
      v-if="highlightStyle"
      :style="highlightStyle"
      class="absolute pointer-events-none border-2 border-dashed border-primary invert z-1 rounded transition-all duration-150"
      :class="[highlightedSlot ? 'opacity-100' : 'opacity-0']"
    >
      <div
        v-if="highlightedSlot"
        class="absolute -top-6 -left-0.5 px-1.5 py-0.5 text-xs font-medium font-mono bg-primary text-highlighted rounded whitespace-nowrap"
      >
        {{ highlightedSlot }}
      </div>
    </div>
  </template>
</template>
