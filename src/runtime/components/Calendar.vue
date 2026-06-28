<script lang="ts">
import type { CalendarRootProps, CalendarRootEmits, RangeCalendarRootProps, RangeCalendarRootEmits, MonthPickerRootProps, YearPickerRootProps, DateRange, CalendarCellTriggerProps } from 'reka-ui'
import { getWeekNumber } from 'reka-ui/date'
import type { Component, ComputedRef, VNode } from 'vue'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/calendar'
import type { ButtonProps, IconProps, LinkPropsKeys } from '../types'
import type { ComponentConfig } from '../types/tv'

type Calendar = ComponentConfig<typeof theme, AppConfig, 'calendar'>

export type CalendarType = 'date' | 'month' | 'year'
export type CalendarView = 'day' | 'month' | 'year'

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

type _CalendarRootProps = Omit<CalendarRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'calendarLabel' | 'multiple'>
type _RangeCalendarRootProps = Omit<RangeCalendarRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'calendarLabel' | 'multiple'>
type _MonthPickerRootProps = Pick<MonthPickerRootProps, 'isMonthDisabled' | 'isMonthUnavailable'>
type _YearPickerRootProps = Pick<YearPickerRootProps, 'isYearDisabled' | 'isYearUnavailable'>

export interface CalendarProps<R extends boolean = false, M extends boolean = false> extends _RangeCalendarRootProps, _CalendarRootProps, _MonthPickerRootProps, _YearPickerRootProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The type of picker.
   * - `date` renders a day calendar whose heading can switch to a month then year view.
   * - `month` renders a standalone month picker.
   * - `year` renders a standalone year picker.
   * @defaultValue 'date'
   */
  type?: CalendarType
  /**
   * The icon to use for the next year control.
   * @defaultValue appConfig.ui.icons.chevronDoubleRight
   * @IconifyIcon
   */
  nextYearIcon?: IconProps['name']
  /**
   * Configure the next year button.
   * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   */
  nextYear?: Omit<ButtonProps, LinkPropsKeys>
  /**
   * The icon to use for the next month control.
   * @defaultValue appConfig.ui.icons.chevronRight
   * @IconifyIcon
   */
  nextMonthIcon?: IconProps['name']
  /**
   * Configure the next month button.
   * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   */
  nextMonth?: Omit<ButtonProps, LinkPropsKeys>
  /**
   * The icon to use for the previous year control.
   * @defaultValue appConfig.ui.icons.chevronDoubleLeft
   * @IconifyIcon
   */
  prevYearIcon?: IconProps['name']
  /**
   * Configure the prev year button.
   * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   */
  prevYear?: Omit<ButtonProps, LinkPropsKeys>
  /**
   * The icon to use for the previous month control.
   * @defaultValue appConfig.ui.icons.chevronLeft
   * @IconifyIcon
   */
  prevMonthIcon?: IconProps['name']
  /**
   * Configure the prev month button.
   * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   */
  prevMonth?: Omit<ButtonProps, LinkPropsKeys>
  /**
   * Whether to make the heading a button that switches between the day, month and year views.
   * Has no effect when `type` is `year`. Can be an object to override the button props.
   * `{ color: 'neutral', variant: 'ghost', block: true }`{lang="ts-type"}
   * @defaultValue true
   */
  viewControl?: boolean | Omit<ButtonProps, LinkPropsKeys>
  /**
   * @defaultValue 'primary'
   */
  color?: Calendar['variants']['color']
  /**
   * @defaultValue 'solid'
   */
  variant?: Calendar['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: Calendar['variants']['size']
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
  weekNumbers?: boolean
  class?: any
  ui?: Calendar['slots']
}

export interface CalendarEmits<R extends boolean = false, M extends boolean = false> extends Omit<CalendarRootEmits & RangeCalendarRootEmits, 'update:modelValue'> {
  'update:modelValue': [value: CalendarModelValue<R, M>]
  'update:placeholder': [date: DateValue]
  'update:startValue': [date: DateValue | undefined]
  'update:validModelValue': [date: DateRange]
}

