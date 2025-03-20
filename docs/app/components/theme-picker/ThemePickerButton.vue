<script setup lang="ts">
import colors from 'tailwindcss/colors'

const props = defineProps<{
  label: string
  icon?: string
  chip?: string
  selected?: boolean
}>()

const twColor = computed(() => {
  if (!props.chip) return undefined
  return colors[props.chip as keyof typeof colors]
})
</script>

<template>
  <UButton
    size="sm"
    color="neutral"
    variant="outline"
    :icon="icon"
    :label="label"
    class="capitalize ring-(--ui-border) rounded-[calc(var(--ui-radius))] text-[11px]"
    :class="[selected ? 'bg-(--ui-bg-elevated)' : 'hover:bg-(--ui-bg-elevated)/50']"
  >
    <template v-if="twColor" #leading>
      <slot name="leading">
        <span
          class="inline-block size-2 rounded-full"
          :class="`bg-(--color-light) dark:bg-(--color-dark)`"
          :style="{
            '--color-light': `${twColor[500]}`,
            '--color-dark': `${twColor[400]}`
          }"
        />
      </slot>
    </template>
  </UButton>
</template>
