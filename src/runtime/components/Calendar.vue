<script lang="ts">
import type { CalendarRootProps, CalendarRootEmits, RangeCalendarRootProps, RangeCalendarRootEmits, DateRange, CalendarCellTriggerProps } from 'reka-ui'
import { getWeekNumber } from 'reka-ui/date'
import type { VNode } from 'vue'
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

type _CalendarRootProps = Omit<CalendarRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale' | 'calendarLabel' | 'multiple'>
type _RangeCalendarRootProps = Omit<RangeCalendarRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale' | 'calendarLabel' | 'multiple'>

export interface CalendarProps<R extends boolean = false, M extends boolean = false> extends _RangeCalendarRootProps, _CalendarRootProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The type of calendar picker.
   * @defaultValue 'date'
   */
  type?: CalendarType
  /** The controlled view state. Use with `@update:view` for controlled mode. */
  view?: CalendarView
  /**
   * The default view when uncontrolled.
   * @defaultValue Depends on `type` prop
   */
  defaultView?: CalendarView
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
  'update:view': [view: CalendarView]
}

export interface CalendarSlots {
  'heading'?(props: {
    value: string
    date: DateValue
    view: CalendarView
    setMonth: (date: DateValue) => void
    setYear: (date: DateValue) => void
    setView: (view: CalendarView) => void
  }): VNode[]
  'day'?(props: Pick<CalendarCellTriggerProps, 'day'>): VNode[]
  'week-day'?(props: { day: string }): VNode[]
  'month-cell'?(props: { month: DateValue, selected: boolean, disabled: boolean }): VNode[]
  'year-cell'?(props: { year: DateValue, selected: boolean, disabled: boolean }): VNode[]
}
</script>

<script setup lang="ts" generic="R extends boolean, M extends boolean">
import { computed, ref, shallowRef, watch } from 'vue'
import {
  MonthPickerRoot,
  MonthPickerHeader,
  MonthPickerHeading,
  MonthPickerGrid,
  MonthPickerGridBody,
  MonthPickerGridRow,
  MonthPickerCell,
  MonthPickerCellTrigger,
  MonthPickerPrev,
  MonthPickerNext,
  MonthRangePickerRoot,
  MonthRangePickerHeader,
  MonthRangePickerHeading,
  MonthRangePickerGrid,
  MonthRangePickerGridBody,
  MonthRangePickerGridRow,
  MonthRangePickerCell,
  MonthRangePickerCellTrigger,
  MonthRangePickerPrev,
  MonthRangePickerNext,
  YearPickerRoot,
  YearPickerHeader,
  YearPickerHeading,
  YearPickerGrid,
  YearPickerGridBody,
  YearPickerGridRow,
  YearPickerCell,
  YearPickerCellTrigger,
  YearPickerPrev,
  YearPickerNext,
  YearRangePickerRoot,
  YearRangePickerHeader,
  YearRangePickerHeading,
  YearRangePickerGrid,
  YearRangePickerGridBody,
  YearRangePickerGridRow,
  YearRangePickerCell,
  YearRangePickerCellTrigger,
  YearRangePickerPrev,
  YearRangePickerNext,
  useDateFormatter,
  useForwardPropsEmits
} from 'reka-ui'
import { Calendar as SingleCalendar, RangeCalendar } from 'reka-ui/namespaced'
import { reactiveOmit } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const props = withDefaults(defineProps<CalendarProps<R, M>>(), {
  type: 'date',
  fixedWeeks: true,
  monthControls: true,
  yearControls: true
})
const emits = defineEmits<CalendarEmits<R, M>>()
defineSlots<CalendarSlots>()

const { dir, t, code } = useLocale()
const appConfig = useAppConfig() as Calendar['AppConfig']
const uiProp = useComponentUI('calendar', props)
const formatter = shallowRef(useDateFormatter(code.value))

watch(() => code.value, (value) => {
  if (formatter.value.getLocale() !== value) {
    formatter.value.setLocale(value)
  }
})

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.calendar || {}) })({
  color: props.color,
  size: props.size,
  variant: props.variant,
  weekNumbers: props.weekNumbers
}))

function getDefaultView(type: CalendarType = props.type, defaultView = props.defaultView) {
  if (defaultView) {
    return defaultView
  }

  if (type === 'month') {
    return 'month'
  }

  if (type === 'year') {
    return 'year'
  }

  return 'day'
}

const internalView = ref<CalendarView>(getDefaultView())

watch(() => [props.type, props.defaultView, props.view], ([type, defaultView, view]) => {
  if (view === undefined) {
    internalView.value = getDefaultView(type as CalendarType, defaultView as CalendarView | undefined)
  }
})

