<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/dashboard-sidebar-toggle'
import type { ButtonProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type DashboardSidebarToggle = ComponentConfig<typeof theme, AppConfig, 'dashboardSidebarToggle'>

export interface DashboardSidebarToggleProps extends /** @vue-ignore */ Pick<ButtonProps, 'as' | 'size' | 'disabled' | 'ui'> {
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

const props = withDefaults(defineProps<DashboardSidebarToggleProps>(), {
  color: 'neutral',
  variant: 'ghost',
  side: 'left'
})

const rootProps = useForwardProps(reactivePick(props, 'color', 'variant', 'size'))

const { t } = useLocale()
const appConfig = useAppConfig() as DashboardSidebarToggle['AppConfig']
const { sidebarOpen, toggleSidebar } = useDashboard({ sidebarOpen: ref(false), toggleSidebar: () => {} })

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.dashboardSidebarToggle || {}) }))
</script>

<template>
  <UButton
    v-bind="rootProps"
    :aria-label="sidebarOpen ? t('dashboardSidebarToggle.close') : t('dashboardSidebarToggle.open')"
    :icon="sidebarOpen ? appConfig.ui.icons.close : appConfig.ui.icons.menu"
    :class="ui({ class: props.class, side: props.side })"
    @click="toggleSidebar"
  />
</template>
