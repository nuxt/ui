---
title: DatePicker
description: 'An example of a date picker component built with v-calendar.'
---

## Installation

This example is a composition of a [Popover](/components/popover) and [v-calendar](https://github.com/nathanreyes/v-calendar). We also use [date-fns](https://date-fns.org/) to format dates.

::callout{icon="i-heroicons-light-bulb"}
Note that you can use any calendar library you want.
::

Let's start by installing the `v-calendar` and `date-fns` dependency:

::code-group

```bash [pnpm]
pnpm add v-calendar@next date-fns
```

```bash [yarn]
yarn add v-calendar@next date-fns
```

```bash [npm]
npm install v-calendar@next date-fns
```

::

## Usage

You can create a `DatePicker.vue` component based on the `DatePicker` from `v-calendar`.

The following example is styled based on the `primary` and `gray` colors and supports the `dark` mode. It also supports a `v-model` or `v-model.range` depending on the type of date you want to use.

```vue [components/DatePicker.vue]
<script setup lang="ts">
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
// @ts-ignore
import type { DatePickerDate, DatePickerRangeObject } from 'v-calendar/dist/types/src/use/datePicker'
import 'v-calendar/dist/style.css'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: [Date, Object] as PropType<DatePickerDate | DatePickerRangeObject | null>,
    default: null
  }
})

const emit = defineEmits(['update:model-value', 'close'])

const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:model-value', value)
    emit('close')
  }
})

const attrs = {
  'transparent': true,
  'borderless': true,
  'color': 'primary',
  'is-dark': { selector: 'html', darkClass: 'dark' },
  'first-day-of-week': 2
}

function onDayClick(_: any, event: MouseEvent): void {
  const target = event.target as HTMLElement
  target.blur()
}
</script>

<template>
  <VCalendarDatePicker
    v-if="date && (date as DatePickerRangeObject)?.start && (date as DatePickerRangeObject)?.end"
    v-model.range="date"
    :columns="2"
    v-bind="{ ...attrs, ...$attrs }"
    @dayclick="onDayClick"
  />
  <VCalendarDatePicker
    v-else
    v-model="date"
    v-bind="{ ...attrs, ...$attrs }"
    @dayclick="onDayClick"
  />
</template>

<style>
:root {
  --vc-gray-50: rgb(var(--color-gray-50));
  --vc-gray-100: rgb(var(--color-gray-100));
  --vc-gray-200: rgb(var(--color-gray-200));
  --vc-gray-300: rgb(var(--color-gray-300));
  --vc-gray-400: rgb(var(--color-gray-400));
  --vc-gray-500: rgb(var(--color-gray-500));
  --vc-gray-600: rgb(var(--color-gray-600));
  --vc-gray-700: rgb(var(--color-gray-700));
  --vc-gray-800: rgb(var(--color-gray-800));
  --vc-gray-900: rgb(var(--color-gray-900));
}

.vc-primary {
  --vc-accent-50: rgb(var(--color-primary-50));
  --vc-accent-100: rgb(var(--color-primary-100));
  --vc-accent-200: rgb(var(--color-primary-200));
  --vc-accent-300: rgb(var(--color-primary-300));
  --vc-accent-400: rgb(var(--color-primary-400));
  --vc-accent-500: rgb(var(--color-primary-500));
  --vc-accent-600: rgb(var(--color-primary-600));
  --vc-accent-700: rgb(var(--color-primary-700));
  --vc-accent-800: rgb(var(--color-primary-800));
  --vc-accent-900: rgb(var(--color-primary-900));
}
</style>
```

## Examples

### DatePicker

:component-example{component="date-picker-example"}

### DateRangePicker

:component-example{component="date-picker-range-example"}
