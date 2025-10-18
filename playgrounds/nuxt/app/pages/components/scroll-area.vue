<script setup lang="ts">
const virtualize = ref(true)
const orientation = ref<'vertical' | 'horizontal'>('vertical')
const itemCount = ref(100)
const estimateSize = ref(100)
const gap = ref(12)
const padding = ref(12)
const lanes = ref(3)

// Responsive lanes settings
const useResponsive = ref(false)
const laneWidth = ref(200)
const minLanes = ref(1)
const maxLanes = ref(6)

// Resizable container
const containerWidth = ref(800)

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
          :disabled="useResponsive"
        />
      </div>

      <USwitch v-model="useResponsive" label="Responsive" reverse />

      <template v-if="useResponsive">
        <div class="flex items-center gap-2">
          <UInput
            v-model.number="laneWidth"
            type="number"
            :min="50"
            :max="500"
            icon="i-lucide-panel-left"
          />
        </div>

        <div class="flex items-center gap-2">
          <UInput
            v-model.number="minLanes"
            type="number"
            :min="1"
            :max="10"
            icon="i-lucide-arrow-down-to-line"
          />
        </div>

        <div class="flex items-center gap-2">
          <UInput
            v-model.number="maxLanes"
            type="number"
            :min="1"
            :max="10"
            icon="i-lucide-arrow-up-to-line"
          />
        </div>
      </template>
    </template>
  </Navbar>

  <UCard :ui="{ body: '!p-0 h-full' }" :class="useResponsive ? '' : 'w-5xl'" :style="{ width: useResponsive ? `${containerWidth}px` : undefined, height: useResponsive ? '600px' : undefined, resize: useResponsive ? 'both' : undefined, overflow: useResponsive ? 'auto' : undefined, minWidth: useResponsive ? '300px' : undefined, minHeight: useResponsive ? '300px' : undefined }">
    <UScrollArea
      :items="items"
      :orientation="orientation"
      :virtualize="virtualize ? {
        estimateSize,
        gap,
        paddingStart: padding,
        paddingEnd: padding,
        lanes: useResponsive ? undefined : lanes,
        laneWidth: useResponsive ? laneWidth : undefined,
        minLanes: useResponsive ? minLanes : undefined,
        maxLanes: useResponsive ? maxLanes : undefined
      } : false"
      :class="useResponsive ? '' : 'h-128'"
      :style="{ height: useResponsive ? '100%' : undefined }"
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
