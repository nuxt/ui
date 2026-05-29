<script>
import { getWeekNumber } from "reka-ui/date";
import { getLocalTimeZone, today } from "@internationalized/date";
import theme from "#build/ui/calendar";
</script>

<script setup>
import { computed, ref, shallowRef, watch } from "vue";
import { useDateFormatter } from "reka-ui";
import {
  Calendar as SingleCalendar,
  MonthPicker,
  MonthRangePicker,
  RangeCalendar,
  YearPicker,
  YearRangePicker
} from "reka-ui/namespaced";
import { reactiveOmit } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useForwardProps } from "../composables/useForwardProps";
import { useLocale } from "../composables/useLocale";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
const _props = defineProps({
  as: { type: null, required: false },
  type: { type: String, required: false, default: "date" },
  view: { type: String, required: false },
  defaultView: { type: String, required: false },
  nextYearIcon: { type: null, required: false },
  nextYear: { type: Object, required: false },
  nextMonthIcon: { type: null, required: false },
  nextMonth: { type: Object, required: false },
  prevYearIcon: { type: null, required: false },
  prevYear: { type: Object, required: false },
  prevMonthIcon: { type: null, required: false },
  prevMonth: { type: Object, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  range: { type: Boolean, required: false },
  multiple: { type: Boolean, required: false },
  monthControls: { type: Boolean, required: false, default: true },
  yearControls: { type: Boolean, required: false, default: true },
  defaultValue: { type: null, required: false },
  modelValue: { type: null, required: false },
  weekNumbers: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  defaultPlaceholder: { type: Object, required: false },
  placeholder: { type: Object, required: false },
  allowNonContiguousRanges: { type: Boolean, required: false },
  pagedNavigation: { type: Boolean, required: false },
  preventDeselect: { type: Boolean, required: false },
  maximumDays: { type: Number, required: false },
  weekStartsOn: { type: Number, required: false },
  weekdayFormat: { type: String, required: false },
  fixedWeeks: { type: Boolean, required: false, default: true },
  maxValue: { type: Object, required: false },
  minValue: { type: Object, required: false },
  numberOfMonths: { type: Number, required: false },
  disabled: { type: Boolean, required: false },
  readonly: { type: Boolean, required: false },
  initialFocus: { type: Boolean, required: false },
  isDateDisabled: { type: Function, required: false },
  isDateUnavailable: { type: Function, required: false },
  isDateHighlightable: { type: Function, required: false },
  nextPage: { type: Function, required: false },
  prevPage: { type: Function, required: false },
  disableDaysOutsideCurrentView: { type: Boolean, required: false },
  fixedDate: { type: String, required: false }
});
const emits = defineEmits(["update:modelValue", "update:placeholder", "update:view", "update:validModelValue", "update:startValue"]);
defineSlots();
const { dir, t, code } = useLocale();
const appConfig = useAppConfig();
const props = useComponentProps("calendar", _props);
const formatter = shallowRef(useDateFormatter(code.value));
watch(() => code.value, (value) => {
  if (formatter.value.getLocale() !== value) {
    formatter.value.setLocale(value);
  }
});
function getDefaultView(type = props.type) {
  if (props.defaultView) {
    return props.defaultView;
  }
  if (type === "month") {
    return "month";
  }
  if (type === "year") {
    return "year";
  }
  return "day";
}
const internalView = ref(getDefaultView());
watch(() => [props.type, props.view], ([type, view2], [previousType]) => {
  if (view2 !== void 0) {
    internalView.value = view2;
    return;
  }
  if (type !== previousType) {
    internalView.value = getDefaultView(type);
  }
});
const view = computed({
  get() {
    if (props.type === "month") {
      return "month";
    }
    if (props.type === "year") {
      return "year";
    }
    return props.view ?? internalView.value;
  },
  set(value) {
    if (props.type !== "date") {
      return;
    }
    internalView.value = value;
    emits("update:view", value);
  }
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.calendar || {} })({
  color: props.color,
  size: props.size,
  variant: props.variant,
  weekNumbers: props.weekNumbers,
  type: view.value
}));
function resolveDateValue(value) {
  if (Array.isArray(value)) {
    return value[0];
  }
  if (!value) {
    return;
  }
  if (isDateRange(value)) {
    return value.start ?? value.end ?? void 0;
  }
  return value;
}
function isDateRange(value) {
  return "start" in value || "end" in value;
}
const localPlaceholder = shallowRef(props.placeholder);
watch(() => props.placeholder, (value) => {
  localPlaceholder.value = value;
});
const pickerPlaceholder = computed(() => {
  return localPlaceholder.value ?? resolveDateValue(props.modelValue) ?? resolveDateValue(props.defaultValue) ?? today(getLocalTimeZone());
});
function syncPlaceholder(value) {
  localPlaceholder.value = value;
}
function updatePlaceholder(value) {
  syncPlaceholder(value);
  emits("update:placeholder", value);
}
function setMonth(value) {
  updatePlaceholder(value);
}
function setYear(value, base = pickerPlaceholder.value) {
  updatePlaceholder(base.set({ year: value.year }));
}
function setView(value) {
  view.value = value;
}
function paginateYear(date, sign) {
  return sign === -1 ? date.subtract({ years: 1 }) : date.add({ years: 1 });
}
const dayRootProps = useForwardProps(
  reactiveOmit(props, "type", "view", "defaultView", "range", "modelValue", "defaultValue", "placeholder", "color", "variant", "size", "monthControls", "yearControls", "class", "ui"),
  emits
);
const calendarRootProps = computed(() => ({
  ...dayRootProps.value,
  "onUpdate:placeholder": updatePlaceholder
}));
const nextYearIcon = computed(() => props.nextYearIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronDoubleLeft : appConfig.ui.icons.chevronDoubleRight));
const nextMonthIcon = computed(() => props.nextMonthIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight));
const prevYearIcon = computed(() => props.prevYearIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronDoubleRight : appConfig.ui.icons.chevronDoubleLeft));
const prevMonthIcon = computed(() => props.prevMonthIcon || (dir.value === "rtl" ? appConfig.ui.icons.chevronRight : appConfig.ui.icons.chevronLeft));
const prevMonthLabel = computed(() => t("calendar.prevMonth"));
const nextMonthLabel = computed(() => t("calendar.nextMonth"));
const prevYearLabel = computed(() => t("calendar.prevYear"));
const nextYearLabel = computed(() => t("calendar.nextYear"));
const prevDecadeLabel = computed(() => t("calendar.prevDecade"));
const nextDecadeLabel = computed(() => t("calendar.nextDecade"));
const switchToMonthsLabel = computed(() => t("calendar.switchToMonths"));
const switchToYearsLabel = computed(() => t("calendar.switchToYears"));
function formatDatePart(date, options, fallback) {
  try {
    return formatter.value.custom(date.toDate(getLocalTimeZone()), options);
  } catch {
    return String(fallback);
  }
}
const formatMonthLabel = (date) => formatDatePart(date, { month: "long" }, date.month);
const formatYearLabel = (date) => formatDatePart(date, { year: "numeric" }, date.year);
function getHeadingLabel(date, value) {
  const formatted = value === "month" ? formatMonthLabel(date) : formatYearLabel(date);
  const actionLabel = value === "month" ? switchToMonthsLabel.value : switchToYearsLabel.value;
  return `${formatted}, ${actionLabel}`;
}
function getHeadingButtonClass(active) {
  return [
    "rounded-md px-2 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accented",
    active ? "cursor-default" : "cursor-pointer hover:bg-elevated/50"
  ];
}
function emitModelValue(value) {
  emits("update:modelValue", value);
}
const DayCalendar = computed(() => props.range ? RangeCalendar : SingleCalendar);
const isMonthView = computed(() => view.value === "month");
const isNavigationMonthView = computed(() => props.type === "date" && isMonthView.value);
const isNavigationYearView = computed(() => props.type === "date" && view.value === "year");
const isStandalonePicker = computed(() => props.type !== "date");
const showMonthNavigation = computed(() => props.type === "date" && view.value === "day" && props.monthControls);
function onMonthUpdate(value) {
  if (isNavigationMonthView.value) {
    const nextValue = resolveDateValue(value) ?? pickerPlaceholder.value;
    setMonth(nextValue);
    setView("day");
    return;
  }
  emitModelValue(value);
}
function onYearUpdate(value) {
  if (isNavigationYearView.value) {
    const nextValue = resolveDateValue(value) ?? pickerPlaceholder.value;
    setYear(nextValue, pickerPlaceholder.value);
    setView("month");
    return;
  }
  emitModelValue(value);
}
function createPickerConfig(kind) {
  const ns = kind === "month" ? { single: MonthPicker, range: MonthRangePicker } : { single: YearPicker, range: YearRangePicker };
  const source = props.range ? ns.range : ns.single;
  return {
    kind,
    root: source.Root,
    header: source.Header,
    heading: source.Heading,
    grid: source.Grid,
    gridBody: source.GridBody,
    gridRow: source.GridRow,
    cell: source.Cell,
    cellTrigger: source.CellTrigger,
    prev: source.Prev,
    next: source.Next,
    slotName: `${kind}-cell`,
    itemProp: kind,
    labelProp: `${kind}Value`,
    previousLabel: kind === "month" ? prevYearLabel.value : prevDecadeLabel.value,
    nextLabel: kind === "month" ? nextYearLabel.value : nextDecadeLabel.value,
    onUpdate: kind === "month" ? onMonthUpdate : onYearUpdate
  };
}
const monthPicker = computed(() => createPickerConfig("month"));
const yearPicker = computed(() => createPickerConfig("year"));
const picker = computed(() => isMonthView.value ? monthPicker.value : yearPicker.value);
const pickerSlotNames = computed(() => {
  if (picker.value.kind === "month") {
    return {
      grid: "monthGrid",
      row: "monthGridRow",
      cell: "monthCell",
      trigger: "monthCellTrigger"
    };
  }
  return {
    grid: "yearGrid",
    row: "yearGridRow",
    cell: "yearCell",
    trigger: "yearCellTrigger"
  };
});
const pickerDefaultValue = computed(() => props.defaultValue);
const pickerModelValue = computed(() => props.modelValue);
const pickerValueProps = computed(() => isStandalonePicker.value ? {
  modelValue: pickerModelValue.value,
  defaultValue: pickerDefaultValue.value
} : {});
const pickerRootProps = computed(() => ({
  ...calendarRootProps.value,
  ...pickerValueProps.value,
  "placeholder": pickerPlaceholder.value,
  "locale": code.value,
  "dir": dir.value,
  "onUpdate:modelValue": picker.value.onUpdate,
  "onUpdate:placeholder": onPickerPlaceholderUpdate
}));
function onPickerPlaceholderUpdate(value) {
  if (isStandalonePicker.value) {
    updatePlaceholder(value);
    return;
  }
  syncPlaceholder(value);
}
</script>

