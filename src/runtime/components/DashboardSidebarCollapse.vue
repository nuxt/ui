<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/dashboard-sidebar-collapse'
import type { ButtonProps } from './Button.vue'
import type { LinkPropsKeys } from './Link.vue'
import type { ComponentConfig } from '../types/tv'
import type { DashboardSidebarTarget } from '../utils/dashboard'

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
  /**
   * The sidebar to collapse. Matches a `DashboardSidebar` `id` or `side`.
   * Omit to collapse every sidebar (backwards compatible). Nested in a sidebar, it inherits that sidebar.
   */
  target?: DashboardSidebarTarget
  ui?: { base?: any }
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { useComponentProps } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { useDashboard, useDashboardSidebarTarget } from '../utils/dashboard'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const _props = withDefaults(defineProps<DashboardSidebarCollapseProps>(), {
  color: 'neutral',
  variant: 'ghost',
  side: 'left'
})

const props = useComponentProps('dashboardSidebarCollapse', _props)

const buttonProps = useForwardProps(reactiveOmit(props, 'icon', 'side', 'target', 'class'))

const { t } = useLocale()
const appConfig = useAppConfig() as DashboardSidebarCollapse['AppConfig']
const { sidebarCollapsed, collapsedByTarget, collapseSidebar } = useDashboard({ sidebarCollapsed: ref(false), collapseSidebar: () => {} })
const parentTarget = useDashboardSidebarTarget()
const resolvedTarget = computed(() => props.target || parentTarget || undefined)
const isCollapsed = computed(() => {
  const key = resolvedTarget.value
  if (key && collapsedByTarget && key in collapsedByTarget) {
    return collapsedByTarget[key]
  }
  return !!sidebarCollapsed?.value
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.dashboardSidebarCollapse || {}) }))
</script>

<template>
  <UButton
    v-bind="{
      ...buttonProps,
      'icon': props.icon || (isCollapsed ? appConfig.ui.icons.panelOpen : appConfig.ui.icons.panelClose),
      'aria-label': isCollapsed ? t('dashboardSidebarCollapse.expand') : t('dashboardSidebarCollapse.collapse'),
      ...$attrs
    }"
    :class="ui({ class: [props.ui?.base, props.class], side: props.side })"
    @click="collapseSidebar?.(!isCollapsed, resolvedTarget)"
  />
</template>