export interface CalendarSlots {
  'heading'?: (props: { value: string, view: CalendarView, date: DateValue, setView: (view: CalendarView) => void, setPlaceholder: (date: DateValue) => void }) => VNode[]
  'day'?: (props: Pick<CalendarCellTriggerProps, 'day'>) => VNode[]
  'week-day'?: (props: { day: string }) => VNode[]
  'month-cell'?: (props: { month: DateValue, selected: boolean, disabled: boolean }) => VNode[]
  'year-cell'?: (props: { year: DateValue, selected: boolean, disabled: boolean }) => VNode[]
}
</script>

<script setup lang="ts" generic="R extends boolean, M extends boolean">
import { computed, ref, shallowRef, watch } from 'vue'
import { useForwardProps } from '../composables/useForwardProps'
import { Calendar as SingleCalendar, RangeCalendar, MonthPicker, MonthRangePicker, YearPicker, YearRangePicker } from 'reka-ui/namespaced'
import { reactiveOmit } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const _props = withDefaults(defineProps<CalendarProps<R, M>>(), {
  type: 'date',
  fixedWeeks: true,
  monthControls: true,
  yearControls: true,
  viewControl: true
})
const emits = defineEmits<CalendarEmits<R, M>>()

defineSlots<CalendarSlots>()

const props = useComponentProps<CalendarProps<R, M>>('calendar', _props)

const { dir, t, locale } = useLocale()
const appConfig = useAppConfig() as Calendar['AppConfig']

const VIEWS: CalendarView[] = ['day', 'month', 'year']

const minView = computed<CalendarView>(() => props.type === 'year' ? 'year' : props.type === 'month' ? 'month' : 'day')
const maxView: CalendarView = 'year'

const view = ref<CalendarView>(minView.value)
watch(() => props.type, () => {
  view.value = minView.value
})

const switchable = computed(() => minView.value !== maxView)
const isMinView = computed(() => view.value === minView.value)

function clampView(value: CalendarView): CalendarView {
  const min = VIEWS.indexOf(minView.value)
  const max = VIEWS.indexOf(maxView)
  return VIEWS[Math.min(Math.max(VIEWS.indexOf(value), min), max)]!
}

function setView(value: CalendarView) {
  view.value = clampView(value)
}

function cycleView() {
  const max = VIEWS.indexOf(maxView)
  const next = VIEWS.indexOf(view.value) >= max ? minView.value : VIEWS[VIEWS.indexOf(view.value) + 1]!
  view.value = next
}

function resolveDateValue(value: DateValue | DateValue[] | DateRange | null | undefined): DateValue | undefined {
  if (Array.isArray(value)) {
    return value[0]
  }
  if (!value) {
    return undefined
  }
  if ('start' in value || 'end' in value) {
    const range = value as DateRange
    return range.start ?? range.end ?? undefined
  }
  return value as DateValue
}

const placeholder = shallowRef<DateValue>(
  props.placeholder
  ?? resolveDateValue(props.modelValue as CalendarModelValue<R, M>)
  ?? resolveDateValue(props.defaultValue as CalendarDefaultValue<R, M>)
  ?? today(getLocalTimeZone())
)
watch(() => props.placeholder, (value) => {
  if (value) {
    placeholder.value = value
  }
})

function setPlaceholder(date: DateValue) {
  placeholder.value = date
  emits('update:placeholder', date)
}

function onSelect(value: DateValue | DateRange) {
  if (isMinView.value) {
    emits('update:modelValue', value as CalendarModelValue<R, M>)
    return
  }

  const resolved = resolveDateValue(value)
  if (resolved) {
    setPlaceholder(resolved)
  }
  setView(VIEWS[VIEWS.indexOf(view.value) - 1]!)
}

function paginateYear(date: DateValue, sign: -1 | 1) {
  return sign === -1 ? date.subtract({ years: 1 }) : date.add({ years: 1 })
}

