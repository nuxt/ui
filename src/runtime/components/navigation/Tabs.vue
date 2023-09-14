<template>
  <HTabGroup
    :vertical="orientation === 'vertical'"
    :selected-index="selectedIndex"
    as="div"
    :class="wrapperClass"
    v-bind="attrs"
    @change="onChange"
  >
    <HTabList
      ref="listRef"
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
import { ref, computed, watch, onMounted, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { TabGroup as HTabGroup, TabList as HTabList, Tab as HTab, TabPanels as HTabPanels, TabPanel as HTabPanel } from '@headlessui/vue'
import { useResizeObserver } from '@vueuse/core'
import { omit } from 'lodash-es'
import { twMerge } from 'tailwind-merge'
import { defuTwMerge } from '../../utils'
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
  inheritAttrs: false,
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
      type: Array as PropType<TabItem[]>,
      default: () => []
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.tabs>>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { attrs, emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.tabs>>(() => defuTwMerge({}, props.ui, appConfig.ui.tabs))

    const listRef = ref<HTMLElement>()
    const itemRefs = ref<HTMLElement[]>([])
    const markerRef = ref<HTMLElement>()

    const selectedIndex = ref(props.modelValue || props.defaultIndex)

    const wrapperClass = computed(() => twMerge(ui.value.wrapper, attrs.class as string))

    // Methods

    function calcMarkerSize (index: number) {
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

    function onChange (index) {
      selectedIndex.value = index

      emit('change', index)

      if (props.modelValue !== undefined) {
        emit('update:modelValue', index)
      }

      calcMarkerSize(index)
    }

    useResizeObserver(listRef, () => {
      calcMarkerSize(selectedIndex.value)
    })

    watch(() => props.modelValue, (value) => {
      selectedIndex.value = value
      calcMarkerSize(value)
    })

    onMounted(() => calcMarkerSize(selectedIndex.value))

    return {
      attrs: computed(() => omit(attrs, ['class'])),
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      listRef,
      itemRefs,
      markerRef,
      selectedIndex,
      wrapperClass,
      onChange
    }
  }
})
</script>
