<script lang="ts">
import type { CalendarRootProps, CalendarRootEmits, RangeCalendarRootProps, RangeCalendarRootEmits, CalendarChangeReason, RangeCalendarChangeReason, ChangeEventDetails, DateRange, DateValue } from 'reka-ui'
import { getLocalTimeZone, getWeekNumber, today } from 'reka-ui/date'
import type { Component, ComputedRef, VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/calendar'
import type { ButtonProps } from './Button.vue'
import type { IconProps } from './Icon.vue'
import type { LinkPropsKeys } from './Link.vue'
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

type CalendarChangeDetails = ChangeEventDetails<CalendarChangeReason | RangeCalendarChangeReason>

type _CalendarRootProps = Omit<CalendarRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'calendarLabel' | 'multiple' | 'granularity'>
type _RangeCalendarRootProps = Omit<RangeCalendarRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'calendarLabel' | 'multiple' | 'granularity'>

export interface CalendarProps<R extends boolean = false, M extends boolean = false> extends _RangeCalendarRootProps, _CalendarRootProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The type of picker, the unit a selection commits.
   * - `date` renders a day calendar whose heading can switch to a month then year view.
   * - `month` renders a month picker whose heading can switch to a year view.
   * - `year` renders a year picker.
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
   * Whether to make the heading a button that switches to the next coarser view, up to `maxView`.
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

export interface CalendarEmits<R extends boolean = false, M extends boolean = false> extends Omit<CalendarRootEmits & RangeCalendarRootEmits, 'beforeUpdate:modelValue' | 'update:modelValue' | 'beforeUpdate:placeholder' | 'update:placeholder' | 'beforeUpdate:view' | 'update:view' | 'update:startValue'> {
  'beforeUpdate:modelValue': [value: CalendarModelValue<R, M>, details: CalendarChangeDetails]
  'update:modelValue': [value: CalendarModelValue<R, M>, details: CalendarChangeDetails]
  'beforeUpdate:placeholder': [date: DateValue, details: CalendarChangeDetails]
  'update:placeholder': [date: DateValue, details?: CalendarChangeDetails]
  'beforeUpdate:view': [view: CalendarView, details: CalendarChangeDetails]
  'update:view': [view: CalendarView, details?: CalendarChangeDetails]
  'update:startValue': [date: DateValue | undefined, details: CalendarChangeDetails]
  'update:validModelValue': [date: DateRange]
}

export interface CalendarSlots {
  'heading'?: (props: { value: string, view: CalendarView, date: DateValue, setView: (view: CalendarView) => void, setPlaceholder: (date: DateValue) => void }) => VNode[]
  'day'?: (props: { day: DateValue }) => VNode[]
  'week-day'?: (props: { day: string }) => VNode[]
  'month-cell'?: (props: { month: DateValue, selected: boolean, disabled: boolean }) => VNode[]
  'year-cell'?: (props: { year: DateValue, selected: boolean, disabled: boolean }) => VNode[]
}
</script>

<script setup lang="ts" generic="R extends boolean, M extends boolean">
import { computed, ref, shallowRef, watch } from 'vue'
import { useForwardProps } from '../composables/useForwardProps'
import { CalendarRoot, CalendarHeader, CalendarHeading, CalendarViewTrigger, CalendarGrid, CalendarCell, CalendarHeadCell, CalendarNext, CalendarPrev, CalendarGridHead, CalendarGridBody, CalendarGridRow, CalendarCellTrigger, RangeCalendarRoot, RangeCalendarHeader, RangeCalendarHeading, RangeCalendarViewTrigger, RangeCalendarGrid, RangeCalendarCell, RangeCalendarHeadCell, RangeCalendarNext, RangeCalendarPrev, RangeCalendarGridHead, RangeCalendarGridBody, RangeCalendarGridRow, RangeCalendarCellTrigger } from 'reka-ui'
import { reactiveOmit } from '@vueuse/core'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../composables/useComponentProps'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const SingleCalendar = { Root: CalendarRoot, Header: CalendarHeader, Heading: CalendarHeading, ViewTrigger: CalendarViewTrigger, Grid: CalendarGrid, Cell: CalendarCell, HeadCell: CalendarHeadCell, Next: CalendarNext, Prev: CalendarPrev, GridHead: CalendarGridHead, GridBody: CalendarGridBody, GridRow: CalendarGridRow, CellTrigger: CalendarCellTrigger }
const RangeCalendar = { Root: RangeCalendarRoot, Header: RangeCalendarHeader, Heading: RangeCalendarHeading, ViewTrigger: RangeCalendarViewTrigger, Grid: RangeCalendarGrid, Cell: RangeCalendarCell, HeadCell: RangeCalendarHeadCell, Next: RangeCalendarNext, Prev: RangeCalendarPrev, GridHead: RangeCalendarGridHead, GridBody: RangeCalendarGridBody, GridRow: RangeCalendarGridRow, CellTrigger: RangeCalendarCellTrigger }

const _props = withDefaults(defineProps<CalendarProps<R, M>>(), {
  type: 'date',
  fixedWeeks: true,
  monthControls: true,
  yearControls: true,
  viewControl: true
})
const emits = defineEmits<CalendarEmits<R, M>>()

defineSlots<CalendarSlots>()

const props = useComponentProps<CalendarProps<R, M>>('calendar', _props, theme)

const { dir, t, locale } = useLocale()
const appConfig = useThemeConfig() as Calendar['AppConfig']
const overrides = useComponentOverrides((ui: Calendar['AppConfig']['ui']) => ui.calendar)

const VIEWS: CalendarView[] = ['day', 'month', 'year']

const granularity = computed<CalendarView>(() => props.type === 'year' ? 'year' : props.type === 'month' ? 'month' : 'day')
const maxView = computed<CalendarView>(() => props.maxView ?? 'year')

function clampView(value: CalendarView): CalendarView {
  const min = VIEWS.indexOf(granularity.value)
  const max = Math.max(VIEWS.indexOf(maxView.value), min)
  return VIEWS[Math.min(Math.max(VIEWS.indexOf(value), min), max)]!
}

const view = ref<CalendarView>(clampView(props.view ?? props.defaultView ?? granularity.value))
watch(() => props.view, (value) => {
  if (value) {
    view.value = clampView(value)
  }
})
watch(granularity, () => {
  view.value = clampView(props.view ?? granularity.value)
})
watch(maxView, () => {
  view.value = clampView(props.view ?? view.value)
})

const switchable = computed(() => granularity.value !== clampView(maxView.value))

function setView(value: CalendarView, details?: CalendarChangeDetails) {
  view.value = clampView(value)
  emits('update:view', view.value, details)
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

function setPlaceholder(date: DateValue, details?: CalendarChangeDetails) {
  placeholder.value = date
  emits('update:placeholder', date, details)
}

function paginateYear(date: DateValue, sign: -1 | 1) {
  return sign === -1 ? date.subtract({ years: 1 }) : date.add({ years: 1 })
}

const Picker = computed(() => props.range ? RangeCalendar : SingleCalendar) as unknown as ComputedRef<Record<string, Component>>

const rootProps = useForwardProps(reactiveOmit(props, 'type', 'placeholder', 'view', 'defaultView', 'range', 'modelValue', 'defaultValue', 'color', 'variant', 'size', 'monthControls', 'yearControls', 'viewControl', 'class', 'ui'))

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
const calendarLabel = computed(() => view.value === 'year' ? t('calendar.yearPicker') : view.value === 'month' ? t('calendar.monthPicker') : t('calendar.label'))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({
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
    :granularity="granularity"
    :view="view"
    :calendar-label="calendarLabel"
    :model-value="(props.modelValue as DateValue | DateValue[] | DateRange)"
    :default-value="(props.defaultValue as DateValue | DateValue[] | DateRange)"
    :placeholder="placeholder"
    data-slot="calendar"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @before-update:model-value="(value: CalendarModelValue<R, M>, details: CalendarChangeDetails) => emits('beforeUpdate:modelValue', value, details)"
    @update:model-value="(value: CalendarModelValue<R, M>, details: CalendarChangeDetails) => emits('update:modelValue', value, details)"
    @before-update:placeholder="(value: DateValue, details: CalendarChangeDetails) => emits('beforeUpdate:placeholder', value, details)"
    @update:placeholder="setPlaceholder"
    @before-update:view="(value: CalendarView, details: CalendarChangeDetails) => emits('beforeUpdate:view', value, details)"
    @update:view="setView"
    @update:start-value="(value: DateValue | undefined, details: CalendarChangeDetails) => emits('update:startValue', value, details)"
    @update:valid-model-value="(value: DateRange) => emits('update:validModelValue', value)"
  >
    <Picker.Header data-slot="calendar-header" :class="ui.header({ class: props.ui?.header })">
      <Picker.Prev v-if="view === 'day' && props.yearControls" :prev-page="(date: DateValue) => paginateYear(date, -1)" :aria-label="t('calendar.prevYear')" as-child>
        <UButton :icon="prevYearIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.prevYear" />
      </Picker.Prev>
      <Picker.Prev v-if="view !== 'day' || props.monthControls" :aria-label="prevLabel" as-child>
        <UButton :icon="prevMonthIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.prevMonth" />
      </Picker.Prev>
      <Picker.Heading v-slot="{ headingValue }" data-slot="calendar-heading" :class="ui.heading({ class: props.ui?.heading })">
        <slot
          name="heading"
          :value="headingValue"
          :view="view"
          :date="date"
          :set-view="setView"
          :set-placeholder="setPlaceholder"
        >
          <Picker.ViewTrigger v-if="switchable && props.viewControl" as-child>
            <UButton
              :label="headingValue"
              :size="props.size"
              color="neutral"
              variant="ghost"
              block
              v-bind="(typeof props.viewControl === 'object' ? props.viewControl : {})"
            />
          </Picker.ViewTrigger>
          <span v-else data-slot="calendar-headingLabel" :class="ui.headingLabel({ class: props.ui?.headingLabel })">{{ headingValue }}</span>
        </slot>
      </Picker.Heading>
      <Picker.Next v-if="view !== 'day' || props.monthControls" :aria-label="nextLabel" as-child>
        <UButton :icon="nextMonthIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.nextMonth" />
      </Picker.Next>
      <Picker.Next v-if="view === 'day' && props.yearControls" :next-page="(date: DateValue) => paginateYear(date, 1)" :aria-label="t('calendar.nextYear')" as-child>
        <UButton :icon="nextYearIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.nextYear" />
      </Picker.Next>
    </Picker.Header>
    <div data-slot="calendar-body" :class="ui.body({ class: props.ui?.body })">
      <Picker.Grid
        v-for="month in grid"
        :key="month.value.toString()"
        :value="month.value"
        data-slot="calendar-grid"
        :class="ui.grid({ class: props.ui?.grid })"
      >
        <Picker.GridHead v-if="view === 'day'">
          <Picker.GridRow data-slot="calendar-gridWeekDaysRow" :class="ui.gridWeekDaysRow({ class: props.ui?.gridWeekDaysRow })">
            <Picker.HeadCell
              v-for="day in weekDays"
              :key="day"
              data-slot="calendar-headCell"
              :class="ui.headCell({ class: props.ui?.headCell })"
            >
              <slot name="week-day" :day="day">
                {{ day }}
              </slot>
            </Picker.HeadCell>
          </Picker.GridRow>
        </Picker.GridHead>
        <Picker.GridBody data-slot="calendar-gridBody" :class="ui.gridBody({ class: props.ui?.gridBody })">
          <Picker.GridRow
            v-for="(row, index) in month.rows"
            :key="`row-${index}`"
            data-slot="calendar-gridRow"
            :class="ui.gridRow({ class: props.ui?.gridRow })"
          >
            <td
              v-if="view === 'day' && props.weekNumbers && row[0]"
              role="gridcell"
              data-slot="calendar-cellWeek"
              :class="ui.cellWeek({ class: props.ui?.cellWeek })"
            >
              {{ getWeekNumber(row[0], props.locale ?? locale.code) }}
            </td>
            <Picker.Cell
              v-for="cellDate in row"
              :key="cellDate.toString()"
              :value="cellDate"
              data-slot="calendar-cell"
              :class="ui.cell({ class: props.ui?.cell })"
            >
              <Picker.CellTrigger
                v-slot="cell"
                :value="cellDate"
                data-slot="calendar-cellTrigger"
                :class="ui.cellTrigger({ class: props.ui?.cellTrigger })"
              >
                <slot v-if="view === 'day'" name="day" :day="cellDate">
                  {{ cellDate.day }}
                </slot>
                <slot v-else-if="view === 'month'" name="month-cell" :month="cellDate" :selected="cell.selected" :disabled="cell.disabled">
                  {{ cell.cellValue }}
                </slot>
                <slot v-else name="year-cell" :year="cellDate" :selected="cell.selected" :disabled="cell.disabled">
                  {{ cell.cellValue }}
                </slot>
              </Picker.CellTrigger>
            </Picker.Cell>
          </Picker.GridRow>
        </Picker.GridBody>
      </Picker.Grid>
    </div>
  </Picker.Root>
</template>
