<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { CalendarRootProps, CalendarRootEmits, RangeCalendarRootEmits, DateRange, CalendarCellTriggerProps } from 'reka-ui'
import type { DateValue } from '@internationalized/date'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/calendar'

const appConfig = _appConfig as AppConfig & { ui: { calendar: Partial<typeof theme> } }

const calendar = tv({ extend: tv(theme), ...(appConfig.ui?.calendar || {}) })

type CalendarVariants = VariantProps<typeof calendar>

type CalendarModelValue<R extends boolean = false, M extends boolean = false> = R extends true
  ? DateRange
  : M extends true
    ? DateValue[]
    : DateValue

export interface CalendarProps<R extends boolean, M extends boolean> extends Omit<CalendarRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale' | 'calendarLabel' | 'multiple'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  color?: CalendarVariants['color']
  size?: CalendarVariants['size']
  /** Whether or not a range of dates can be selected */
  range?: R & boolean
  /** Whether or not multiple dates can be selected */
  multiple?: M & boolean
  /** Show month controls */
  monthControls?: boolean
  /** Show year controls */
  yearControls?: boolean
  defaultValue?: CalendarModelValue<R, M>
  modelValue?: CalendarModelValue<R, M>
  class?: any
  ui?: Partial<typeof calendar.slots>
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

<script setup lang="ts" generic="R extends boolean = false, M extends boolean = false">
import { computed } from 'vue'
import { useForwardPropsEmits } from 'reka-ui'
import { Calendar as SingleCalendar, RangeCalendar } from 'reka-ui/namespaced'
import { reactiveOmit } from '@vueuse/core'
import { useLocale } from '../composables/useLocale'
import UButton from './Button.vue'

const props = withDefaults(defineProps<CalendarProps<R, M>>(), {
  fixedWeeks: true,
  monthControls: true,
  yearControls: true
})
const emits = defineEmits<CalendarEmits<R, M>>()
defineSlots<CalendarSlots>()

const { code: locale, dir, t } = useLocale()

const rootProps = useForwardPropsEmits(reactiveOmit(props, 'range', 'modelValue', 'defaultValue', 'color', 'size', 'monthControls', 'yearControls', 'class', 'ui'), emits)

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
    :model-value="(modelValue as CalendarModelValue<true & false>)"
    :default-value="(defaultValue as CalendarModelValue<true & false>)"
    :locale="locale"
    :dir="dir"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
  >
    <Calendar.Header :class="ui.header({ class: props.ui?.header })">
      <Calendar.Prev v-if="props.yearControls" :prev-page="(date: DateValue) => paginateYear(date, -1)" :aria-label="t('calendar.prevYear')" as-child>
        <UButton :icon="appConfig.ui.icons.chevronDoubleLeft" :size="props.size" color="neutral" variant="ghost" />
      </Calendar.Prev>
      <Calendar.Prev v-if="props.monthControls" :aria-label="t('calendar.prevMonth')" as-child>
        <UButton :icon="appConfig.ui.icons.chevronLeft" :size="props.size" color="neutral" variant="ghost" />
      </Calendar.Prev>
      <Calendar.Heading v-slot="{ headingValue }" :class="ui.heading({ class: props.ui?.heading })">
        <slot name="heading" :value="headingValue">
          {{ headingValue }}
        </slot>
      </Calendar.Heading>
      <Calendar.Next v-if="props.monthControls" :aria-label="t('calendar.nextMonth')" as-child>
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
  </Calendar.Root>
</template>