const Picker = computed(() => {
  // Only commit a range at the terminal view; drilling above it just navigates the placeholder.
  const range = props.range && isMinView.value
  if (view.value === 'year') {
    return range ? YearRangePicker : YearPicker
  }
  if (view.value === 'month') {
    return range ? MonthRangePicker : MonthPicker
  }
  return props.range ? RangeCalendar : SingleCalendar
}) as unknown as ComputedRef<Record<string, Component>>

const omittedProps = ['type', 'placeholder', 'range', 'modelValue', 'defaultValue', 'color', 'variant', 'size', 'monthControls', 'yearControls', 'viewControl', 'class', 'ui']
// Only declared by the day `Calendar` / `RangeCalendar` primitives, omitted in other views to avoid fallthrough attributes.
const dayOnlyProps = ['pagedNavigation', 'weekStartsOn', 'weekdayFormat', 'fixedWeeks', 'numberOfMonths', 'isDateDisabled', 'isDateUnavailable', 'isDateHighlightable', 'disableDaysOutsideCurrentView', 'maximumDays']
const monthOnlyProps = ['isMonthDisabled', 'isMonthUnavailable']
const yearOnlyProps = ['isYearDisabled', 'isYearUnavailable']
// Only declared by the range pickers, omitted when drilling above the terminal view since the picker is not a range picker there.
const rangeOnlyProps = ['allowNonContiguousRanges', 'fixedDate']

const rootProps = useForwardProps(reactiveOmit(props, (_, key) =>
  omittedProps.includes(key as string)
  || (view.value !== 'day' && dayOnlyProps.includes(key as string))
  || (view.value !== 'month' && monthOnlyProps.includes(key as string))
  || (view.value !== 'year' && yearOnlyProps.includes(key as string))
  || (!isMinView.value && rangeOnlyProps.includes(key as string))
))

function cellProps(cellDate: DateValue, monthValue: DateValue) {
  if (view.value === 'month') {
    return { month: cellDate }
  }
  if (view.value === 'year') {
    return { year: cellDate }
  }
  return { day: cellDate, month: monthValue }
}

// eslint-disable-next-line vue/no-dupe-keys
const nextYearIcon = computed(() => props.nextYearIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronDoubleLeft : appConfig.ui.icons.chevronDoubleRight))
// eslint-disable-next-line vue/no-dupe-keys
const nextMonthIcon = computed(() => props.nextMonthIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight))
// eslint-disable-next-line vue/no-dupe-keys
const prevYearIcon = computed(() => props.prevYearIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronDoubleRight : appConfig.ui.icons.chevronDoubleLeft))
// eslint-disable-next-line vue/no-dupe-keys
const prevMonthIcon = computed(() => props.prevMonthIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronRight : appConfig.ui.icons.chevronLeft))

const prevLabel = computed(() => view.value === 'day' ? t('calendar.prevMonth') : t('calendar.prevYear'))
const nextLabel = computed(() => view.value === 'day' ? t('calendar.nextMonth') : t('calendar.nextYear'))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.calendar || {}) })({
  color: props.color,
  size: props.size,
  variant: props.variant,
  weekNumbers: props.weekNumbers,
  view: view.value
}))
</script>

