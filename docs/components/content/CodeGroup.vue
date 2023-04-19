<template>
  <div :selected-index="selectedIndex" @change="changeTab">
    <div class="flex border border-gray-200 dark:border-gray-700 border-b-0 rounded-t-md overflow-hidden -mb-px">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        as="template"
        @click="selectedIndex = index"
      >
        <button
          class="px-4 py-2 focus:outline-none text-sm border-r border-r-gray-200 dark:border-r-gray-700 transition-colors"
          tabindex="-1"
          :class="[selectedIndex === index ? 'font-medium text-primary-500 dark:text-primary-400 bg-gray-50 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800']"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="[&>div>pre]:!rounded-t-none">
      <component :is="selectedTab.component" />
    </div>
  </div>
</template>

<script setup lang="ts">
const slots = useSlots()

const selectedIndex = ref(0)

// Computed

const tabs = computed(() => slots.default?.().map((slot, index) => {
  return {
    label: slot.props?.filename || slot.props?.label || `${index}`,
    component: slot
  }
}) || [])

const selectedTab = computed(() => tabs.value.find((_, index) => index === selectedIndex.value))

// Methods

function changeTab (index) {
  selectedIndex.value = index
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
