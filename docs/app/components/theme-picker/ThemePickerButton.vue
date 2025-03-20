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

function getTWShade<
  S extends 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
>(shade: S): string {
  if (twColor.value && typeof twColor.value === 'object' && shade in twColor.value) {
    return twColor.value[shade as unknown as keyof typeof twColor.value] as string
  }
  return ''
}
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
            '--color-light': getTWShade(500),
            '--color-dark': getTWShade(400)
          }"
        />
      </slot>
    </template>
  </UButton>
</template>
