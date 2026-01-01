<script setup lang="ts" generic="T extends Record<string, string[]>">
const props = defineProps<{
  attrs: T
  containerClass?: string
  containerProps?: Record<string, string>
}>()

defineSlots<{
  default: (props?: { [K in keyof T]: T[K] extends (infer U)[] ? U : never }) => any
}>()

const combinations = computed(() => {
  const keys = Object.keys(props.attrs)
  const values = Object.values(props.attrs)

  if (keys.length === 0) {
    return [{}]
  }

  const result: Record<string, string>[] = []

  function generateCombinations(index: number, current: Record<string, string>) {
    if (index === keys.length) {
      result.push({ ...current })
      return
    }

    const key = keys[index]
    const valueArray = values[index] || []

    for (const value of valueArray) {
      generateCombinations(index + 1, { ...current, [key as string]: value })
    }
  }

  generateCombinations(0, {})
  return result
})
</script>

<template>
  <div class="flex items-start gap-2 min-h-0">
    <template v-for="(combination, index) in combinations" :key="index">
      <div class="flex flex-col items-start gap-2" :class="props.containerClass" v-bind="props.containerProps">
        <slot v-bind="combination" />
      </div>
    </template>
  </div>
</template>
