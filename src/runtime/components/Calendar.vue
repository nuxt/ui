<script lang="ts">
import { computed } from 'vue'
import { tv, type VariantProps } from 'tailwind-variants'
import type { CalendarRootProps, CalendarRootEmits, CalendarCellTriggerProps } from 'radix-vue'
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
  modelValue?: [DateValue, DateValue]
  defaultValue?: [DateValue, DateValue]
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
import { useForwardPropsEmits, CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading, CalendarNext, CalendarPrev, CalendarRoot } from 'radix-vue'
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

const rootProps = useForwardPropsEmits(reactivePick(props, 'defaultValue', 'modelValue', 'disabled', 'readonly', 'fixedWeeks', 'initialFocus', 'isDateDisabled', 'isDateUnavailable', 'maxValue', 'minValue', 'numberOfMonths', 'weekdayFormat', 'weekStartsOn'), emits)

const ui = computed(() => calendar({
  color: props.color,
  size: props.size
}))
</script>

<template>
  <div v-if="props.range">
    todo
  </div>
  <CalendarRoot
    v-else
    v-bind="rootProps"
    v-slot="{ weekDays, grid }"
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
