<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/dashboard-sidebar-collapse'
import type { ButtonProps } from './Button.vue'
import type { LinkPropsKeys } from './Link.vue'
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
  ui?: DashboardSidebarCollapse['slots']
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { useLocale } from '../composables/useLocale'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { useDashboard } from '../utils/dashboard'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const _props = withDefaults(defineProps<DashboardSidebarCollapseProps>(), {
  color: 'neutral',
  variant: 'ghost',
  side: 'left'
})

const props = useComponentProps('dashboardSidebarCollapse', _props, theme)

const buttonProps = useForwardProps(reactiveOmit(props, 'icon', 'side', 'class'))

const { t } = useLocale()
const appConfig = useThemeConfig() as DashboardSidebarCollapse['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.dashboardSidebarCollapse)
const { sidebarCollapsed, collapseSidebar } = useDashboard({ sidebarCollapsed: ref(false), collapseSidebar: () => {} })

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({ side: props.side }))
</script>

<template>
  <UButton
    data-slot="dashboard-sidebar-collapse"
    v-bind="{
      ...buttonProps,
      'icon': props.icon || (sidebarCollapsed ? appConfig.ui.icons.panelOpen : appConfig.ui.icons.panelClose),
      'aria-label': sidebarCollapsed ? t('dashboardSidebarCollapse.expand') : t('dashboardSidebarCollapse.collapse'),
      ...$attrs
    }"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @click="collapseSidebar?.(!sidebarCollapsed)"
  />
</template>
