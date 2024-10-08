<template>
  <UButton
    size="sm"
    color="neutral"
    :icon="icon"
    :label="label"
    :variant="selected ? 'soft' : 'outline'"
    class="capitalize ring-[--ui-border] rounded-[--ui-radius] text-[11px]"
    @click.stop.prevent="$emit('select')"
  >
    <template v-if="chip" #leading>
      <span
        class="inline-block w-2 h-2 rounded-full"
        :class="`bg-[--color-light] dark:bg-[--color-dark]`"
        :style="{
          '--color-light': `var(--color-${chip}-500)`,
          '--color-dark': `var(--color-${chip}-400)`
        }"
      />
    </template>
  </UButton>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  icon?: string
  chip?: string
  selected?: boolean
}>()
defineEmits(['select'])
</script>
