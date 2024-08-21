<template>
  <UTooltip :text="color" class="capitalize" :portal="false">
    <UButton
      color="gray"
      square
      :variant="color === selected ? 'soft' : 'ghost'"
      @click.stop.prevent="$emit('select')"
    >
      <span
        class="inline-block w-3 h-3 rounded-full"
        :class="`bg-[--color-light] dark:bg-[--color-dark]`"
        :style="{
          '--color-light': `var(--color-${color}-500)`,
          '--color-dark': `var(--color-${color}-400)`
        }"
      />
    </UButton>
  </UTooltip>
</template>

<script setup lang="ts">
defineProps<{ color: string, selected: string }>()
defineEmits(['select'])
</script>
