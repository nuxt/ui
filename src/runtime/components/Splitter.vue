<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { SplitterGroupProps, SplitterGroupEmits } from 'reka-ui'
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/splitter'
import type { DynamicSlots } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Splitter = ComponentConfig<typeof theme, AppConfig, 'splitter'>

export interface SplitterItem {
  /**
   * The initial size of the panel, interpreted using `unit`.
   */
  default?: number
  /**
   * The minimum allowable size of the panel, interpreted using `unit`.
   */
  min?: number
  /**
   * The maximum allowable size of the panel, interpreted using `unit`.
   */
  max?: number
  /**
   * Whether the panel can collapse when resized beyond its `min`.
   */
  collapsible?: boolean
  /**
   * The size of the panel when it is collapsed, interpreted using `unit`.
   */
  collapsedSize?: number
  /**
   * The unit used for sizing values.
   * @defaultValue '%'
   */
  unit?: '%' | 'px'
  /**
   * The order of the panel within the group, required for groups with conditionally rendered panels.
   */
  order?: number
  /**
   * A unique id for the panel. Also used as the Vue `key`. Defaults to the index.
   */
  id?: string
  slot?: string
  class?: any
  ui?: Pick<Splitter['slots'], 'panel'>
}

export interface SplitterProps<T extends SplitterItem = SplitterItem> extends Pick<SplitterGroupProps, 'as' | 'autoSaveId' | 'keyboardResizeBy' | 'storage'> {
  /**
   * The orientation of the splitter.
   * @defaultValue 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  items?: T[]
  class?: any
  ui?: Splitter['slots']
}

export interface SplitterEmits extends SplitterGroupEmits {}

type SlotProps<T extends SplitterItem> = (props: {
  item: T
  index: number
  collapsed: boolean
  expanded: boolean
  collapse: () => void
  expand: () => void
  resize: (size: number) => void
  ui: Splitter['ui']
}) => VNode[]

export type SplitterSlots<T extends SplitterItem = SplitterItem> = {
  'resize-handle'?: (props: { index: number, ui: Splitter['ui'] }) => VNode[]
} & DynamicSlots<T, undefined, {
  index: number
  collapsed: boolean
  expanded: boolean
  collapse: () => void
  expand: () => void
  resize: (size: number) => void
  ui: Splitter['ui']
}> & {
  [key: string]: SlotProps<T>
}

</script>

<script setup lang="ts" generic="T extends SplitterItem">
import { computed } from 'vue'
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

const rootProps = useForwardProps(reactivePick(props, 'as', 'autoSaveId', 'keyboardResizeBy', 'storage'), emits)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.splitter || {}) })())
</script>

<template>
  <SplitterGroup v-bind="rootProps" :direction="props.orientation || 'horizontal'" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <template v-for="(item, index) in props.items" :key="item.id ?? index">
      <SplitterPanel
        :id="item.id"
        v-slot="{ isCollapsed, isExpanded, collapse, expand, resize }"
        :default-size="item.default"
        :min-size="item.min"
        :max-size="item.max"
        :collapsible="item.collapsible"
        :collapsed-size="item.collapsedSize"
        :size-unit="item.unit"
        :order="item.order"
        data-slot="panel"
        :class="ui.panel({ class: [props.ui?.panel, item.ui?.panel, item.class] })"
      >
        <slot
          :name="((item.slot || `panel-${index}`) as keyof SplitterSlots<T>)"
          :item="(item as Extract<T, { slot: string }>)"
          :index="index"
          :collapsed="isCollapsed"
          :expanded="isExpanded"
          :collapse="collapse"
          :expand="expand"
          :resize="resize"
          :ui="ui"
        />
      </SplitterPanel>

      <SplitterResizeHandle
        v-if="index < (props.items?.length ?? 0) - 1"
        data-slot="handle"
        :class="ui.handle({ class: props.ui?.handle })"
      >
        <slot name="resize-handle" :index="index" :ui="ui" />
      </SplitterResizeHandle>
    </template>
  </SplitterGroup>
</template>
