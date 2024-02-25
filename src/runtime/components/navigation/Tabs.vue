<template>
  <HTabGroup
    :vertical="orientation === 'vertical'"
    :selected-index="selectedIndex"
    as="div"
    :class="_ui.wrapper"
    v-bind="attrs"
    @change="onChange"
  >
    <HTabList
      ref="listRef"
      :class="[_ui.list.base, _ui.list.background, _ui.list.rounded, _ui.list.shadow, _ui.list.padding, _ui.list.width, orientation === 'horizontal' && _ui.list.height, orientation === 'horizontal' && 'inline-grid items-center']"
      :style="[orientation === 'horizontal' && `grid-template-columns: repeat(${items.length}, minmax(0, 1fr))`]"
    >
      <div ref="markerRef" :class="_ui.list.marker.wrapper">
        <div :class="[_ui.list.marker.base, _ui.list.marker.background, _ui.list.marker.rounded, _ui.list.marker.shadow]" />
      </div>

      <HTab
        v-for="(item, index) of items"
        :key="index"
        ref="itemRefs"
        v-slot="{ selected, disabled }"
        :disabled="item.disabled"
        as="template"
      >
        <button :class="[_ui.list.tab.base, _ui.list.tab.background, _ui.list.tab.height, _ui.list.tab.padding, _ui.list.tab.size, _ui.list.tab.font, _ui.list.tab.rounded, _ui.list.tab.shadow, selected ? _ui.list.tab.active : _ui.list.tab.inactive]">
          <slot :item="item" :index="index" :selected="selected" :disabled="disabled">
            <span class="truncate">{{ item.label }}</span>
          </slot>
        </button>
      </HTab>
    </HTabList>

    <HTabPanels :class="_ui.container">
      <HTabPanel v-for="(item, index) of items" :key="index" v-slot="{ selected }" :class="_ui.base" :unmount="unmount">
        <slot :name="item.slot || 'item'" :item="item" :index="index" :selected="selected">
          {{ item.content }}
        </slot>
      </HTabPanel>
    </HTabPanels>
  </HTabGroup>
</template>

<script lang="ts">
import { toRef, ref, watch, onMounted, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { TabGroup as HTabGroup, TabList as HTabList, Tab as HTab, TabPanels as HTabPanels, TabPanel as HTabPanel, provideUseId } from '@headlessui/vue'
import { useResizeObserver } from '@vueuse/core'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { TabItem, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { tabs } from '#ui/ui.config'
import { useId } from '#imports'

const config = mergeConfig<typeof tabs>(appConfig.ui.strategy, appConfig.ui.tabs, tabs)

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
    unmount: {
      type: Boolean,
      default: false
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<Partial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { emit }) {
    const { ui, attrs } = useUI('tabs', toRef(props, 'ui'), config, toRef(props, 'class'))

    const listRef = ref<HTMLElement>()
    const itemRefs = ref<HTMLElement[]>([])
    const markerRef = ref<HTMLElement>()

    const selectedIndex = ref<number | undefined>(props.modelValue || props.defaultIndex)

    // Methods

    function calcMarkerSize (index: number | undefined) {
      // @ts-ignore
      const tab = itemRefs.value[index]?.$el
      if (!tab) {
        return
      }

      if (!markerRef.value) {
        return
      }

      markerRef.value.style.top = `${tab.offsetTop}px`
      markerRef.value.style.left = `${tab.offsetLeft}px`
      markerRef.value.style.width = `${tab.offsetWidth}px`
      markerRef.value.style.height = `${tab.offsetHeight}px`
    }

    function onChange (index: number) {
      selectedIndex.value = index

      emit('change', index)

      if (props.modelValue !== undefined) {
        emit('update:modelValue', selectedIndex.value)
      }

      calcMarkerSize(selectedIndex.value)
    }

    useResizeObserver(listRef, () => {
      calcMarkerSize(selectedIndex.value)
    })

    watch(() => props.modelValue, (value) => {
      selectedIndex.value = value

      calcMarkerSize(selectedIndex.value)
    })

    onMounted(() => calcMarkerSize(selectedIndex.value))

    provideUseId(() => useId())

    return {
      _ui: ui,
      attrs,
      listRef,
      itemRefs,
      markerRef,
      selectedIndex,
      onChange
    }
  }
})
</script>
