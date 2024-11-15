<script lang="ts">
import { computed } from 'vue'
import { tv, type VariantProps } from 'tailwind-variants'
import type { CalendarRootProps, CalendarCellTriggerProps } from 'radix-vue'
import type { DateValue } from '@internationalized/date'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/calendar'

const appConfig = _appConfig as AppConfig & { ui: { calendar: Partial<typeof theme> } }

const calendar = tv({ extend: tv(theme), ...(appConfig.ui?.calendar || {}) })

type CalendarVariants = VariantProps<typeof calendar>

export interface CalendarProps extends Pick<CalendarRootProps, 'numberOfMonths' | 'weekStartsOn' | 'weekdayFormat' | 'fixedWeeks' | 'disabled' | 'readonly' | 'initialFocus' | 'isDateDisabled' | 'isDateUnavailable'> {
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
  range?: boolean
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
  defaultValue?: Partial<any>
  class?: any
  ui?: Partial<typeof calendar.slots>
}

export interface CalendarEmits {
  (e: 'update:modelValue', value: any): void
}

export interface CalendarSlots {
  'heading': (props: { value: string }) => any
  'day': (props: Pick<CalendarCellTriggerProps, 'day'>) => any
  'week-day': (props: { day: string }) => any
}
</script>

<script setup lang="ts">
import { useForwardPropsEmits } from 'radix-vue'
import { Calendar as SingleCalendar, RangeCalendar } from 'radix-vue/namespaced'
import { reactivePick } from '@vueuse/core'
import UButton from './Button.vue'
import { useLocale } from '../composables/useLocale'
import { toRangeDate, toRangeZonedDateTime, toZonedDateTime } from '../utils/date'

const props = withDefaults(defineProps<CalendarProps>(), {
  fixedWeeks: true,
  yearControls: true
})
const modelValue = defineModel<any>()
const emits = defineEmits<CalendarEmits>()
defineSlots<CalendarSlots>()

const { code: locale, dir } = useLocale()

const baseRootProps = useForwardPropsEmits(reactivePick(props, 'disabled', 'readonly', 'fixedWeeks', 'initialFocus', 'isDateDisabled', 'isDateUnavailable', 'weekdayFormat'), emits)

const defaultCalendarValue = computed(() => {
  if (props.defaultValue) {
    return props.range ? toRangeZonedDateTime(props.defaultValue) : toZonedDateTime(props.defaultValue)
  }

  return undefined
})

const calendarValue = computed({
  get() {
    if (modelValue.value) {
      return props.range ? toRangeZonedDateTime(modelValue.value) : toZonedDateTime(modelValue.value)
    }

    return defaultCalendarValue.value
  },
  set(value) {
    if (!value) return

    if (props.range) {
      if (value.start && value.end) {
        modelValue.value = toRangeDate(value)
      }

      return
    }

    modelValue.value = value.toDate()
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

const Calendar = computed(() => props.range ? RangeCalendar : SingleCalendar)
</script>

<template>
  <Calendar.Root
    v-slot="{ weekDays, grid }"
    v-bind="baseRootProps"
    v-model="calendarValue"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
    :locale="locale"
    :dir="dir"
    :number-of-months="props.numberOfMonths"
    :week-starts-on="props.weekStartsOn"
    :min-value="minValue"
    :max-value="maxValue"
    :default-value="defaultCalendarValue"
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
