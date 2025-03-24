<script lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { CalendarRootProps, CalendarRootEmits, RangeCalendarRootProps, RangeCalendarRootEmits, DateRange, CalendarCellTriggerProps } from 'reka-ui'
import type { DateValue } from '@internationalized/date'
import type { AppConfig } from '@nuxt/schema'
import type { ButtonProps } from '../types'
import _appConfig from '#build/app.config'
import theme from '#build/ui/calendar'
import { tv } from '../utils/tv'
import type { PartialString } from '../types/utils'

const appConfigCalendar = _appConfig as AppConfig & { ui: { calendar: Partial<typeof theme> } }

const calendar = tv({ extend: tv(theme), ...(appConfigCalendar.ui?.calendar || {}) })

type CalendarVariants = VariantProps<typeof calendar>

type CalendarDefaultValue<R extends boolean = false, M extends boolean = false> = R extends true
  ? DateRange
  : M extends true
    ? DateValue[]
    : DateValue
type CalendarModelValue<R extends boolean = false, M extends boolean = false> = R extends true
  ? (DateRange | null)
  : M extends true
    ? (DateValue[] | undefined)
    : (DateValue | undefined)

type _CalendarRootProps = Omit<CalendarRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale' | 'calendarLabel' | 'multiple'>
type _RangeCalendarRootProps = Omit<RangeCalendarRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale' | 'calendarLabel' | 'multiple'>

export interface CalendarProps<R extends boolean = false, M extends boolean = false> extends _RangeCalendarRootProps, _CalendarRootProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The icon to use for the next year control.
   * @defaultValue appConfig.ui.icons.chevronDoubleRight
   * @IconifyIcon
   */
  nextYearIcon?: string
  /**
   * Configure the next year button.
   * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   */
  nextYear?: ButtonProps
  /**
   * The icon to use for the next month control.
   * @defaultValue appConfig.ui.icons.chevronRight
   * @IconifyIcon
   */
  nextMonthIcon?: string
  /**
   * Configure the next month button.
   * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   */
  nextMonth?: ButtonProps
  /**
   * The icon to use for the previous year control.
   * @defaultValue appConfig.ui.icons.chevronDoubleLeft
   * @IconifyIcon
   */
  prevYearIcon?: string
  /**
   * Configure the prev year button.
   * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   */
  prevYear?: ButtonProps
  /**
   * The icon to use for the previous month control.
   * @defaultValue appConfig.ui.icons.chevronLeft
   * @IconifyIcon
   */
  prevMonthIcon?: string
  /**
   * Configure the prev month button.
   * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   */
  prevMonth?: ButtonProps
  /**
   * @defaultValue 'primary'
   */
  color?: CalendarVariants['color']
  /**
   * @defaultValue 'md'
   */
  size?: CalendarVariants['size']
  /** Whether or not a range of dates can be selected */
  range?: R & boolean
  /** Whether or not multiple dates can be selected */
  multiple?: M & boolean
  /** Show month controls */
  monthControls?: boolean
  /** Show year controls */
  yearControls?: boolean
  defaultValue?: CalendarDefaultValue<R, M>
  modelValue?: CalendarModelValue<R, M>
  class?: any
  ui?: PartialString<typeof calendar.slots>
}

export interface CalendarEmits<R extends boolean, M extends boolean> extends Omit<CalendarRootEmits & RangeCalendarRootEmits, 'update:modelValue'> {
  'update:modelValue': [date: CalendarModelValue<R, M>]
}

export interface CalendarSlots {
  'heading': (props: { value: string }) => any
  'day': (props: Pick<CalendarCellTriggerProps, 'day'>) => any
  'week-day': (props: { day: string }) => any
}
</script>

<script setup lang="ts" generic="R extends boolean, M extends boolean">
import { computed } from 'vue'
import { useForwardPropsEmits } from 'reka-ui'
import { Calendar as SingleCalendar, RangeCalendar } from 'reka-ui/namespaced'
import { reactiveOmit } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import UButton from './Button.vue'

const props = withDefaults(defineProps<CalendarProps<R, M>>(), {
  fixedWeeks: true,
  monthControls: true,
  yearControls: true
})
const emits = defineEmits<CalendarEmits<R, M>>()
defineSlots<CalendarSlots>()