<template>
  <Picker.Root
    v-slot="{ weekDays, grid, date }"
    v-bind="rootProps"
    :model-value="(isMinView ? (props.modelValue as DateValue | DateValue[] | DateRange) : undefined)"
    :default-value="(isMinView ? (props.defaultValue as DateValue | DateValue[] | DateRange) : undefined)"
    :placeholder="placeholder"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @update:placeholder="setPlaceholder"
    @update:model-value="onSelect"
    @update:start-value="(value: DateValue | undefined) => emits('update:startValue', value)"
    @update:valid-model-value="(value: DateRange) => emits('update:validModelValue', value)"
  >
    <Picker.Header data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <Picker.Prev v-if="view === 'day' && props.yearControls" :prev-page="(date: DateValue) => paginateYear(date, -1)" :aria-label="t('calendar.prevYear')" as-child>
        <UButton :icon="prevYearIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.prevYear" />
      </Picker.Prev>
      <Picker.Prev v-if="view !== 'day' || props.monthControls" :aria-label="prevLabel" as-child>
        <UButton :icon="prevMonthIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.prevMonth" />
      </Picker.Prev>
      <Picker.Heading v-slot="{ headingValue }" data-slot="heading" :class="ui.heading({ class: props.ui?.heading })">
        <slot
          name="heading"
          :value="headingValue"
          :view="view"
          :date="date"
          :set-view="setView"
          :set-placeholder="setPlaceholder"
        >
          <UButton
            v-if="switchable && props.viewControl"
            :label="headingValue"
            :size="props.size"
            color="neutral"
            variant="ghost"
            block
            v-bind="(typeof props.viewControl === 'object' ? props.viewControl : {})"
            @click="cycleView"
          />
          <span v-else data-slot="headingLabel" :class="ui.headingLabel({ class: props.ui?.headingLabel })">{{ headingValue }}</span>
        </slot>
      </Picker.Heading>
      <Picker.Next v-if="view !== 'day' || props.monthControls" :aria-label="nextLabel" as-child>
        <UButton :icon="nextMonthIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.nextMonth" />
      </Picker.Next>
      <Picker.Next v-if="view === 'day' && props.yearControls" :next-page="(date: DateValue) => paginateYear(date, 1)" :aria-label="t('calendar.nextYear')" as-child>
        <UButton :icon="nextYearIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.nextYear" />
      </Picker.Next>
    </Picker.Header>
    <div data-slot="body" :class="ui.body({ class: props.ui?.body })">
      <Picker.Grid
        v-for="month in (Array.isArray(grid) ? grid : [grid])"
        :key="month.value.toString()"
        data-slot="grid"
        :class="ui.grid({ class: props.ui?.grid })"
      >
        <Picker.GridHead v-if="'GridHead' in Picker">
          <Picker.GridRow data-slot="gridWeekDaysRow" :class="ui.gridWeekDaysRow({ class: props.ui?.gridWeekDaysRow })">
            <Picker.HeadCell
              v-for="day in weekDays"
              :key="day"
              data-slot="headCell"
              :class="ui.headCell({ class: props.ui?.headCell })"
            >
              <slot name="week-day" :day="day">
                {{ day }}
              </slot>
            </Picker.HeadCell>
          </Picker.GridRow>
        </Picker.GridHead>
        <Picker.GridBody data-slot="gridBody" :class="ui.gridBody({ class: props.ui?.gridBody })">
          <Picker.GridRow
            v-for="(row, index) in month.rows"
            :key="`row-${index}`"
            data-slot="gridRow"
            :class="ui.gridRow({ class: props.ui?.gridRow })"
          >
            <td
              v-if="view === 'day' && props.weekNumbers && row[0]"
              role="gridcell"
              data-slot="cellWeek"
              :class="ui.cellWeek({ class: props.ui?.cellWeek })"
            >
              {{ getWeekNumber(row[0], props.locale ?? locale.code) }}
            </td>
            <Picker.Cell
              v-for="cellDate in row"
              :key="cellDate.toString()"
              :date="cellDate"
              data-slot="cell"
              :class="ui.cell({ class: props.ui?.cell })"
            >
              <Picker.CellTrigger
                v-slot="cell"
                v-bind="cellProps(cellDate, month.value)"
                data-slot="cellTrigger"
                :class="ui.cellTrigger({ class: props.ui?.cellTrigger })"
              >
                <slot v-if="view === 'day'" name="day" :day="cellDate">
                  {{ cellDate.day }}
                </slot>
                <slot v-else-if="view === 'month'" name="month-cell" :month="cellDate" :selected="cell.selected" :disabled="cell.disabled">
                  {{ cell.monthValue }}
                </slot>
                <slot v-else name="year-cell" :year="cellDate" :selected="cell.selected" :disabled="cell.disabled">
                  {{ cell.yearValue }}
                </slot>
              </Picker.CellTrigger>
            </Picker.Cell>
          </Picker.GridRow>
        </Picker.GridBody>
      </Picker.Grid>
    </div>
  </Picker.Root>
</template>
