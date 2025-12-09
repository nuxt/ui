<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/dashboard-toolbar'
import type { ComponentConfig } from '../types/tv'

type DashboardToolbar = ComponentConfig<typeof theme, AppConfig, 'dashboardToolbar'>

export interface DashboardToolbarProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: DashboardToolbar['slots']
}

export interface DashboardToolbarSlots {
  default(props?: {}): any
  left(props?: {}): any
  right(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = defineProps<DashboardToolbarProps>()
defineSlots<DashboardToolbarSlots>()

const appConfig = useAppConfig() as DashboardToolbar['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.dashboardToolbar || {}) })())
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot>
      <div data-slot="left" :class="ui.left({ class: [props.ui?.left] })">
        <slot name="left" />
      </div>

      <div data-slot="right" :class="ui.right({ class: [props.ui?.right] })">
        <slot name="right" />
      </div>
    </slot>
  </Primitive>
</template>