const view = computed<CalendarView>({
  get() {
    if (props.type === 'month') {
      return 'month'
    }

    if (props.type === 'year') {
      return 'year'
    }

    return props.view ?? internalView.value
  },
  set(value) {
    if (props.type !== 'date') {
      return
    }

    internalView.value = value
    emits('update:view', value)
  }
})

function resolveDateValue(value: DateValue | DateValue[] | DateRange | null | undefined) {
  if (Array.isArray(value)) {
    return value[0]
  }

  if (!value) {
    return
  }

  if (isDateRange(value)) {
    return value.start ?? value.end ?? undefined
  }

  return value
}

function isDateRange(value: DateValue | DateRange) {
  return 'start' in value || 'end' in value
}

const localPlaceholder = shallowRef<DateValue | undefined>(props.placeholder)

watch(() => props.placeholder, (value) => {
  localPlaceholder.value = value
}, { immediate: true })

const dayPlaceholder = computed(() => {
  if (props.placeholder !== undefined || localPlaceholder.value !== undefined) {
    return localPlaceholder.value
  }

  return undefined
})

const pickerPlaceholder = computed(() => {
  return localPlaceholder.value
    ?? resolveDateValue(props.modelValue as DateValue | DateValue[] | DateRange | null | undefined)
    ?? resolveDateValue(props.defaultValue as DateValue | DateValue[] | DateRange | null | undefined)
    ?? today(getLocalTimeZone())
})

function syncPlaceholder(value: DateValue) {
  localPlaceholder.value = value
}

function updatePlaceholder(value: DateValue) {
  syncPlaceholder(value)
  emits('update:placeholder', value)
}

function setMonth(value: DateValue) {
  updatePlaceholder(value)
}

function setYear(value: DateValue, base = pickerPlaceholder.value) {
  updatePlaceholder(base.set({ year: value.year }))
}

function setView(value: CalendarView) {
  view.value = value
}

function paginateYear(date: DateValue, sign: -1 | 1) {
  return sign === -1 ? date.subtract({ years: 1 }) : date.add({ years: 1 })
}

const dayRootProps = useForwardPropsEmits(
  reactiveOmit(props, 'type', 'view', 'defaultView', 'range', 'modelValue', 'defaultValue', 'placeholder', 'color', 'variant', 'size', 'monthControls', 'yearControls', 'class', 'ui'),
  emits
)

const calendarRootProps = computed(() => ({
  ...dayRootProps.value,
  'onUpdate:placeholder': updatePlaceholder
}))

const nextYearIcon = computed(() => props.nextYearIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronDoubleLeft : appConfig.ui.icons.chevronDoubleRight))
const nextMonthIcon = computed(() => props.nextMonthIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight))
const prevYearIcon = computed(() => props.prevYearIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronDoubleRight : appConfig.ui.icons.chevronDoubleLeft))
const prevMonthIcon = computed(() => props.prevMonthIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronRight : appConfig.ui.icons.chevronLeft))

const translateWithFallback = (key: string, fallback: string) => {
  const label = t(key)
  return label === key ? fallback : label
}

const prevMonthLabel = computed(() => translateWithFallback('calendar.prevMonth', 'Previous month'))
const nextMonthLabel = computed(() => translateWithFallback('calendar.nextMonth', 'Next month'))
const prevYearLabel = computed(() => translateWithFallback('calendar.prevYear', 'Previous year'))
const nextYearLabel = computed(() => translateWithFallback('calendar.nextYear', 'Next year'))
const prevDecadeLabel = computed(() => translateWithFallback('calendar.prevDecade', prevYearLabel.value))
const nextDecadeLabel = computed(() => translateWithFallback('calendar.nextDecade', nextYearLabel.value))
const switchToMonthsLabel = computed(() => translateWithFallback('calendar.switchToMonths', 'Switch to month view'))
const switchToYearsLabel = computed(() => translateWithFallback('calendar.switchToYears', 'Switch to year view'))

function formatMonthLabel(date: DateValue) {
  code.value

  try {
    return formatter.value.custom(date.toDate(getLocalTimeZone()), { month: 'long' })
  } catch {
    return String(date.month)
  }
}

function formatYearLabel(date: DateValue) {
  code.value

  try {
    return formatter.value.custom(date.toDate(getLocalTimeZone()), { year: 'numeric' })
  } catch {
    return String(date.year)
  }
}

function getHeadingValue(date: DateValue, value: Extract<CalendarView, 'month' | 'year'>) {
  return value === 'month' ? formatMonthLabel(date) : formatYearLabel(date)
}

