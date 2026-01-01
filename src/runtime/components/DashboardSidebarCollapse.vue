<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/dashboard-sidebar-collapse'
import type { ButtonProps, LinkPropsKeys } from '../types'
import type { ComponentConfig } from '../types/tv'

type DashboardSidebarCollapse = ComponentConfig<typeof theme, AppConfig, 'dashboardSidebarCollapse'>

export interface DashboardSidebarCollapseProps extends Omit<ButtonProps, LinkPropsKeys | 'color' | 'variant'> {
  /**
   * @defaultValue 'neutral'
   */
  color?: ButtonProps['color']
  /**
   * @defaultValue 'ghost'
   */
  variant?: ButtonProps['variant']
  /**
   * The side of the sidebar to collapse.
   * @defaultValue 'left'
   */
  side?: 'left' | 'right'
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForwardProps } from 'reka-ui'
import { reactiveOmit } from '@vueuse/core'
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

const buttonProps = useForwardProps(reactiveOmit(props, 'icon', 'side', 'class'))

const { t } = useLocale()
const appConfig = useAppConfig() as DashboardSidebarCollapse['AppConfig']
const { sidebarCollapsed, collapseSidebar } = useDashboard({ sidebarCollapsed: ref(false), collapseSidebar: () => {} })

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.dashboardSidebarCollapse || {}) }))
</script>

<template>
  <UButton
    v-bind="{
      ...buttonProps,
      'icon': props.icon || (sidebarCollapsed ? appConfig.ui.icons.panelOpen : appConfig.ui.icons.panelClose),
      'aria-label': sidebarCollapsed ? t('dashboardSidebarCollapse.expand') : t('dashboardSidebarCollapse.collapse'),
      ...$attrs
    }"
    :class="ui({ class: props.class, side: props.side })"
    @click="collapseSidebar?.(!sidebarCollapsed)"
  />
</template>
