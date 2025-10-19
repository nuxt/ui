<script setup lang="ts">
const orientation = ref<'vertical' | 'horizontal'>('vertical')

const items = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`
}))
</script>

<template>
  <div class="space-y-4 w-full">
    <UFieldGroup>
      <UButton
        color="neutral"
        variant="outline"
        active-variant="solid"
        active-color="primary"
        :active="orientation === 'vertical'"
        icon="i-lucide-arrow-down"
        @click="orientation = 'vertical'"
      />
      <UButton
        color="neutral"
        variant="outline"
        active-variant="solid"
        active-color="primary"
        :active="orientation === 'horizontal'"
        icon="i-lucide-arrow-right"
        @click="orientation = 'horizontal'"
      />
    </UFieldGroup>

    <UScrollArea
      :items="items"
      :orientation="orientation"
      :class="orientation === 'vertical' ? 'h-96' : 'w-full'"
      class="border border-default rounded-lg p-4"
      :ui="{ root: 'gap-4' }"
    >
      <template #default="{ item }">
        <UCard>
          <template #header>
            <h3 class="font-semibold">
              {{ item.title }}
            </h3>
          </template>
          <p class="text-sm text-muted">
            {{ item.description }}
          </p>
        </UCard>
      </template>
    </UScrollArea>
  </div>
</template>
