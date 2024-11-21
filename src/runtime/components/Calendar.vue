<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { CalendarRootProps, RangeCalendarRootProps, CalendarCellTriggerProps, CalendarRootEmits, RangeCalendarRootEmits } from 'radix-vue'
import type { DateValue } from '@internationalized/date'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/calendar'

const appConfig = _appConfig as AppConfig & { ui: { calendar: Partial<typeof theme> } }

const calendar = tv({ extend: tv(theme), ...(appConfig.ui?.calendar || {}) })

type CalendarVariants = VariantProps<typeof calendar>

export type ModelValue<T extends boolean> = (T extends true ? RangeCalendarRootProps['modelValue'] : CalendarRootProps['modelValue']) | undefined

export interface CalendarProps<T extends boolean> extends Omit<CalendarRootProps & RangeCalendarRootProps, 'modelValue' | 'defaultValue' | 'dir' | 'locale'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
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
  defaultValue?: ModelValue<T>
  class?: any
  ui?: Partial<typeof calendar.slots>
}

export interface CalendarEmits extends Omit<CalendarRootEmits & RangeCalendarRootEmits, 'update:modelValue'> {}

export interface CalendarSlots {
  'heading': (props: { value: string }) => any
  'day': (props: Pick<CalendarCellTriggerProps, 'day'>) => any
  'week-day': (props: { day: string }) => any
}
</script>

<script setup lang="ts" generic="T extends boolean = false">
import { toRef, computed } from 'vue'
import { useForwardProps, useEmitAsProps } from 'radix-vue'
import { Calendar as SingleCalendar, RangeCalendar } from 'radix-vue/namespaced'
import { objectOmit, reactiveOmit } from '@vueuse/core'
import UButton from './Button.vue'
import { useLocale } from '../composables/useLocale'

const props = withDefaults(defineProps<CalendarProps<T>>(), {
  fixedWeeks: true,
  yearControls: true
})
const emits = defineEmits<CalendarEmits>()
defineSlots<CalendarSlots>()

const modelValue = defineModel<ModelValue<T>>(undefined)
// This is a hack due to generic boolean casting (see https://github.com/nuxt/ui/issues/2541)
const range = toRef(() => typeof props.range === 'string' ? true : props.range)

const { code: locale, dir, t } = useLocale()

const parsedProps = useForwardProps(reactiveOmit(props, 'color', 'size', 'range', 'yearControls', 'class', 'ui', 'modelValue' as any))
const emitsAsProps = objectOmit(useEmitAsProps(emits), ['update:modelValue'])
const rootProps = computed(() => ({ ...parsedProps.value, ...emitsAsProps }))

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

const Calendar = computed(() => range.value ? RangeCalendar : SingleCalendar)
</script>

<template>
  <Calendar.Root
    v-slot="{ weekDays, grid }"
    v-model="modelValue as ModelValue<true & false>"
    v-bind="rootProps"
    :locale="locale"
    :dir="dir"
    :default-value="defaultValue as ModelValue<true & false>"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
  >
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
  </Calendar.Root>
</template>
