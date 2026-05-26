<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/dashboard-search-button'
import type { ButtonProps, ButtonSlots, IconProps, KbdProps, TooltipProps, LinkPropsKeys } from '../types'
import type { ComponentConfig } from '../types/tv'

type DashboardSearchButton = ComponentConfig<typeof theme, AppConfig, 'dashboardSearchButton'>

export interface DashboardSearchButtonProps extends Omit<ButtonProps, LinkPropsKeys | 'icon' | 'label' | 'color' | 'variant'> {
  /**
   * The icon displayed in the button.
   * @defaultValue appConfig.ui.icons.search
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * The label displayed in the button.
   * @defaultValue t('dashboardSearchButton.label')
   */
  label?: string
  /**
   * The color of the button.
   * @defaultValue 'neutral'
   */
  color?: ButtonProps['color']
  /**
   * The variant of the button.
   * Defaults to 'outline' when not collapsed, 'ghost' when collapsed.
   */
  variant?: ButtonProps['variant']
  /**
   * Whether the button is collapsed.
   * @defaultValue false
   */
  collapsed?: boolean
  /**
   * Display a tooltip on the button when is collapsed with the button label.
   * This has priority over the global `tooltip` prop.
   */
  tooltip?: boolean | TooltipProps
  /**
   * The keyboard keys to display in the button.
   * `{ variant: 'subtle' }`{lang="ts-type"}
   * @defaultValue ['meta', 'k']
   */
  kbds?: KbdProps['value'][] | KbdProps[]
  ui?: DashboardSearchButton['slots'] & ButtonProps['ui']
  class?: any
}
</script>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { defu } from 'defu'
import { reactiveOmit, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { useLocale } from '../composables/useLocale'
import { useDashboard } from '../utils/dashboard'
import { omit, transformUI } from '../utils'
import { tv } from '../utils/tv'
import UButton from './Button.vue'
import UKbd from './Kbd.vue'
import UTooltip from './Tooltip.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<DashboardSearchButtonProps>(), {
  color: 'neutral',
  collapsed: false,
  tooltip: false,
  kbds: () => ['meta', 'k']
})
const slots = defineSlots<ButtonSlots>()

const props = useComponentProps('dashboardSearchButton', _props)

const [DefineButtonTemplate, ReuseButtonTemplate] = createReusableTemplate()

const getProxySlots = () => omit(slots, ['trailing'])

const buttonProps = useForwardProps(reactiveOmit(props, 'icon', 'label', 'variant', 'collapsed', 'tooltip', 'kbds', 'class', 'ui'))
const tooltipProps = toRef(() => defu(typeof props.tooltip === 'boolean' ? {} : props.tooltip, { delayDuration: 0, content: { side: 'right' } }) as TooltipProps)

const { t } = useLocale()
const appConfig = useAppConfig() as DashboardSearchButton['AppConfig']
const { toggleSearch } = useDashboard({ toggleSearch: () => {} })

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.dashboardSearchButton || {}) })({
  collapsed: props.collapsed
}))
</script>

<template>
  <DefineButtonTemplate>
    <UButton
      :icon="props.icon || appConfig.ui.icons.search"
      :label="props.label || t('dashboardSearchButton.label')"
      :variant="props.variant || (props.collapsed ? 'ghost' : 'outline')"
      v-bind="{
        ...buttonProps,
        ...(props.collapsed ? {
          'square': true,
          'aria-label': props.label || t('dashboardSearchButton.label')
        } : {}),
        ...$attrs
      }"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
      :ui="transformUI(ui, props.ui)"
      @click="toggleSearch"
    >
      <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>

      <template #trailing="{ ui: uiProxy }">
        <span data-slot="trailing" :class="ui.trailing({ class: props.ui?.trailing })">
          <slot name="trailing" :ui="uiProxy">
            <template v-if="props.kbds?.length">
              <UKbd v-for="(kbd, index) in props.kbds" :key="index" variant="subtle" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
            </template>
          </slot>
        </span>
      </template>
    </UButton>
  </DefineButtonTemplate>

  <UTooltip v-if="props.collapsed && props.tooltip" :text="props.label || t('dashboardSearchButton.label')" v-bind="tooltipProps">
    <ReuseButtonTemplate />
  </UTooltip>
  <ReuseButtonTemplate v-else />
</template>
