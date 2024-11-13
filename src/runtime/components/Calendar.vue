<script lang="ts">
import { computed } from 'vue'
import { tv, type VariantProps } from 'tailwind-variants'
import type { CalendarRootProps, CalendarRootEmits, CalendarCellTriggerProps, DateRange } from 'radix-vue'
import type { DateValue } from '@internationalized/date'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/calendar'

const appConfig = _appConfig as AppConfig & { ui: { calendar: Partial<typeof theme> } }

const calendar = tv({ extend: tv(theme), ...(appConfig.ui?.calendar || {}) })

type CalendarVariants = VariantProps<typeof calendar>

interface BaseCalendarProps extends Pick<CalendarRootProps, 'weekStartsOn' | 'weekdayFormat' | 'fixedWeeks' | 'maxValue' | 'minValue' | 'numberOfMonths' | 'disabled' | 'readonly' | 'initialFocus' | 'isDateDisabled' | 'isDateUnavailable' | 'dir'> {
  color?: CalendarVariants['color']
  size?: CalendarVariants['size']
  class?: any
  ui?: Partial<typeof calendar.slots>
  /**
   * The locale to use for formatting and parsing numbers.
   * @defaultValue UApp.locale.code
   */
  locale?: string
  range: boolean
}

export interface CalendarSingleProps extends BaseCalendarProps {
  modelValue?: DateValue
  defaultValue?: DateValue
  range: false
}

export interface CalendarRangeProps extends BaseCalendarProps {
  modelValue?: DateRange
  defaultValue?: DateRange
  range: true
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps

export interface CalendarEmits extends CalendarRootEmits {}

export interface CalendarSlots {
  'heading': (props: { value: string }) => any
  'day': (props: Pick<CalendarCellTriggerProps, 'day'>) => any
  'week-day': (props: { day: string }) => any
}
</script>

<script setup lang="ts">
import {
  useForwardPropsEmits, CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading, CalendarNext, CalendarPrev, CalendarRoot,
  RangeCalendarCell, RangeCalendarCellTrigger, RangeCalendarGrid, RangeCalendarGridBody, RangeCalendarGridHead, RangeCalendarGridRow, RangeCalendarHeadCell, RangeCalendarHeader, RangeCalendarHeading, RangeCalendarNext, RangeCalendarPrev, RangeCalendarRoot
} from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import UButton from './Button.vue'
import { useLocale } from '../composables/useLocale'
import type { Direction } from '../types'

const props = withDefaults(defineProps<CalendarProps>(), {
  range: false,
  fixedWeeks: true
})
const emits = defineEmits<CalendarEmits>()
defineSlots<CalendarSlots>()

const { code: codeLocale, dir: dirLocale } = useLocale()
const locale = computed(() => props.locale || codeLocale.value)
const dir = computed(() => (props.dir || dirLocale.value) as Direction)

const baseRootProps = useForwardPropsEmits(reactivePick(props, 'modelValue', 'defaultValue', 'disabled', 'readonly', 'fixedWeeks', 'initialFocus', 'isDateDisabled', 'isDateUnavailable', 'maxValue', 'minValue', 'numberOfMonths', 'weekdayFormat', 'weekStartsOn'), emits)

const ui = computed(() => calendar({
  color: props.color,
  size: props.size
}))
</script>

<template>
  <RangeCalendarRoot
    v-if="props.range"
    v-slot="{ weekDays, grid }"
    v-bind="baseRootProps"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
    :locale="locale"
    :dir="dir"
  >
    <RangeCalendarHeader :class="ui.header({ class: props.ui?.header })">
      <RangeCalendarPrev as-child>
        <UButton :icon="appConfig.ui.icons.chevronLeft" :size="props.size" color="neutral" variant="ghost" />
      </RangeCalendarPrev>
      <RangeCalendarHeading v-slot="{ headingValue }" :class="ui.heading({ class: props.ui?.heading })">
        <slot name="heading" :value="headingValue">
          {{ headingValue }}
        </slot>
      </RangeCalendarHeading>
      <RangeCalendarNext as-child>
        <UButton :icon="appConfig.ui.icons.chevronRight" :size="props.size" color="neutral" variant="ghost" />
      </RangeCalendarNext>
    </RangeCalendarHeader>
    <div :class="ui.body({ class: props.ui?.body })">
      <RangeCalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        :class="ui.grid({ class: props.ui?.grid })"
      >
        <RangeCalendarGridHead>
          <RangeCalendarGridRow :class="ui.gridWeekDaysRow({ class: props.ui?.gridWeekDaysRow })">
            <RangeCalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              :class="ui.headCell({ class: props.ui?.headCell })"
            >
              <slot name="week-day" :day="day">
                {{ day }}
              </slot>
            </RangeCalendarHeadCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridHead>
        <RangeCalendarGridBody :class="ui.gridBody({ class: props.ui?.gridBody })">
          <RangeCalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            :class="ui.gridRow({ class: props.ui?.gridRow })"
          >
            <RangeCalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              :class="ui.cell({ class: props.ui?.cell })"
            >
              <RangeCalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                :class="ui.cellTrigger({ class: props.ui?.cellTrigger })"
              >
                <slot name="day" :day="weekDate">
                  {{ weekDate.day }}
                </slot>
              </RangeCalendarCellTrigger>
            </RangeCalendarCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridBody>
      </RangeCalendarGrid>
    </div>
  </RangeCalendarRoot>
  <CalendarRoot
    v-else
    v-slot="{ weekDays, grid }"
    v-bind="baseRootProps"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
    :locale="locale"
    :dir="dir"
  >
    <CalendarHeader :class="ui.header({ class: props.ui?.header })">
      <CalendarPrev as-child>
        <UButton :icon="appConfig.ui.icons.chevronLeft" :size="props.size" color="neutral" variant="ghost" />
      </CalendarPrev>
      <CalendarHeading v-slot="{ headingValue }" :class="ui.heading({ class: props.ui?.heading })">
        <slot name="heading" :value="headingValue">
          {{ headingValue }}
        </slot>
      </CalendarHeading>
      <CalendarNext as-child>
        <UButton :icon="appConfig.ui.icons.chevronRight" :size="props.size" color="neutral" variant="ghost" />
      </CalendarNext>
    </CalendarHeader>
    <div :class="ui.body({ class: props.ui?.body })">
      <CalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        :class="ui.grid({ class: props.ui?.grid })"
      >
        <CalendarGridHead>
          <CalendarGridRow :class="ui.gridWeekDaysRow({ class: props.ui?.gridWeekDaysRow })">
            <CalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              :class="ui.headCell({ class: props.ui?.headCell })"
            >
              <slot name="week-day" :day="day">
                {{ day }}
              </slot>
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody :class="ui.gridBody({ class: props.ui?.gridBody })">
          <CalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            :class="ui.gridRow({ class: props.ui?.gridRow })"
          >
            <CalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              :class="ui.cell({ class: props.ui?.cell })"
            >
              <CalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                :class="ui.cellTrigger({ class: props.ui?.cellTrigger })"
              >
                <slot name="day" :day="weekDate">
                  {{ weekDate.day }}
                </slot>
              </CalendarCellTrigger>
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>
