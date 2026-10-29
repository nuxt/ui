<script lang="ts">
import type { ComponentThemeConfig } from '@nuxt/ui'
import { extendTheme } from '@nuxt/ui/utils/theme'
import card from '#build/ui/card'

const theme = extendTheme(card, {
  slots: {
    body: 'flex flex-col gap-1',
    label: 'flex items-center gap-1.5 text-sm text-muted',
    icon: 'size-4 shrink-0',
    value: 'text-2xl font-semibold text-strong tabular-nums',
    delta: 'inline-flex items-center gap-0.5 text-xs font-medium'
  },
  variants: {
    trend: {
      up: { delta: 'text-success' },
      down: { delta: 'text-error' },
      flat: { delta: 'text-muted' }
    },
    size: {
      sm: { body: 'p-3', value: 'text-lg' },
      md: {},
      lg: { value: 'text-4xl' }
    }
  },
  defaultVariants: {
    trend: 'flat',
    size: 'md'
  }
})

type AcmeStat = ComponentThemeConfig<typeof theme, 'acmeStat'>

export interface AcmeStatProps {
  label: string
  value: string | number
  /** The change since the previous period, in percent. */
  delta?: number
  icon?: string
  /** Read from the sign of `delta` when not set. */
  trend?: AcmeStat['variants']['trend']
  /**
   * @defaultValue 'outline'
   */
  variant?: AcmeStat['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: AcmeStat['variants']['size']
  class?: any
  ui?: AcmeStat['slots']
}

declare module '@nuxt/ui' {
  interface CustomThemes {
    acmeStat: typeof theme
  }
  interface ThemeDefaults {
    acmeStat?: Partial<AcmeStatProps>
  }
}
</script>

<script setup lang="ts">
const _props = defineProps<AcmeStatProps>()

const { props, ui } = useComponentTheme('acmeStat', _props, theme, props => ({
  trend: props.trend ?? (!props.delta ? 'flat' : props.delta > 0 ? 'up' : 'down')
}))
</script>

<template>
  <div :class="ui.root()">
    <div :class="ui.body()">
      <div :class="ui.label()">
        <UIcon v-if="props.icon" :name="props.icon" :class="ui.icon()" />
        {{ props.label }}
      </div>

      <div :class="ui.value()">
        {{ props.value }}
      </div>

      <div v-if="props.delta !== undefined" :class="ui.delta()">
        {{ props.delta > 0 ? '+' : '' }}{{ props.delta }}%
      </div>
    </div>
  </div>
</template>
