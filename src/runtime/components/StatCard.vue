<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/stat-card'
import type { IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type StatCard = ComponentConfig<typeof theme, AppConfig, 'statCard'>

export interface StatCardProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The icon to display.
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * The title/label of the stat.
   */
  title?: string
  /**
   * The main value to display.
   */
  value?: string | number
  /**
   * The trend percentage value (e.g., 12.5 for +12.5%).
   */
  trend?: number
  /**
   * The direction of the trend.
   * @defaultValue 'up'
   */
  trendDirection?: 'up' | 'down'
  /**
   * @defaultValue 'primary'
   */
  color?: StatCard['variants']['color']
  /**
   * @defaultValue 'md'
   */
  size?: StatCard['variants']['size']
  /**
   * @defaultValue 'outline'
   */
  variant?: StatCard['variants']['variant']
  class?: any
  ui?: StatCard['slots']
}

export interface StatCardSlots {
  icon(props: { ui: StatCard['ui'] }): any
  title(props: { title?: string, ui: StatCard['ui'] }): any
  value(props: { value?: string | number, ui: StatCard['ui'] }): any
  trend(props: { trend?: number, trendDirection?: 'up' | 'down', ui: StatCard['ui'] }): any
  default(props: { ui: StatCard['ui'] }): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<StatCardProps>(), {
  trendDirection: 'up',
  size: 'md',
  color: 'primary',
  variant: 'outline'
})

const slots = defineSlots<StatCardSlots>()

const appConfig = useAppConfig() as StatCard['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.statCard || {}) })({
  size: props.size,
  color: props.color,
  variant: props.variant
}))

const trendColor = computed(() => {
  if (props.trend === undefined || props.trend === null) return ''
  return props.trendDirection === 'up' ? 'text-success-500 dark:text-success-400' : 'text-error-500 dark:text-error-400'
})

const trendIcon = computed(() => {
  return props.trendDirection === 'up' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'
})

const formattedTrend = computed(() => {
  if (props.trend === undefined || props.trend === null) return ''
  const sign = props.trend >= 0 ? '+' : ''
  return `${sign}${props.trend}%`
})
</script>

<template>
  <Primitive
    :as="as"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    v-bind="$attrs"
  >
    <div v-if="icon || !!slots.icon || title || !!slots.title || (value !== undefined && value !== null) || !!slots.value || (trend !== undefined && trend !== null) || !!slots.trend" data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <div v-if="icon || !!slots.icon" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })">
        <slot name="icon" :ui="ui">
          <UIcon v-if="icon" :name="icon" data-slot="iconIcon" :class="(ui as any).iconIcon({ class: (props.ui as any)?.iconIcon })" />
        </slot>
      </div>

      <div data-slot="content" :class="ui.content({ class: props.ui?.content })">
        <div v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title" :title="title" :ui="ui">
            {{ title }}
          </slot>
        </div>

        <div v-if="(value !== undefined && value !== null) || !!slots.value" data-slot="value" :class="ui.value({ class: props.ui?.value })">
          <slot name="value" :value="value" :ui="ui">
            {{ value }}
          </slot>
        </div>

        <div v-if="(trend !== undefined && trend !== null) || !!slots.trend" data-slot="trend" :class="[ui.trend({ class: props.ui?.trend }), trendColor]">
          <slot name="trend" :trend="trend" :trend-direction="trendDirection" :ui="ui">
            <UIcon :name="trendIcon" data-slot="trendIcon" :class="[ui.trendIcon({ class: props.ui?.trendIcon }), trendColor]" />
            <span data-slot="trendValue" :class="ui.trendValue({ class: props.ui?.trendValue })">
              {{ formattedTrend }}
            </span>
          </slot>
        </div>
      </div>
    </div>

    <slot :ui="ui" />
  </Primitive>
</template>