function getHeadingLabel(date: DateValue, value: Extract<CalendarView, 'month' | 'year'>) {
  const actionLabel = value === 'month' ? switchToMonthsLabel.value : switchToYearsLabel.value
  return `${getHeadingValue(date, value)}, ${actionLabel}`
}

function getHeadingButtonClass(active: boolean) {
  return [
    'rounded-md px-2 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accented',
    active ? 'cursor-default' : 'cursor-pointer hover:bg-elevated/50'
  ]
}

function emitModelValue(value: DateValue | DateRange) {
  emits('update:modelValue', value as CalendarModelValue<R, M>)
}

const DayCalendar = computed(() => props.range ? RangeCalendar : SingleCalendar)
const isMonthView = computed(() => view.value === 'month')
const isYearView = computed(() => view.value === 'year')
const isNavigationMonthView = computed(() => props.type === 'date' && isMonthView.value)
const isNavigationYearView = computed(() => props.type === 'date' && isYearView.value)
const isStandalonePicker = computed(() => props.type !== 'date')
const showMonthNavigation = computed(() => props.type === 'date' && view.value === 'day' && props.monthControls)

function onMonthUpdate(value: DateValue | DateRange) {
  if (isNavigationMonthView.value) {
    const nextValue = resolveDateValue(value) ?? pickerPlaceholder.value
    setMonth(nextValue)
    setView('day')
    return
  }

  emitModelValue(value)
}

function onYearUpdate(value: DateValue | DateRange) {
  if (isNavigationYearView.value) {
    const nextValue = resolveDateValue(value) ?? pickerPlaceholder.value
    setYear(nextValue, pickerPlaceholder.value)
    setView('month')
    return
  }

  emitModelValue(value)
}

const monthPicker = computed(() => ({
  kind: 'month' as const,
  root: props.range ? MonthRangePickerRoot : MonthPickerRoot,
  header: props.range ? MonthRangePickerHeader : MonthPickerHeader,
  heading: props.range ? MonthRangePickerHeading : MonthPickerHeading,
  grid: props.range ? MonthRangePickerGrid : MonthPickerGrid,
  gridBody: props.range ? MonthRangePickerGridBody : MonthPickerGridBody,
  gridRow: props.range ? MonthRangePickerGridRow : MonthPickerGridRow,
  cell: props.range ? MonthRangePickerCell : MonthPickerCell,
  cellTrigger: props.range ? MonthRangePickerCellTrigger : MonthPickerCellTrigger,
  prev: props.range ? MonthRangePickerPrev : MonthPickerPrev,
  next: props.range ? MonthRangePickerNext : MonthPickerNext,
  slotName: 'month-cell',
  gridSlot: 'monthGrid',
  rowSlot: 'monthGridRow',
  cellSlot: 'monthCell',
  triggerSlot: 'monthCellTrigger',
  itemProp: 'month',
  labelProp: 'monthValue',
  previousLabel: prevYearLabel.value,
  nextLabel: nextYearLabel.value,
  onUpdate: onMonthUpdate
}) as const)

const yearPicker = computed(() => ({
  kind: 'year' as const,
  root: props.range ? YearRangePickerRoot : YearPickerRoot,
  header: props.range ? YearRangePickerHeader : YearPickerHeader,
  heading: props.range ? YearRangePickerHeading : YearPickerHeading,
  grid: props.range ? YearRangePickerGrid : YearPickerGrid,
  gridBody: props.range ? YearRangePickerGridBody : YearPickerGridBody,
  gridRow: props.range ? YearRangePickerGridRow : YearPickerGridRow,
  cell: props.range ? YearRangePickerCell : YearPickerCell,
  cellTrigger: props.range ? YearRangePickerCellTrigger : YearPickerCellTrigger,
  prev: props.range ? YearRangePickerPrev : YearPickerPrev,
  next: props.range ? YearRangePickerNext : YearPickerNext,
  slotName: 'year-cell',
  gridSlot: 'yearGrid',
  rowSlot: 'yearGridRow',
  cellSlot: 'yearCell',
  triggerSlot: 'yearCellTrigger',
  itemProp: 'year',
  labelProp: 'yearValue',
  previousLabel: prevDecadeLabel.value,
  nextLabel: nextDecadeLabel.value,
  onUpdate: onYearUpdate
}) as const)

