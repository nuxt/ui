<script setup lang="ts">
defineProps<{
  label: string
  icon?: string
  chip?: string
  selected?: boolean
}>()

const slots = defineSlots<{
  leading: () => any
}>()
</script>

<template>
  <UButton
    size="sm"
    color="neutral"
    variant="outline"
    :icon="icon"
    :label="label"
    class="capitalize ring-default rounded-sm text-[11px]"
    :class="[selected ? 'bg-elevated' : 'hover:bg-elevated/50']"
  >
    <template v-if="chip || !!slots.leading" #leading>
      <slot name="leading">
        <span
          class="inline-block size-2 rounded-full"
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
