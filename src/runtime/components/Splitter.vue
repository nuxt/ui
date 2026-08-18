<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { SplitterGroupProps, SplitterGroupEmits, SplitterPanelProps, SplitterResizeHandleProps } from 'reka-ui'
import type { VNode, ComponentPublicInstance } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/splitter'
import type { DynamicSlots } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Splitter = ComponentConfig<typeof theme, AppConfig, 'splitter'>

export interface SplitterItem extends Omit<SplitterPanelProps, 'as' | 'asChild'> {
  /**
   * A unique id for the panel. Also used as the Vue `key`. Defaults to an auto-generated id.
   */
  id?: string
  slot?: string
  class?: any
  ui?: Pick<Splitter['slots'], 'panel'>
  [key: string]: any
}

export interface SplitterProps<T extends SplitterItem = SplitterItem> extends Pick<SplitterGroupProps, 'autoSaveId' | 'keyboardResizeBy' | 'storage'>, Pick<SplitterResizeHandleProps, 'hitAreaMargins'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * A unique id for the group, used internally to match panels and handles. It is not rendered as an `id` attribute.
   * Set it when rendering on the server, an auto-generated id can differ between the server and the client and break the layout on hydration.
   */
  id?: string
  /**
   * The orientation of the splitter.
   * @defaultValue 'horizontal'
   */
  orientation?: Splitter['variants']['orientation']
  items?: T[]
  /**
   * Whether the resize handles are disabled, locking the current layout.
   * @defaultValue false
   */
  disabled?: boolean
  class?: any
  ui?: Splitter['slots']
}

export interface SplitterEmits {
  layout: SplitterGroupEmits['layout']
  collapse: [index: number]
  expand: [index: number]
  resize: [index: number, size: number, prevSize?: number]
  dragging: [index: number, dragging: boolean]
}

type PanelSlotProps = {
  index: number
  collapsed: boolean
  collapse: () => void
  expand: () => void
  resize: (size: number) => void
  ui: Splitter['ui']
}
type SlotProps<T extends SplitterItem> = (props: { item: T } & PanelSlotProps) => VNode[]

export type SplitterSlots<T extends SplitterItem = SplitterItem> = {
  'resize-handle'?: (props: { index: number, ui: Splitter['ui'] }) => VNode[]
} & DynamicSlots<T, undefined, PanelSlotProps> & {
  [key: `panel-${number}`]: SlotProps<T> | undefined
}

</script>

<script setup lang="ts" generic="T extends SplitterItem">
import { ref, computed, onBeforeUpdate } from 'vue'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { tv } from '../utils/tv'

const _props = withDefaults(defineProps<SplitterProps<T>>(), {
  orientation: 'horizontal'
})
const emits = defineEmits<SplitterEmits>()
defineSlots<SplitterSlots<T>>()

const props = useComponentProps<SplitterProps<T>>('splitter', _props)

const appConfig = useAppConfig() as Splitter['AppConfig']

const rootProps = useForwardProps(reactivePick(props, 'as', 'id', 'autoSaveId', 'keyboardResizeBy', 'storage'))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.splitter || {}) })({
  orientation: props.orientation
}))

const panelsRef = ref<InstanceType<typeof SplitterPanel>[]>([])

// Refs are rebuilt on every render, otherwise removing an item would leave the panel
// that took its index behind as `null` since the unmounted panel resets it afterwards.
onBeforeUpdate(() => {
  panelsRef.value.length = 0
})

function setPanelRef(index: number, el: Element | ComponentPublicInstance | null) {
  if (el) {
    // @ts-expect-error - ComponentPublicInstance type mismatch in Nuxt module augmentation
    panelsRef.value[index] = el
  }
}

defineExpose({
  panelsRef
})
</script>

<template>
  <SplitterGroup v-bind="rootProps" :direction="props.orientation!" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })" @layout="emits('layout', $event)">
    <template v-for="(item, index) in props.items" :key="item.id ?? index">
      <SplitterPanel
        :id="item.id"
        :ref="(el) => setPanelRef(index, el)"
        v-slot="{ isCollapsed, collapse, expand, resize }"
        :default-size="item.defaultSize"
        :min-size="item.minSize"
        :max-size="item.maxSize"
        :collapsible="item.collapsible"
        :collapsed-size="item.collapsedSize"
        :size-unit="item.sizeUnit"
        :order="item.order"
        data-slot="panel"
        :class="ui.panel({ class: [props.ui?.panel, item.ui?.panel, item.class] })"
        @collapse="emits('collapse', index)"
        @expand="emits('expand', index)"
        @resize="(size, prevSize) => emits('resize', index, size, prevSize)"
      >
        <slot
          :name="((item.slot || `panel-${index}`) as keyof SplitterSlots<T>)"
          :item="(item as Extract<T, { slot: string }>)"
          :index="index"
          :collapsed="isCollapsed"
          :collapse="collapse"
          :expand="expand"
          :resize="resize"
          :ui="ui"
        />
      </SplitterPanel>

      <SplitterResizeHandle
        v-if="index < props.items!.length - 1"
        :disabled="props.disabled"
        :hit-area-margins="props.hitAreaMargins"
        data-slot="handle"
        :class="ui.handle({ class: props.ui?.handle })"
        @dragging="(dragging) => emits('dragging', index, dragging)"
      >
        <slot name="resize-handle" :index="index" :ui="ui" />
      </SplitterResizeHandle>
    </template>
  </SplitterGroup>
</template>
