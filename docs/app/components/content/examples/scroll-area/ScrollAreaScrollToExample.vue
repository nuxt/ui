<script setup lang="ts">
const items = computed(() => Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`
})))

const scrollArea = useTemplateRef('scrollArea')

const targetIndex = ref(500)

function scrollToTop() {
  scrollArea.value?.virtualizer?.scrollToIndex(0, { align: 'start', behavior: 'smooth' })
}

function scrollToBottom() {
  scrollArea.value?.virtualizer?.scrollToIndex(items.value.length - 1, { align: 'end', behavior: 'smooth' })
}

function scrollToItem(index: number) {
  scrollArea.value?.virtualizer?.scrollToIndex(index - 1, { align: 'center', behavior: 'smooth' })
}
</script>

<template>
  <div class="w-full">
    <UScrollArea
      v-slot="{ item, index }"
      ref="scrollArea"
      :items="items"
      :virtualize="{ estimateSize: 72 }"
      class="h-96 w-full"
    >
      <UPageCard
        v-bind="item"
        :variant="index % 2 === 0 ? 'soft' : 'outline'"
        class="rounded-none isolate"
        :class="[index === (targetIndex - 1) && 'bg-primary']"
      />
    </UScrollArea>

    <UFieldGroup size="sm" class="px-4 py-3 border-t border-muted w-full">
      <UButton icon="i-lucide-arrow-up-to-line" color="neutral" variant="outline" @click="scrollToTop">
        Top
      </UButton>
      <UButton icon="i-lucide-arrow-down-to-line" color="neutral" variant="outline" @click="scrollToBottom">
        Bottom
      </UButton>
      <UButton icon="i-lucide-navigation" color="neutral" variant="outline" @click="scrollToItem(targetIndex || 500)">
        Go to {{ targetIndex || 500 }}
      </UButton>
    </UFieldGroup>
  </div>
</template>
