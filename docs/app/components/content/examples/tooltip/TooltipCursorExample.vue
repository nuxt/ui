<script setup lang="ts">
const open = ref(false)
const anchor = ref({ x: 0, y: 0 })

const reference = computed(() => ({
  getBoundingClientRect: () =>
    ({
      width: 0,
      height: 0,
      left: anchor.value.x,
      right: anchor.value.x,
      top: anchor.value.y,
      bottom: anchor.value.y,
      ...anchor.value
    } as DOMRect)
}))
</script>

<template>
  <UTooltip
    :open="open"
    :reference="reference"
    :content="{ side: 'top', sideOffset: 16, updatePositionStrategy: 'always' }"
  >
    <div
      class="flex items-center justify-center rounded-md border border-dashed border-accented text-sm aspect-video w-72"
      @pointerenter="open = true"
      @pointerleave="open = false"
      @pointermove="(ev) => {
        anchor.x = ev.clientX
        anchor.y = ev.clientY
      }"
    >
      Hover me
    </div>

    <template #content>
      {{ anchor.x.toFixed(0) }} - {{ anchor.y.toFixed(0) }}
    </template>
  </UTooltip>
</template>
