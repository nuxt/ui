<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/dashboard-panel'
import type { UseResizableProps } from '../composables/useResizable'
import type { ComponentConfig } from '../types/tv'

type DashboardPanel = ComponentConfig<typeof theme, AppConfig, 'dashboardPanel'>

export interface DashboardPanelProps extends Pick<UseResizableProps, 'id' | 'minSize' | 'maxSize' | 'defaultSize' | 'resizable'> {
  class?: any
  ui?: DashboardPanel['slots']
}

export interface DashboardPanelSlots {
  'default'(props?: {}): any
  'header'(props?: {}): any
  'body'(props?: {}): any
  'footer'(props?: {}): any
  'resize-handle'(props: { onMouseDown: (e: MouseEvent) => void, onTouchStart: (e: TouchEvent) => void, onDoubleClick: (e: MouseEvent) => void }): any
}
</script>

<script setup lang="ts">
import { computed, useId, toRef } from 'vue'
import { useAppConfig } from '#imports'
import { useResizable } from '../composables/useResizable'
import { useDashboard } from '../utils/dashboard'
import { tv } from '../utils/tv'
import UDashboardResizeHandle from './DashboardResizeHandle.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DashboardPanelProps>(), {
  minSize: 15,
  resizable: false
})
defineSlots<DashboardPanelSlots>()

const appConfig = useAppConfig() as DashboardPanel['AppConfig']
const dashboardContext = useDashboard({ storageKey: 'dashboard', unit: '%' })

const id = `${dashboardContext.storageKey}-panel-${props.id || useId()}`

const { el, size, isDragging, onMouseDown, onTouchStart, onDoubleClick } = useResizable(id, toRef(() => ({ ...dashboardContext, ...props })))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.dashboardPanel || {}) })({
  size: !!size.value
}))
</script>

<template>
  <div
    :id="id"
    ref="el"
    v-bind="$attrs"
    :data-dragging="isDragging"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :style="[size ? { '--width': `${size}${dashboardContext.unit}` } : undefined]"
  >
    <slot>
      <slot name="header" />

      <div data-slot="body" :class="ui.body({ class: props.ui?.body })">
        <slot name="body" />
      </div>

      <slot name="footer" />
    </slot>
  </div>

  <slot name="resize-handle" :on-mouse-down="onMouseDown" :on-touch-start="onTouchStart" :on-double-click="onDoubleClick">
    <UDashboardResizeHandle
      v-if="resizable"
      :aria-controls="id"
      data-slot="handle"
      :class="ui.handle({ class: props.ui?.handle })"
      @mousedown="onMouseDown"
      @touchstart="onTouchStart"
      @dblclick="onDoubleClick"
    />
  </slot>
</template>