const picker = computed<any>(() => isMonthView.value ? monthPicker.value : yearPicker.value)
const pickerDefaultValue = computed(() => props.defaultValue as DateValue | DateRange | undefined)
const pickerModelValue = computed(() => props.modelValue as DateValue | DateRange | undefined)
const pickerValueProps = computed<Record<string, any>>(() => isStandalonePicker.value
  ? {
      modelValue: pickerModelValue.value,
      defaultValue: pickerDefaultValue.value
    }
  : {})

function onPickerPlaceholderUpdate(value: DateValue) {
  if (isStandalonePicker.value) {
    updatePlaceholder(value)
    return
  }

  syncPlaceholder(value)
}
</script>

<template>
  <DayCalendar.Root
    v-if="view === 'day'"
    v-slot="{ weekDays, grid, date }"
    v-bind="calendarRootProps"
    :model-value="(modelValue as DateValue | DateValue[])"
    :default-value="(defaultValue as DateValue)"
    :placeholder="dayPlaceholder"
    :locale="code"
    :dir="dir"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
  >
    <DayCalendar.Header data-slot="header" :class="ui.header({ class: uiProp?.header })">
      <DayCalendar.Prev v-if="props.yearControls" :prev-page="(value: DateValue) => paginateYear(value, -1)" :aria-label="prevYearLabel" as-child>
        <UButton :icon="prevYearIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.prevYear" />
      </DayCalendar.Prev>
      <DayCalendar.Prev v-if="showMonthNavigation" :aria-label="prevMonthLabel" as-child>
        <UButton :icon="prevMonthIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.prevMonth" />
      </DayCalendar.Prev>
      <DayCalendar.Heading v-slot="{ headingValue }" data-slot="heading" :class="ui.heading({ class: uiProp?.heading })">
        <slot
          name="heading"
          :value="headingValue"
          :date="date"
          :view="view"
          :set-month="setMonth"
          :set-year="(value: DateValue) => setYear(value, date)"
          :set-view="setView"
        >
          <div class="inline-flex items-center gap-1">
            <button
              type="button"
              :class="getHeadingButtonClass(false)"
              :aria-label="getHeadingLabel(date, 'month')"
              @click="setView('month')"
            >
              {{ formatMonthLabel(date) }}
            </button>
            <button
              type="button"
              :class="getHeadingButtonClass(false)"
              :aria-label="getHeadingLabel(date, 'year')"
              @click="setView('year')"
            >
              {{ formatYearLabel(date) }}
            </button>
          </div>
        </slot>
      </DayCalendar.Heading>
      <DayCalendar.Next v-if="showMonthNavigation" :aria-label="nextMonthLabel" as-child>
        <UButton :icon="nextMonthIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.nextMonth" />
      </DayCalendar.Next>
      <DayCalendar.Next v-if="props.yearControls" :next-page="(value: DateValue) => paginateYear(value, 1)" :aria-label="nextYearLabel" as-child>
        <UButton :icon="nextYearIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.nextYear" />
      </DayCalendar.Next>
    </DayCalendar.Header>
    <div data-slot="body" :class="ui.body({ class: uiProp?.body })">
      <DayCalendar.Grid
        v-for="month in grid"
        :key="month.value.toString()"
        data-slot="grid"
        :class="ui.grid({ class: uiProp?.grid })"
      >
        <DayCalendar.GridHead>
          <DayCalendar.GridRow data-slot="gridWeekDaysRow" :class="ui.gridWeekDaysRow({ class: uiProp?.gridWeekDaysRow })">
            <DayCalendar.HeadCell
              v-for="day in weekDays"
              :key="day"
              data-slot="headCell"
              :class="ui.headCell({ class: uiProp?.headCell })"
            >
              <slot name="week-day" :day="day">
                {{ day }}
              </slot>
            </DayCalendar.HeadCell>
          </DayCalendar.GridRow>
        </DayCalendar.GridHead>
        <DayCalendar.GridBody data-slot="gridBody" :class="ui.gridBody({ class: uiProp?.gridBody })">
          <DayCalendar.GridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            data-slot="gridRow"
            :class="ui.gridRow({ class: uiProp?.gridRow })"
          >
            <td
              v-if="weekNumbers && weekDates[0]"
              role="gridcell"
              data-slot="cellWeek"
              :class="ui.cellWeek({ class: uiProp?.cellWeek })"
            >
              {{ getWeekNumber(weekDates[0], code) }}
            </td>
            <DayCalendar.Cell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              data-slot="cell"
              :class="ui.cell({ class: uiProp?.cell })"
            >
              <DayCalendar.CellTrigger
                :day="weekDate"
                :month="month.value"
                data-slot="cellTrigger"
                :class="ui.cellTrigger({ class: uiProp?.cellTrigger })"
              >
                <slot name="day" :day="weekDate">
                  {{ weekDate.day }}
                </slot>
              </DayCalendar.CellTrigger>
            </DayCalendar.Cell>
          </DayCalendar.GridRow>
        </DayCalendar.GridBody>
      </DayCalendar.Grid>
    </div>
  </DayCalendar.Root>

  <component
    :is="picker.root"
    v-else
    v-slot="{ grid, date }"
    v-bind="pickerValueProps"
    :placeholder="pickerPlaceholder"
    :locale="code"
    :dir="dir"
    :min-value="minValue"
    :max-value="maxValue"
    :disabled="disabled"
    :readonly="readonly"
    data-slot="root"
    :class="ui.root({ class: ['inline-flex w-fit flex-col gap-4', uiProp?.root, props.class] })"
    @update:model-value="picker.onUpdate"
    @update:placeholder="onPickerPlaceholderUpdate"
  >
    <component
      :is="picker.header"
      data-slot="header"
      :class="ui.header({ class: ['grid w-full grid-cols-[auto_1fr_1fr_auto] items-center gap-1', uiProp?.header] })"
    >
      <component :is="picker.prev" v-if="props.yearControls" :aria-label="picker.previousLabel" as-child>
        <UButton :icon="prevYearIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.prevYear" />
      </component>
      <component
        :is="picker.heading"
        v-slot="{ headingValue }"
        data-slot="heading"
        :class="ui.heading({ class: ['col-span-2 overflow-visible whitespace-nowrap text-center', uiProp?.heading] })"
      >
        <slot
          name="heading"
          :value="headingValue"
          :date="date"
          :view="view"
          :set-month="setMonth"
          :set-year="(value: DateValue) => setYear(value, date)"
          :set-view="setView"
        >
          <div v-if="props.type === 'date'" class="inline-flex items-center gap-1">
            <button
              type="button"
              :class="getHeadingButtonClass(view === 'month')"
              :aria-label="getHeadingLabel(date, 'month')"
              :disabled="view === 'month'"
              @click="setView('month')"
            >
              {{ formatMonthLabel(date) }}
            </button>
            <button
              type="button"
              :class="getHeadingButtonClass(view === 'year')"
              :aria-label="getHeadingLabel(date, 'year')"
              :disabled="view === 'year'"
              @click="setView('year')"
            >
              {{ formatYearLabel(date) }}
            </button>
          </div>
          <span v-else>
            {{ headingValue }}
          </span>
        </slot>
      </component>
      <component :is="picker.next" v-if="props.yearControls" :aria-label="picker.nextLabel" as-child>
        <UButton :icon="nextYearIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.nextYear" />
      </component>
    </component>

    <component
      :is="picker.grid"
      as="div"
      :data-slot="picker.gridSlot"
      :class="picker.kind === 'month'
        ? ui.monthGrid({ class: uiProp?.monthGrid })
        : ui.yearGrid({ class: uiProp?.yearGrid })"
    >
      <component :is="picker.gridBody" as="div">
        <component
          :is="picker.gridRow"
          v-for="(row, rowIndex) in grid.rows"
          :key="rowIndex"
          as="div"
          :data-slot="picker.rowSlot"
          :class="picker.kind === 'month'
            ? ui.monthGridRow({ class: uiProp?.monthGridRow })
            : ui.yearGridRow({ class: uiProp?.yearGridRow })"
        >
          <component
            :is="picker.cell"
            v-for="cellDate in row"
            :key="cellDate.toString()"
            as="div"
            :date="cellDate"
            :data-slot="picker.cellSlot"
            :class="picker.kind === 'month'
              ? ui.monthCell({ class: uiProp?.monthCell })
              : ui.yearCell({ class: uiProp?.yearCell })"
          >
            <component
              :is="picker.cellTrigger"
              v-slot="slotProps"
              v-bind="{ [picker.itemProp]: cellDate }"
              :data-slot="picker.triggerSlot"
              :class="picker.kind === 'month'
                ? ui.monthCellTrigger({ class: uiProp?.monthCellTrigger })
                : ui.yearCellTrigger({ class: uiProp?.yearCellTrigger })"
            >
              <slot v-if="picker.kind === 'month'" name="month-cell" :month="cellDate" :selected="slotProps.selected" :disabled="slotProps.disabled">
                {{ slotProps.monthValue }}
              </slot>
              <slot v-else name="year-cell" :year="cellDate" :selected="slotProps.selected" :disabled="slotProps.disabled">
                {{ slotProps.yearValue }}
              </slot>
            </component>
          </component>
        </component>
      </component>
    </component>
  </component>
</template>
