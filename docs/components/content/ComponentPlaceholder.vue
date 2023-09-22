<template>
  <div
    ref="el"
    class="rounded-lg border bg-gray-800 border-gray-700 cursor-pointer relative p-4 gap-4 flex"
    :class="[
      type === 'slot' && 'border-dashed',
      type === 'component' && name && 'rounded-tl-none mt-[26px]',
      isChildrenHovered && 'bg-opacity-0'
    ]"
  >
    <p v-if="type === 'component' && name" class="text-white text-xs font-medium absolute -top-[26px] -left-[1px] rounded-t-lg px-2 py-1 bg-gray-800 border border-gray-700" :class="[isChildrenHovered && 'bg-opacity-0', isHovered && '!text-primary']">
      {{ name }}
    </p>
    <p v-else-if="type === 'slot' && name" class="px-2 py-2 text-white text-xs font-medium font-mono -my-4 -mx-3">
      {{ name }}
    </p>
    <svg v-else-if="type === 'placeholder'" class="absolute inset-0 h-full w-full stroke-gray-900/10 dark:stroke-white/10" fill="none">
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

    <ComponentPlaceholder v-for="(component, index) in children" :key="index" v-bind="component" :level="level + 1" @hover="onHover" />
  </div>
</template>

<script setup lang="ts">
import { useElementHover } from '@vueuse/core'

const el = ref()

type T = {
  name?: string
  type?: 'component' | 'slot' | 'placeholder'
  level?: number
  children?: T[]
}

withDefaults(defineProps<T>(), {
  name: undefined,
  level: 0,
  type: 'component',
  children: () => []
})

const emit = defineEmits(['hover'])

const isHovered = useElementHover(el)
const isChildrenHovered = ref(false)

watch(isHovered, () => {
  emit('hover', isHovered.value)
})

function onHover (hover: boolean) {
  isChildrenHovered.value = hover

  emit('hover', hover)
}
</script>
