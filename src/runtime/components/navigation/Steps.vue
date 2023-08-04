<template>
  <HTabGroup :vertical="orientation === 'vertical'" :selected-index="selectedIndex" as="div" :class="ui.wrapper" @change="onChange">
    <HTabList
      ref="listRef"
      :class="[ui.list.base, ui.list.rounded, ui.list.shadow, ui.list.padding, ui.list.width, orientation === 'horizontal' && ui.list.height, orientation === 'horizontal' && 'inline-grid items-center']"
      :style="[orientation === 'horizontal' && `grid-template-columns: repeat(${items.length}, minmax(0, 1fr))`]"
    >
      <HTab
        v-for="(item, index) of items"
        :key="index"
        ref="itemRefs"
        v-slot="{ selected, disabled }"
        :disabled="item.disabled"
        as="template"
      >
        <button :class="[ui.list.step.base, ui.list.step.background, ui.list.step.height, ui.list.step.padding, ui.list.step.size, ui.list.step.font, ui.list.step.rounded, ui.list.step.shadow, selected ? ui.list.step.active : ui.list.step.inactive]">
          <div :class="ui.list.marker.wrapper">
            <div :class="[ui.list.marker.base, ui.list.marker.background, ui.list.marker.rounded, selected ? ui.list.marker.active : ui.list.marker.inactive]" />
          </div>
          <slot :item="item" :index="index" :selected="selected" :disabled="disabled">
            <label>{{ item.label }}</label>
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
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { TabGroup as HTabGroup, TabList as HTabList, Tab as HTab, TabPanels as HTabPanels, TabPanel as HTabPanel } from '@headlessui/vue'
import type { StepItem } from '../../types/steps'
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
    modelValue: {
      type: Number,
      default: undefined
    },
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
      type: Array as PropType<StepItem[]>,
      default: () => []
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.steps>>,
      default: () => appConfig.ui.steps
    }
  },
  emits: ['update:modelValue', 'change']
})
  </script>
