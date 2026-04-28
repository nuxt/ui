<script setup lang="ts">
const virtualize = ref(true)
const orientation = ref<'vertical' | 'horizontal'>('vertical')
const estimateSize = ref(480)
const gap = ref(16)
const lanes = ref(4)

const heights = [320, 480, 640, 800]

// Pseudo-random height selection with longer cycle to avoid alignment patterns
function getHeight(index: number) {
  const seed = (index * 11 + 7) % 17
  return heights[seed % heights.length]!
}

const items = computed(() => {
  return Array.from({ length: 1000 }, (_, index) => {
    const height = getHeight(index)
    return {
      id: index,
      title: `Item ${index + 1}`,
      src: `https://picsum.photos/640/${height}?v=${index}`,
      width: 640,
      height
    }
  })
})

const virtualizeOptions = computed(() => {
  if (!virtualize.value) {
    return false
  }
  return {
    estimateSize: estimateSize.value,
    gap: gap.value,
    lanes: lanes.value
  }
})
</script>

<template>
  <Navbar>
    <USwitch v-model="virtualize" label="Virtualize" reverse />

    <UFieldGroup>
      <UButton
        color="neutral"
        variant="outline"
        active-variant="solid"
        active-color="primary"
        :active="orientation === 'vertical'"
        icon="i-lucide-move-vertical"
        @click="orientation = 'vertical'"
      />
      <UButton
        color="neutral"
        variant="outline"
        active-variant="solid"
        active-color="primary"
        :active="orientation === 'horizontal'"
        icon="i-lucide-move-horizontal"
        @click="orientation = 'horizontal'"
      />
    </UFieldGroup>

    <template v-if="virtualize">
      <UInput
        v-model.number="gap"
        type="number"
        :min="0"
        icon="i-lucide-between-vertical-start"
        :max="48"
      />

      <UInput
        v-model.number="lanes"
        type="number"
        :min="1"
        icon="i-lucide-layout-dashboard"
        :max="10"
      />
    </template>
  </Navbar>

  <UScrollArea
    v-slot="{ item }"
    :items="items"
    :orientation="orientation"
    :virtualize="virtualizeOptions"
    class="size-full p-4"
  >
    <img
      :src="item.src"
      :alt="item.title"
      :width="item.width"
      :height="item.height"
      loading="lazy"
      class="rounded-md size-full object-cover"
    >
  </UScrollArea>
</template>
