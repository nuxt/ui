<script setup lang="ts">
import { camelCase, upperFirst } from 'scule'
import * as theme from '#build/ui'
import { motion, type DOMKeyframesDefinition } from 'motion-v'

const props = defineProps<{
  example?: string

  prose?: boolean
  slug?: string

  props?: { [key: string]: any }
  slots?: { [key: string]: any }
  class?: string
}>()

const route = useRoute()
const name = props.slug ?? route.path.split('/').pop() ?? ''
const camelName = camelCase(name)

const component = computed(() => {
  if (props.example) {
    return camelName
  }
  if (props.prose) {
    return defineAsyncComponent(() => import(`#ui/components/prose/${upperFirst(camelName)}.vue`))
  }
  return defineAsyncComponent(() => import(`#ui/components/${upperFirst(camelName)}.vue`))
})

const computedTheme = computed(() => props.prose ? theme.prose : theme)
const componentTheme = computed(() => {
  return computedTheme.value?.[camelName as keyof typeof computedTheme['value']]
})

const themeSlots = computed(() => Object.keys(componentTheme.value?.slots ?? {}))

const target = useTemplateRef('target')
const container = useTemplateRef('container')
const outline = useTemplateRef('outline')

const animate = ref<DOMKeyframesDefinition>({
  opacity: 0
})

const highlightedSlot = ref<string | null>(null)
function highlightSlot(themeSlot: string) {
  if (!outline.value) return

  const slotElement = target.value?.querySelector(`[data-slot=${themeSlot}]`)

  if (!slotElement) {
    animate.value.opacity = 0
    highlightedSlot.value = null
    return
  }

  highlightedSlot.value = themeSlot

  const containerRect = container.value?.getBoundingClientRect()
  const targetRect = slotElement.getBoundingClientRect()

  const left = targetRect!.left - containerRect!.left
  const top = targetRect!.top - containerRect!.top

  animate.value = {
    x: left,
    y: top,
    width: targetRect.width,
    height: targetRect.height,
    opacity: 1
  }
}

function hideSlot(themeSlot: string) {
  if (themeSlot !== highlightedSlot.value) return

  highlightedSlot.value = null
  animate.value.opacity = 0
}

function onSlotClick(slot: string) {
  if (highlightedSlot.value === slot) hideSlot(slot)
  else highlightSlot(slot)
}

// Recomputes the outline position if the viewport dimension changes.
useEventListener('resize', useDebounceFn(() => {
  if (highlightedSlot.value) {
    highlightSlot(highlightedSlot.value)
  }
}, 200))
</script>

<template>
  <div v-show="themeSlots?.length" class="flex border border-muted rounded-md">
    <div ref="container" class="grow flex justify-center items-center relative overflow-hidden h-[800px]">
      <slot />
      <motion.div
        v-show="!!highlightedSlot"
        ref="outline"
        class="absolute border-2 border-primary rounded-md z-50 top-0 left-0 invert"
        :animate="animate"
        :transition="{
          duration: 0.4,
          type: 'spring',
          opacity: { type: 'tween', delay: 0.2 }
        }"
      >
        <div class="relative h-full w-full">
          <span class="absolute -top-8 right-0 rounded-md py-0.5 px-2 bg-primary font-bold"> <span class="text-inverted invert"> {{ highlightedSlot }} </span> </span>
          <svg class="h-full w-full stroke-primary bg-primary/30" fill="none">
            <defs>
              <pattern
                id="pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e"
                x="0"
                y="0"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3" />
              </pattern>
            </defs>
            <rect stroke="none" fill="url(#pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e)" width="100%" height="100%" />
          </svg>
        </div>
      </motion.div>
      <div ref="target" class="absolute">
        <slot>
          <component
            :is="component"
            v-bind="props.props"
          >
            <template v-for="slot in Object.keys(slots || {})" :key="slot" #[slot]>
              <slot :name="slot" mdc-unwrap="p">
                {{ slots?.[slot] }}
              </slot>
            </template>
          </component>
        </slot>
      </div>
    </div>
    <div class="flex-none flex flex-col gap-1 border-l border-muted p-4 min-w-40">
      <button
        v-for="slot in themeSlots"
        :key="slot"
        class="text-left rounded-md py-0.5 px-2 hover:bg-elevated transition"
        :class="{
          'bg-elevated': slot === highlightedSlot
        }"
        @click="onSlotClick(slot)"
      >
        {{ slot }}
      </button>
    </div>
  </div>
</template>
