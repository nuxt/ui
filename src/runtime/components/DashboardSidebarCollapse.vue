<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/dashboard-sidebar-collapse'
import type { ButtonProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type DashboardSidebarCollapse = ComponentConfig<typeof theme, AppConfig, 'dashboardSidebarCollapse'>

export interface DashboardSidebarCollapseProps extends /** @vue-ignore */ Pick<ButtonProps, 'as' | 'size' | 'disabled' | 'ui'> {
  side?: 'left' | 'right'
  /**
   * @defaultValue 'neutral'
   */
  color?: ButtonProps['color']
  /**
   * @defaultValue 'ghost'
   */
  variant?: ButtonProps['variant']
  class?: any
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForwardProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { useDashboard } from '../utils/dashboard'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const props = withDefaults(defineProps<DashboardSidebarCollapseProps>(), {
  color: 'neutral',
  variant: 'ghost',
  side: 'left'
})

const rootProps = useForwardProps(reactivePick(props, 'color', 'variant', 'size'))

const { t } = useLocale()
const appConfig = useAppConfig() as DashboardSidebarCollapse['AppConfig']
const { sidebarCollapsed, collapseSidebar } = useDashboard({ sidebarCollapsed: ref(false), collapseSidebar: () => {} })

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.dashboardSidebarCollapse || {}) }))
</script>

<template>
  <UButton
    v-bind="rootProps"
    :aria-label="sidebarCollapsed ? t('dashboardSidebarCollapse.expand') : t('dashboardSidebarCollapse.collapse')"
    :icon="sidebarCollapsed ? appConfig.ui.icons.panelOpen : appConfig.ui.icons.panelClose"
    :class="ui({ class: props.class, side: props.side })"
    @click="collapseSidebar?.(!sidebarCollapsed)"
  />
</template>
