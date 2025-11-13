<script setup lang="ts">
const props = defineProps<{
  targetIndex?: number
  itemCount?: number
}>()

const items = computed(() => Array.from({ length: props.itemCount || 1000 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`
})))

const scrollArea = useTemplateRef('scrollArea')

function scrollToTop() {
  scrollArea.value?.scrollToIndex(0, { align: 'start', behavior: 'smooth' })
}

function scrollToBottom() {
  scrollArea.value?.scrollToIndex(items.value.length - 1, { align: 'end', behavior: 'smooth' })
}

function scrollToItem(index: number) {
  scrollArea.value?.scrollToIndex(index - 1, { align: 'center', behavior: 'smooth' })
}
</script>

<template>
  <div class="space-y-4 w-full">
    <UScrollArea
      ref="scrollArea"
      :items="items"
      :virtualize="{ estimateSize: 58 }"
      class="h-96 w-full border border-default rounded-lg p-4"
    >
      <template #default="{ item, index }">
        <div
          class="p-3 mb-2 rounded-lg border border-default"
          :class="index === (targetIndex || 500) - 1 ? 'bg-primary-500/10 border-primary-500/20' : 'bg-elevated'"
        >
          <span class="font-medium">{{ item.title }}</span>
        </div>
      </template>
    </UScrollArea>

    <UFieldGroup size="sm">
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
