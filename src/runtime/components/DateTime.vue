<script lang="ts">
import type { AgoProps } from './Ago.vue'

// Common option values
const l = 'long' as const
const s = 'short' as const
const n = 'numeric' as const
const td = '2-digit' as const

/** 6:34 PM */
export const time_sm: Intl.DateTimeFormatOptions = {
  hour: n,
  minute: n
} as const

/** 6:34:00 PM */
export const time_md: Intl.DateTimeFormatOptions = {
  hour: n,
  minute: n,
  second: n
} as const

/** 6:34:00 PM GMT -4 */
export const time_lg: Intl.DateTimeFormatOptions = {
  hour: n,
  minute: n,
  second: n,
  timeZoneName: s
} as const

/** 9/8/25 */
export const date_sm: Intl.DateTimeFormatOptions = {
  year: td,
  month: n,
  day: n
} as const

/** Sep 8, 2025 */
export const date_md: Intl.DateTimeFormatOptions = {
  year: n,
  month: s,
  day: n
} as const

/** Monday, Sep 8, 2025 */
export const date_lg: Intl.DateTimeFormatOptions = {
  weekday: l,
  year: n,
  month: s,
  day: n
} as const

/** Monday, September 8, 2025 */
export const date_xl: Intl.DateTimeFormatOptions = {
  weekday: l,
  year: n,
  month: l,
  day: n
} as const

/** 9/8/25 6:34 PM */
export const xs: Intl.DateTimeFormatOptions = {
  ...date_sm,
  ...time_sm
} as const

/** Sep 8, 2025, 6:34 PM */
export const sm: Intl.DateTimeFormatOptions = {
  ...date_md,
  ...time_sm
} as const

/** Monday, Sep 8, 2025, 6:34 PM */
export const md: Intl.DateTimeFormatOptions = {
  ...date_lg,
  ...time_sm
} as const

/** Monday, September 8, 2025, 6:34:00 PM */
export const lg: Intl.DateTimeFormatOptions = {
  ...date_xl,
  ...time_md
} as const

/** Monday, September 8, 2025, 6:34:00 PM GMT -4 */
export const xl: Intl.DateTimeFormatOptions = {
  ...date_xl,
  ...time_lg
} as const

export const FormatStringMap = {
  'date:sm': date_sm,
  'date:md': date_md,
  'date:lg': date_lg,
  'date:xl': date_xl,
  'time:sm': time_sm,
  'time:md': time_md,
  'time:lg': time_lg,
  'xs': xs,
  'sm': sm,
  'md': md,
  'lg': lg,
  'xl': xl
}

export type FormatString = keyof (typeof FormatStringMap)

export interface DateTimeProps extends AgoProps {
  /**
   * Intl.DateTimeFormat options object to customize the time format, or a shorthand string.
   * @defaultValue { Formats.md }
   */
  format?: FormatString | Intl.DateTimeFormatOptions
  /**
   * When true, it will show a tooltip with a relative "time ago" using the Ago component.
   * @defaultValue false
   */
  ago?: boolean
  /**
   * When `ago` is `true`, these props will be passed to the underlying Tooltip component.
   */
  tooltip?: Record<string, unknown>
}

export interface DateTimeSlots {
  /**
   * Slot to customize the displayed text.
   */
  default(props: { text: string, date: Date }): any
}

export interface DateTimeSlots {
  default(props?: {}): any
}

export default {
  name: 'DateTime'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import UTooltip from './Tooltip.vue'
import UAgo from './Ago.vue'
import { normalizeDate } from '@vueuse/shared'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DateTimeProps>(), {
  ago: false,
  tooltip: () => ({}),
  refresh: true,
  format: () => md
})

const slots = defineSlots<DateTimeSlots>()

function toFormat(value: Intl.DateTimeFormatOptions | FormatString): Intl.DateTimeFormatOptions {
  if (typeof value === 'string') return FormatStringMap[value]

  return value
}

const date = computed(() => normalizeDate(props.datetime))
const size = computed(() => toFormat(props.format))
const iso = computed(() => date.value.toISOString())

const text = computed(() => new Intl.DateTimeFormat(props.locale, size.value).format(date.value))
</script>

<template>
  <UTooltip v-if="ago" v-bind="props.tooltip">
    <template #default>
      <time :datetime="iso" :class="props.class" v-bind="$attrs">
        <slot v-if="!!slots.default" :text="text" :date="date">
          {{ text }}
        </slot>
        <template v-else>
          {{ text }}
        </template>
      </time>
    </template>

    <template #content>
      <UAgo :datetime="date" :locale="props.locale" :refresh="props.refresh" />
    </template>
  </UTooltip>

  <time v-else :datetime="iso" :class="props.class" v-bind="$attrs">
    <slot v-if="!!slots.default" :text="text" :date="date">
      {{ text }}
    </slot>
    <template v-else>
      {{ text }}
    </template>
  </time>
</template>
