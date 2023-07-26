<template>
  <HTabGroup :vertical="vertical" :default-index="defaultIndex" as="div" @change="onChange">
    <HTabList
      class="rounded-lg bg-gray-100 dark:bg-gray-800 p-1 relative items-center w-full"
      :class="[!vertical && 'h-10 inline-grid']"
      :style="[!vertical && `grid-template-columns: repeat(${items.length}, minmax(0, 1fr))`]"
    >
      <div ref="markerRef" class="absolute top-[4px] left-[4px] duration-200 ease-out">
        <div class="w-full h-full bg-white dark:bg-gray-900 rounded-md shadow-sm" />
      </div>

      <HTab
        v-for="(item, index) of items"
        :key="index"
        ref="itemRefs"
        :disabled="item.disabled"
        as="template"
      >
        <button class="relative inline-flex items-center justify-center w-full h-8 px-3 text-sm font-medium rounded-md cursor-pointer whitespace-nowrap focus:outline-none disabled:cursor-not-allowed disabled:opacity-75">
          {{ item.label }}
        </button>
      </HTab>
    </HTabList>

    <HTabPanels class="mt-2">
      <HTabPanel
        v-for="(item, index) of items"
        :key="index"
        v-slot="{ selected }"
        class=" focus:outline-none"
      >
        <slot :name="item.slot || 'item'" :item="item" :index="index" :selected="selected">
          {{ item.content }}
        </slot>
      </HTabPanel>
    </HTabPanels>
  </HTabGroup>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { TabGroup as HTabGroup, TabList as HTabList, Tab as HTab, TabPanels as HTabPanels, TabPanel as HTabPanel } from '@headlessui/vue'
import { defu } from 'defu'
import type { TabItem } from '../../types/tabs'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    HTabGroup,
    HTabList,
    HTab,
    HTabPanels,
    HTabPanel
  },
  props: {
    vertical: {
      type: Boolean,
      default: false
    },
    defaultIndex: {
      type: Number,
      default: 0
    },
    items: {
      type: Array as PropType<TabItem[]>,
      default: () => []
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.tabs>>,
      default: () => appConfig.ui.tabs
    }
  },
  setup (props) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.tabs>>(() => defu({}, props.ui, appConfig.ui.tabs))

    const itemRefs = ref<HTMLElement[]>([])
    const markerRef = ref<HTMLElement>()

    // Methods

    function onChange (index) {
      // @ts-ignore
      const tab = itemRefs.value[index]?.$el
      if (!tab) {
        return
      }

      markerRef.value.style.top = `${tab.offsetTop}px`
      markerRef.value.style.left = `${tab.offsetLeft}px`
      markerRef.value.style.width = `${tab.offsetWidth}px`
      markerRef.value.style.height = `${tab.offsetHeight}px`
    }

    onMounted(() => onChange(props.defaultIndex))

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      itemRefs,
      markerRef,
      onChange
    }
  }
})
</script>