const appConfig = useAppConfig()
const { code: locale, dir, t } = useLocale()

const rootProps = useForwardPropsEmits(reactiveOmit(props, 'range', 'modelValue', 'defaultValue', 'color', 'size', 'monthControls', 'yearControls', 'class', 'ui'), emits)

const nextYearIcon = computed(() => props.nextYearIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronDoubleLeft : appConfig.ui.icons.chevronDoubleRight))
const nextMonthIcon = computed(() => props.nextMonthIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight))
const prevYearIcon = computed(() => props.prevYearIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronDoubleRight : appConfig.ui.icons.chevronDoubleLeft))
const prevMonthIcon = computed(() => props.prevMonthIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronRight : appConfig.ui.icons.chevronLeft))

const ui = computed(() => calendar({
  color: props.color,
  size: props.size
}))

function paginateYear(date: DateValue, sign: -1 | 1) {
  if (sign === -1) {
    return date.subtract({ years: 1 })
  }

  return date.add({ years: 1 })
}

const Calendar = computed(() => props.range ? RangeCalendar : SingleCalendar)
</script>

<template>
  <Calendar.Root
    v-slot="{ weekDays, grid }"
    v-bind="rootProps"
    :model-value="modelValue"
    :default-value="defaultValue"
    :locale="locale"
    :dir="dir"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
  >
    <Calendar.Header :class="ui.header({ class: props.ui?.header })">
      <Calendar.Prev v-if="props.yearControls" :prev-page="(date: DateValue) => paginateYear(date, -1)" :aria-label="t('calendar.prevYear')" as-child>
        <UButton :icon="prevYearIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.prevYear" />
      </Calendar.Prev>
      <Calendar.Prev v-if="props.monthControls" :aria-label="t('calendar.prevMonth')" as-child>
        <UButton :icon="prevMonthIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.prevMonth" />
      </Calendar.Prev>
      <Calendar.Heading v-slot="{ headingValue }" :class="ui.heading({ class: props.ui?.heading })">
        <slot name="heading" :value="headingValue">
          {{ headingValue }}
        </slot>
      </Calendar.Heading>
      <Calendar.Next v-if="props.monthControls" :aria-label="t('calendar.nextMonth')" as-child>
        <UButton :icon="nextMonthIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.nextMonth" />
      </Calendar.Next>
      <Calendar.Next v-if="props.yearControls" :next-page="(date: DateValue) => paginateYear(date, 1)" :aria-label="t('calendar.nextYear')" as-child>
        <UButton :icon="nextYearIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.nextYear" />
      </Calendar.Next>
    </Calendar.Header>
    <div :class="ui.body({ class: props.ui?.body })">
      <Calendar.Grid
        v-for="month in grid"
        :key="month.value.toString()"
        :class="ui.grid({ class: props.ui?.grid })"
      >
        <Calendar.GridHead>
          <Calendar.GridRow :class="ui.gridWeekDaysRow({ class: props.ui?.gridWeekDaysRow })">
            <Calendar.HeadCell
              v-for="day in weekDays"
              :key="day"
              :class="ui.headCell({ class: props.ui?.headCell })"
            >
              <slot name="week-day" :day="day">
                {{ day }}
              </slot>
            </Calendar.HeadCell>
          </Calendar.GridRow>
        </Calendar.GridHead>
        <Calendar.GridBody :class="ui.gridBody({ class: props.ui?.gridBody })">
          <Calendar.GridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            :class="ui.gridRow({ class: props.ui?.gridRow })"
          >
            <Calendar.Cell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              :class="ui.cell({ class: props.ui?.cell })"
            >
              <Calendar.CellTrigger
                :day="weekDate"
                :month="month.value"
                :class="ui.cellTrigger({ class: props.ui?.cellTrigger })"
              >
                <slot name="day" :day="weekDate">
                  {{ weekDate.day }}
                </slot>
              </Calendar.CellTrigger>
            </Calendar.Cell>
          </Calendar.GridRow>
        </Calendar.GridBody>
      </Calendar.Grid>
    </div>
  </Calendar.Root>
</template>
