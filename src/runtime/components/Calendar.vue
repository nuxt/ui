<script lang="ts">
import { computed } from 'vue'
import { tv, type VariantProps } from 'tailwind-variants'
import type { CalendarRootProps, CalendarCellTriggerProps } from 'radix-vue'
import type { DateValue } from '@internationalized/date'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/calendar'
import type { DateRange } from '../types/date'

const appConfig = _appConfig as AppConfig & { ui: { calendar: Partial<typeof theme> } }

const calendar = tv({ extend: tv(theme), ...(appConfig.ui?.calendar || {}) })

type CalendarVariants = VariantProps<typeof calendar>

interface BaseCalendarProps extends Pick<CalendarRootProps, 'weekStartsOn' | 'weekdayFormat' | 'fixedWeeks' | 'numberOfMonths' | 'disabled' | 'readonly' | 'initialFocus' | 'isDateDisabled' | 'isDateUnavailable'> {
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
  range: boolean
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

export interface CalendarSingleProps extends BaseCalendarProps {
  modelValue?: Date
  defaultValue?: Date
  range: false
}

export interface CalendarRangeProps extends BaseCalendarProps {
  modelValue?: DateRange
  defaultValue?: DateRange
  range: true
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps

export interface CalendarEmits {
  (e: 'update:modelValue', value: Date | DateRange): void
}

export interface CalendarSlots {
  'heading': (props: { value: string }) => any
  'day': (props: Pick<CalendarCellTriggerProps, 'day'>) => any
  'week-day': (props: { day: string }) => any
}
</script>

<script setup lang="ts" generic="T extends boolean">
import { useForwardPropsEmits } from 'radix-vue'
import { Calendar as SingleCalendar, RangeCalendar } from 'radix-vue/namespaced'
import { reactivePick } from '@vueuse/core'
import UButton from './Button.vue'
import { useLocale } from '../composables/useLocale'

const props = withDefaults(defineProps<CalendarProps>(), {
  range: false,
  fixedWeeks: true,
  yearControls: true
})
const emits = defineEmits<CalendarEmits>()
defineSlots<CalendarSlots>()

const { code: locale, dir } = useLocale()

const baseRootProps = useForwardPropsEmits(reactivePick(props, 'disabled', 'readonly', 'fixedWeeks', 'initialFocus', 'isDateDisabled', 'isDateUnavailable', 'maxValue', 'minValue', 'numberOfMonths', 'weekdayFormat', 'weekStartsOn'), emits)

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
    v-bind="baseRootProps"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
    :locale="locale"
    :dir="dir"
  >
    <Calendar.Header :class="ui.header({ class: props.ui?.header })">
      <Calendar.Prev v-if="props.yearControls" :prev-page="(date: DateValue) => paginateYear(date, -1)" as-child>
        <UButton :icon="appConfig.ui.icons.chevronDoubleLeft" :size="props.size" color="neutral" variant="ghost" />
      </Calendar.Prev>
      <Calendar.Prev as-child>
        <UButton :icon="appConfig.ui.icons.chevronLeft" :size="props.size" color="neutral" variant="ghost" />
      </Calendar.Prev>
      <Calendar.Heading v-slot="{ headingValue }" :class="ui.heading({ class: props.ui?.heading })">
        <slot name="heading" :value="headingValue">
          {{ headingValue }}
        </slot>
      </Calendar.Heading>
      <Calendar.Next as-child>
        <UButton :icon="appConfig.ui.icons.chevronRight" :size="props.size" color="neutral" variant="ghost" />
      </Calendar.Next>
      <Calendar.Next v-if="props.yearControls" :next-page="(date: DateValue) => paginateYear(date, 1)" as-child>
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
