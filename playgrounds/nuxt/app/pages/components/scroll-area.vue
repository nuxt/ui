<script setup lang="ts">
const virtualize = ref(true)
const orientation = ref<'vertical' | 'horizontal'>('vertical')
const itemCount = ref(100)
const estimateSize = ref(100)
const gap = ref(12)
const padding = ref(12)
const lanes = ref(3)

type Item = {
  id: number
  title: string
  url?: string
  description?: string
  color?: string
}

// Generate items with variable sizes for dynamic sizing demo
const items = computed<Item[]>(() => {
  return Array.from({ length: itemCount.value }, (_, i) => {
    const aspectRatios = ['1/1', '4/3', '16/9']
    const descriptions = [
      `Item ${i + 1}`,
      `Item ${i + 1} with some additional text.`,
      `This is item number ${i + 1} with quite a bit more description text that demonstrates dynamic sizing with variable height content in masonry layouts.`,
      `Item ${i + 1} - short one.`
    ]
    return {
      id: i + 1,
      url: `https://picsum.photos/300/${aspectRatios[i % aspectRatios.length] === '1/1' ? 300 : aspectRatios[i % aspectRatios.length] === '4/3' ? 400 : 200}?random=${i}`,
      title: `Image ${i + 1}`,
      description: descriptions[i % descriptions.length]
    }
  })
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

    <div class="flex items-center gap-2">
      <UInput
        v-model.number="itemCount"
        type="number"
        icon="i-lucide-image"
        :min="10"
        :max="100000"
      />
    </div>

    <template v-if="virtualize">
      <!-- <div class="flex items-center gap-2">
        <span class="text-sm text-muted">Estimate:</span>
        <UInput
          v-model.number="estimateSize"
          type="number"
          :min="20"
          :max="500"
          class="w-24"
        />
      </div> -->

      <div class="flex items-center gap-2">
        <UInput
          v-model.number="gap"
          type="number"
          :min="0"
          icon="i-lucide-between-vertical-start"
          :max="50"
        />
      </div>

      <div class="flex items-center gap-2">
        <UInput
          v-model.number="padding"
          type="number"
          :min="0"
          :max="200"
          icon="i-lucide-square-dashed"
        />
      </div>

      <div class="flex items-center gap-2">
        <UInput
          v-model.number="lanes"
          type="number"
          :min="1"
          icon="i-lucide-layout-dashboard"
          :max="10"
        />
      </div>
    </template>
  </Navbar>

  <UCard :ui="{ body: '!p-0' }" class="w-5xl">
    <UScrollArea
      :items="items"
      :orientation="orientation"
      :virtualize="virtualize ? { estimateSize, gap, paddingStart: padding, paddingEnd: padding, lanes } : false"
      class="h-128"
    >
      <template v-if="orientation === 'horizontal'" #default="{ item }">
        <div class="flex flex-col h-full">
          <div class="bg-elevated rounded-lg overflow-hidden h-full">
            <img
              :src="item!.url"
              :alt="item!.title"
              class="w-full h-full object-cover"
            >
          </div>
          <p class="mt-2 text-sm text-center">
            {{ item!.title }}
          </p>
        </div>
      </template>

      <template v-else #default="{ item, index }">
        <UCard
          :ui="{
            root: `bg-${item!.color || 'blue'}-500/10 border-${item!.color || 'blue'}-500/20`,
            body: 'p-0 sm:p-0'
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">
                {{ item!.title }}
              </h3>
              <span class="text-xs text-muted">
                #{{ index }}
              </span>
            </div>
          </template>
          <div class="bg-elevated overflow-hidden h-full">
            <img
              :src="item!.url"
              :alt="item!.title"
              class="w-full h-full object-cover"
            >
          </div>
        </UCard>
      </template>
    </UScrollArea>
  </UCard>
</template>
