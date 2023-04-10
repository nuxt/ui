<template>
  <TabGroup as="div" :selected-index="selectedTab" @change="changeTab">
    <TabList class="flex border border-gray-200 dark:border-gray-700 border-b-0 rounded-t-md overflow-hidden">
      <Tab
        v-for="(tab, index) in tabs"
        :key="index"
        v-slot="{ selected }"
        as="template"
      >
        <button
          class="px-4 py-2 focus:outline-none text-sm border-b border-r border-r-gray-200 dark:border-r-gray-700"
          tabindex="-1"
          :class="[selected ? 'text-primary-500 dark:text-primary-400 bg-gray-50 dark:bg-gray-800 !border-b-primary-400' : '!border-b-transparent']"
        >
          {{ tab.label }}
        </button>
      </Tab>
    </TabList>

    <TabPanels class="relative">
      <TabPanel
        v-for="(tab, index) in tabs"
        :key="index"
        tabindex="-1"
        class="[&>pre]:!rounded-t-none"
      >
        <ClientOnly>
          <component :is="tab.component" />
        </ClientOnly>
      </TabPanel>
    </TabPanels>
  </TabGroup>
</template>

<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

const slots = useSlots()

const selectedTab = ref()

// Computed

const tabs = computed(() => slots.default?.().map((slot, index) => {
  return {
    label: slot.props?.filename || slot.props?.label || `${index}`,
    component: slot
  }
}) || [])

// Methods

function changeTab (index) {
  selectedTab.value = index
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
