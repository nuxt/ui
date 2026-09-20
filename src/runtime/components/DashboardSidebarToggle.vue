<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/dashboard-sidebar-toggle'
import type { ButtonProps } from './Button.vue'
import type { LinkPropsKeys } from './Link.vue'
import type { ComponentConfig } from '../types/tv'
import type { DashboardSidebarTarget } from '../utils/dashboard'

type DashboardSidebarToggle = ComponentConfig<typeof theme, AppConfig, 'dashboardSidebarToggle'>

export interface DashboardSidebarToggleProps extends Omit<ButtonProps, LinkPropsKeys | 'color' | 'variant'> {
  /**
   * @defaultValue 'neutral'
   */
  color?: ButtonProps['color']
  /**
   * @defaultValue 'ghost'
   */
  variant?: ButtonProps['variant']
  /**
   * The side of the sidebar to toggle.
   * @defaultValue 'left'
   */
  side?: 'left' | 'right'
  /**
   * The sidebar to toggle. Matches a `DashboardSidebar` `id` or `side`.
   * Omit to toggle every sidebar (backwards compatible).
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

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<DashboardSidebarToggleProps>(), {
  color: 'neutral',
  variant: 'ghost',
  side: 'left'
})

const props = useComponentProps('dashboardSidebarToggle', _props)

const buttonProps = useForwardProps(reactiveOmit(props, 'icon', 'side', 'target', 'class'))

const { t } = useLocale()
const appConfig = useAppConfig() as DashboardSidebarToggle['AppConfig']
const { sidebarOpen, openByTarget, toggleSidebar } = useDashboard({ sidebarOpen: ref(false), toggleSidebar: () => {} })
const parentTarget = useDashboardSidebarTarget()
const resolvedTarget = computed(() => props.target || parentTarget || undefined)
const isOpen = computed(() => {
  const key = resolvedTarget.value
  if (key && openByTarget && key in openByTarget) {
    return openByTarget[key]
  }
  return !!sidebarOpen?.value
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.dashboardSidebarToggle || {}) }))
</script>

<template>
  <UButton
    v-bind="{
      ...buttonProps,
      'icon': props.icon || (isOpen ? appConfig.ui.icons.close : appConfig.ui.icons.menu),
      'aria-label': isOpen ? t('dashboardSidebarToggle.close') : t('dashboardSidebarToggle.open'),
      ...$attrs
    }"
    :class="ui({ class: [props.ui?.base, props.class], side: props.side })"
    @click="toggleSidebar?.(resolvedTarget)"
  />
</template>
