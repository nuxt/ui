<script setup lang="ts">
const items = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`
}))

const scrollArea = useTemplateRef('scrollArea')
const targetIndex = ref(500)

function scrollToItem() {
  scrollArea.value?.scrollToIndex(targetIndex.value - 1, {
    align: 'center',
    behavior: 'smooth'
  })
}

function scrollToTop() {
  scrollArea.value?.scrollToIndex(0, {
    align: 'start',
    behavior: 'smooth'
  })
}

function scrollToBottom() {
  scrollArea.value?.scrollToIndex(items.length - 1, {
    align: 'end',
    behavior: 'smooth'
  })
}
</script>

<template>
  <div class="space-y-4 w-full">
    <div class="flex items-center gap-4">
      <UButton
        icon="i-lucide-arrow-up-to-line"
        color="neutral"
        variant="outline"
        @click="scrollToTop"
      >
        Top
      </UButton>
      <UButton
        icon="i-lucide-arrow-down-to-line"
        color="neutral"
        variant="outline"
        @click="scrollToBottom"
      >
        Bottom
      </UButton>
      <div class="flex items-center gap-2 flex-1">
        <UInput
          v-model="targetIndex"
          type="number"
          :min="1"
          :max="items.length"
          placeholder="Item number"
        />
        <UButton
          icon="i-lucide-navigation"
          @click="scrollToItem"
        >
          Go to Item
        </UButton>
      </div>
    </div>

    <UScrollArea
      ref="scrollArea"
      :items="items"
      :virtualize="{ estimateSize: 58 }"
      class="h-96 w-full border border-default rounded-lg p-4"
    >
      <template #default="{ item, index }">
        <div
          class="p-3 mb-2 rounded-lg border border-default"
          :class="index === targetIndex - 1 ? 'bg-primary-500/10 border-primary-500/20' : 'bg-elevated'"
        >
          <span class="font-medium">{{ item.title }}</span>
        </div>
      </template>
    </UScrollArea>
  </div>
</template>