<template>
  <DayCalendar.Root
    v-if="view === 'day'"
    v-slot="{ weekDays, grid, date }"
    v-bind="calendarRootProps"
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    :placeholder="localPlaceholder"
    :locale="code"
    :dir="dir"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <DayCalendar.Header data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <DayCalendar.Prev v-if="props.yearControls" :prev-page="(value) => paginateYear(value, -1)" :aria-label="prevYearLabel" as-child>
        <UButton :icon="prevYearIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.prevYear" />
      </DayCalendar.Prev>
      <DayCalendar.Prev v-if="showMonthNavigation" :aria-label="prevMonthLabel" as-child>
        <UButton :icon="prevMonthIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.prevMonth" />
      </DayCalendar.Prev>
      <DayCalendar.Heading v-slot="{ headingValue }" data-slot="heading" :class="ui.heading({ class: props.ui?.heading })">
        <slot
          name="heading"
          :value="headingValue"
          :date="date"
          :view="view"
          :set-month="setMonth"
          :set-year="(value) => setYear(value, date)"
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
      <DayCalendar.Next v-if="props.yearControls" :next-page="(value) => paginateYear(value, 1)" :aria-label="nextYearLabel" as-child>
        <UButton :icon="nextYearIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.nextYear" />
      </DayCalendar.Next>
    </DayCalendar.Header>
    <div data-slot="body" :class="ui.body({ class: props.ui?.body })">
      <DayCalendar.Grid
        v-for="month in grid"
        :key="month.value.toString()"
        data-slot="grid"
        :class="ui.grid({ class: props.ui?.grid })"
      >
        <DayCalendar.GridHead>
          <DayCalendar.GridRow data-slot="gridWeekDaysRow" :class="ui.gridWeekDaysRow({ class: props.ui?.gridWeekDaysRow })">
            <DayCalendar.HeadCell
              v-for="day in weekDays"
              :key="day"
              data-slot="headCell"
              :class="ui.headCell({ class: props.ui?.headCell })"
            >
              <slot name="week-day" :day="day">
                {{ day }}
              </slot>
            </DayCalendar.HeadCell>
          </DayCalendar.GridRow>
        </DayCalendar.GridHead>
        <DayCalendar.GridBody data-slot="gridBody" :class="ui.gridBody({ class: props.ui?.gridBody })">
          <DayCalendar.GridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            data-slot="gridRow"
            :class="ui.gridRow({ class: props.ui?.gridRow })"
          >
            <td
              v-if="props.weekNumbers && weekDates[0]"
              role="gridcell"
              data-slot="cellWeek"
              :class="ui.cellWeek({ class: props.ui?.cellWeek })"
            >
              {{ getWeekNumber(weekDates[0], code) }}
            </td>
            <DayCalendar.Cell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              data-slot="cell"
              :class="ui.cell({ class: props.ui?.cell })"
            >
              <DayCalendar.CellTrigger
                :day="weekDate"
                :month="month.value"
                data-slot="cellTrigger"
                :class="ui.cellTrigger({ class: props.ui?.cellTrigger })"
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
    v-bind="pickerRootProps"
    data-slot="root"
    :class="ui.root({ class: ['inline-flex w-fit flex-col gap-4', props.ui?.root, props.class] })"
  >
    <component
      :is="picker.header"
      data-slot="header"
      :class="ui.header({ class: ['grid w-full grid-cols-[auto_1fr_1fr_auto] items-center gap-1', props.ui?.header] })"
    >
      <component :is="picker.prev" v-if="props.yearControls" :aria-label="picker.previousLabel" as-child>
        <UButton :icon="prevYearIcon" :size="props.size" color="neutral" variant="ghost" v-bind="props.prevYear" />
      </component>
      <component
        :is="picker.heading"
        v-slot="{ headingValue }"
        data-slot="heading"
        :class="ui.heading({ class: ['col-span-2 overflow-visible whitespace-nowrap text-center', props.ui?.heading] })"
      >
        <slot
          name="heading"
          :value="headingValue"
          :date="date"
          :view="view"
          :set-month="setMonth"
          :set-year="(value) => setYear(value, date)"
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
      :data-slot="pickerSlotNames.grid"
      :class="ui.grid({ class: props.ui?.grid })"
    >
      <component :is="picker.gridBody" as="div">
        <component
          :is="picker.gridRow"
          v-for="(row, rowIndex) in grid.rows"
          :key="rowIndex"
          as="div"
          :data-slot="pickerSlotNames.row"
          :class="ui.gridRow({ class: props.ui?.gridRow })"
        >
          <component
            :is="picker.cell"
            v-for="cellDate in row"
            :key="cellDate.toString()"
            as="div"
            :date="cellDate"
            :data-slot="pickerSlotNames.cell"
            :class="ui.cell({ class: props.ui?.cell })"
          >
            <component
              :is="picker.cellTrigger"
              v-slot="slotProps"
              v-bind="{ [picker.itemProp]: cellDate }"
              :data-slot="pickerSlotNames.trigger"
              :class="ui.cellTrigger({ class: props.ui?.cellTrigger })"
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
