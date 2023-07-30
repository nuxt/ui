<template>
  <HTabGroup :vertical="orientation === 'vertical'" :default-index="defaultIndex" as="div" :class="ui.wrapper" @change="onChange">
    <HTabList
      :class="[ui.list.base, ui.list.background, ui.list.rounded, ui.list.shadow, ui.list.padding, ui.list.width, orientation === 'horizontal' && ui.list.height, orientation === 'horizontal' && 'inline-grid items-center']"
      :style="[orientation === 'horizontal' && `grid-template-columns: repeat(${items.length}, minmax(0, 1fr))`]"
    >
      <div ref="markerRef" :class="ui.list.marker.wrapper">
        <div :class="[ui.list.marker.base, ui.list.marker.background, ui.list.marker.rounded, ui.list.marker.shadow]" />
      </div>

      <HTab
        v-for="(item, index) of items"
        :key="index"
        ref="itemRefs"
        v-slot="{ selected, disabled }"
        :disabled="item.disabled"
        as="template"
      >
        <button :class="[ui.list.tab.base, ui.list.tab.background, ui.list.tab.height, ui.list.tab.padding, ui.list.tab.size, ui.list.tab.font, ui.list.tab.rounded, ui.list.tab.shadow, selected ? ui.list.tab.active : ui.list.tab.inactive]">
          <slot :item="item" :index="index" :selected="selected" :disabled="disabled">
            {{ item.label }}
          </slot>
        </button>
      </HTab>
    </HTabList>

    <HTabPanels :class="ui.container">
      <HTabPanel
        v-for="(item, index) of items"
        :key="index"
        v-slot="{ selected }"
        :class="ui.base"
      >
        <slot :name="item.slot || 'item'" :item="item" :index="index" :selected="selected">
          {{ item.content }}
        </slot>
      </HTabPanel>
    </HTabPanels>
  </HTabGroup>
</template>

<script lang="ts">
import { ref, computed, onMounted, defineComponent } from 'vue'
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
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
      validator: (value: string) => ['horizontal', 'vertical'].includes(value)
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
