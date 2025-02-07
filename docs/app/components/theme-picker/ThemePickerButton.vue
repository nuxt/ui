<script setup lang="ts">
defineProps<{
  label: string
  icon?: string
  chip?: string
  selected?: boolean
}>()
</script>

<template>
  <UButton
    size="sm"
    color="neutral"
    :icon="icon"
    :label="label"
    :variant="selected ? 'soft' : 'outline'"
    class="capitalize ring-(--ui-border) rounded-(--ui-radius) text-[11px]"
  >
    <template v-if="chip" #leading>
      <slot name="leading">
        <span
          class="inline-block w-2 h-2 rounded-full"
          :class="`bg-(--color-light) dark:bg-(--color-dark)`"
          :style="{
            '--color-light': `var(--color-${chip}-500)`,
            '--color-dark': `var(--color-${chip}-400)`
          }"
        />
      </slot>
    </template>
  </UButton>
</template>
