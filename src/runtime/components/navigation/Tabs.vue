<template>
  <HTabGroup
    :vertical="orientation === 'vertical'"
    :selected-index="selectedIndex"
    as="div"
    :class="ui.wrapper"
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
        <button :aria-label="item.ariaLabel" :class="[ui.list.tab.base, ui.list.tab.background, ui.list.tab.height, ui.list.tab.padding, ui.list.tab.size, ui.list.tab.font, ui.list.tab.rounded, ui.list.tab.shadow, selected ? ui.list.tab.active : ui.list.tab.inactive]">
          <slot
            name="icon"
            :item="item"
            :index="index"
            :selected="selected"
            :disabled="disabled"
          >
            <UIcon v-if="item.icon" :name="item.icon" :class="ui.list.tab.icon" />
          </slot>

          <slot :item="item" :index="index" :selected="selected" :disabled="disabled">
            <span class="truncate">{{ item.label }}</span>
          </slot>
        </button>
      </HTab>
    </HTabList>

    <HTabPanels v-if="content" :class="ui.container">
      <HTabPanel v-for="(item, index) of items" :key="index" v-slot="{ selected }" :class="ui.base" :unmount="unmount">
        <slot :name="item.slot || 'item'" :item="item" :index="index" :selected="selected">
          {{ item.content }}
        </slot>
      </HTabPanel>
    </HTabPanels>
  </HTabGroup>
</template>

<script lang="ts">
import { toRef, ref, watch, onMounted, defineComponent, nextTick } from 'vue'
import type { PropType } from 'vue'
import { TabGroup as HTabGroup, TabList as HTabList, Tab as HTab, TabPanels as HTabPanels, TabPanel as HTabPanel, provideUseId } from '@headlessui/vue'
import { useResizeObserver } from '@vueuse/core'
import UIcon from '../elements/Icon.vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { TabItem, Strategy, DeepPartial } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { tabs } from '#ui/ui.config'
import { useId } from '#imports'

const config = mergeConfig<typeof tabs>(appConfig.ui.strategy, appConfig.ui.tabs, tabs)

export default defineComponent({
  components: {
    UIcon,
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
    content: {
      type: Boolean,
      default: true
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const { ui, attrs } = useUI('tabs', toRef(props, 'ui'), config, toRef(props, 'class'))

    const listRef = ref<HTMLElement>()
    const itemRefs = ref<HTMLElement[]>([])
    const markerRef = ref<HTMLElement>()

    const selectedIndex = ref<number | undefined>(props.modelValue || props.defaultIndex)

    // Methods

    function calcMarkerSize(index: number | undefined) {
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

    function onChange(index: number) {
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

    watch(() => props.items, async () => {
      await nextTick()
      calcMarkerSize(selectedIndex.value)
    }, { deep: true })

    onMounted(async () => {
      await nextTick()
      calcMarkerSize(selectedIndex.value)
    })

    provideUseId(() => useId())

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
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
