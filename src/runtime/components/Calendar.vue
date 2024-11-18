<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { CalendarRootProps, CalendarCellTriggerProps } from 'radix-vue'
import type { DateValue, ZonedDateTime } from '@internationalized/date'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/calendar'
import type { DateRange, DateRangeRadix } from '../types/date'
import type { Grid } from 'radix-vue/date'

const appConfig = _appConfig as AppConfig & { ui: { calendar: Partial<typeof theme> } }

const calendar = tv({ extend: tv(theme), ...(appConfig.ui?.calendar || {}) })

type CalendarVariants = VariantProps<typeof calendar>

type ModelValue<T extends boolean> = (T extends true ? DateRange : Date) | undefined

export interface CalendarProps<T extends boolean> extends Pick<CalendarRootProps, 'numberOfMonths' | 'weekStartsOn' | 'weekdayFormat' | 'fixedWeeks' | 'disabled' | 'readonly' | 'initialFocus' | 'isDateDisabled' | 'isDateUnavailable'> {
  /**
   * The color of the calendar
   */
  color?: CalendarVariants['color']
  /**
   * The size of the calendar
   */
  size?: CalendarVariants['size']
  /**
   * Is this a range calendar
   */
  range?: T
  /**
   * Show year controls
   */
  yearControls?: boolean
  /**
   * The maximum date that can be selected
   */
  maxValue?: Date
  /**
   * The minimum date that can be selected
   */
  minValue?: Date
  class?: any
  ui?: Partial<typeof calendar.slots>
}

export interface CalendarSlots {
  'heading': (props: { value: string }) => any
  'day': (props: Pick<CalendarCellTriggerProps, 'day'>) => any
  'week-day': (props: { day: string }) => any
}
</script>

<script setup lang="ts" generic="T extends boolean">
import { toRef, computed } from 'vue'
import { Calendar as SingleCalendar, RangeCalendar } from 'radix-vue/namespaced'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import UButton from './Button.vue'
import { useLocale } from '../composables/useLocale'
import { toRangeDate, toRangeZonedDateTime, toZonedDateTime } from '../utils/date'
import type { ZonedDateRange } from '#ui/types/date'

const props = withDefaults(defineProps<CalendarProps<T>>(), {
  fixedWeeks: true,
  yearControls: true
})

// This is a hack due to generic boolean casting (see https://github.com/nuxt/ui/issues/2541)
const range = toRef(() => typeof props.range === 'string' ? true : props.range)

const modelValue = defineModel<ModelValue<T>>(undefined)
defineSlots<CalendarSlots>()

const { code: locale, dir, t } = useLocale()

const baseRootProps = reactivePick(props, 'disabled', 'readonly', 'fixedWeeks', 'initialFocus', 'isDateDisabled', 'isDateUnavailable', 'weekdayFormat')

function isRange(value: DateRangeRadix | DateValue | undefined): value is DateRangeRadix
function isRange(value: ModelValue<boolean>): value is ModelValue<true>
function isRange(value: ModelValue<boolean> | DateRangeRadix | DateValue | undefined) {
  return !!range.value
}

function transformModel(value: ModelValue<boolean>) {
  if (!value) {
    return undefined
  }

  return isRange(value) ? toRangeZonedDateTime(value) : toZonedDateTime(value)
}

const calendarValue = computed({
  get() {
    return transformModel(modelValue.value)
  },
  set(value) {
    if (!value) {
      modelValue.value = value
      return
    }

    modelValue.value = (range.value ? toRangeDate(value as ZonedDateRange) : (value as ZonedDateTime).toDate()) as ModelValue<T>
  }
})

const ui = computed(() => calendar({
  color: props.color,
  size: props.size
}))

const minValue = computed(() => toZonedDateTime(props.minValue))
const maxValue = computed(() => toZonedDateTime(props.maxValue))

function paginateYear(date: DateValue, sign: -1 | 1) {
  if (sign === -1) {
    return date.subtract({ years: 1 })
  }

  return date.add({ years: 1 })
}

const Calendar = computed(() => range.value ? RangeCalendar : SingleCalendar)
const [DefineCalendarBody, CalendarBody] = createReusableTemplate<{ grid: Grid<DateValue>[], weekDays: string[] }>()

const calendarProps = computed(() => {
  return {
    ...baseRootProps,
    minValue: minValue.value,
    maxValue: maxValue.value,
    locale: locale.value,
    dir: dir.value,
    class: ui.value.root({ class: [props.class, props.ui?.root] })
  }
})
</script>

<template>
  <DefineCalendarBody v-slot="{ weekDays, grid }">
    <Calendar.Header :class="ui.header({ class: props.ui?.header })">
      <Calendar.Prev v-if="props.yearControls" :prev-page="(date: DateValue) => paginateYear(date, -1)" :aria-label="t('calendar.prevYear')" as-child>
        <UButton :icon="appConfig.ui.icons.chevronDoubleLeft" :size="props.size" color="neutral" variant="ghost" />
      </Calendar.Prev>
      <Calendar.Prev :aria-label="t('calendar.prevMonth')" as-child>
        <UButton :icon="appConfig.ui.icons.chevronLeft" :size="props.size" color="neutral" variant="ghost" />
      </Calendar.Prev>
      <Calendar.Heading v-slot="{ headingValue }" :class="ui.heading({ class: props.ui?.heading })">
        <slot name="heading" :value="headingValue">
          {{ headingValue }}
        </slot>
      </Calendar.Heading>
      <Calendar.Next :aria-label="t('calendar.nextMonth')" as-child>
        <UButton :icon="appConfig.ui.icons.chevronRight" :size="props.size" color="neutral" variant="ghost" />
      </Calendar.Next>
      <Calendar.Next v-if="props.yearControls" :next-page="(date: DateValue) => paginateYear(date, 1)" :aria-label="t('calendar.nextYear')" as-child>
        <UButton :icon="appConfig.ui.icons.chevronDoubleRight" :size="props.size" color="neutral" variant="ghost" />
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
  </DefineCalendarBody>

  <RangeCalendar.Root
    v-if="isRange(calendarValue)"
    v-slot="{ weekDays, grid }"
    v-model="calendarValue"
    v-bind="calendarProps"
  >
    <CalendarBody v-bind="{ weekDays, grid }" />
  </RangeCalendar.Root>
  <SingleCalendar.Root
    v-else
    v-slot="{ weekDays, grid }"
    v-model="calendarValue"
    v-bind="calendarProps"
  >
    <CalendarBody v-bind="{ weekDays, grid }" />
  </SingleCalendar.Root>
</template>
