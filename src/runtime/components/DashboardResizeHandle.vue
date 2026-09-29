<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/dashboard-resize-handle'
import type { ComponentConfig } from '../types/tv'

type DashboardResizeHandle = ComponentConfig<typeof theme, AppConfig, 'dashboardResizeHandle'>

export interface DashboardResizeHandleProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: DashboardResizeHandle['slots']
}

export interface DashboardResizeHandleSlots {
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { tv } from '../utils/tv'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../composables/useComponentProps'

const _props = defineProps<DashboardResizeHandleProps>()

defineSlots<DashboardResizeHandleSlots>()

const props = useComponentProps('dashboardResizeHandle', _props, theme)

const appConfig = useThemeConfig() as DashboardResizeHandle['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.dashboardResizeHandle)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <Primitive
    :as="props.as"
    role="separator"
    data-slot="dashboard-resize-handle"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <slot />
  </Primitive>
</template>
