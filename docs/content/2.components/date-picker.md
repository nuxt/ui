---
title: DatePicker
description: 'A date picker component built with v-calendar.'
---

Here is an example of a date picker component built with [v-calendar](https://github.com/nathanreyes/v-calendar).

```vue [components/DatePicker.vue]
<script setup lang="ts">
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'

const props = defineProps({
  modelValue: {
    type: Date,
    default: null
  }
})

const emit = defineEmits(['update:model-value', 'close'])

const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:model-value', value)
    emit('close')
  }
})

const attrs = [{
  key: 'today',
  highlight: {
    color: 'blue',
    fillMode: 'outline',
    class: '!bg-gray-100 dark:!bg-gray-800'
  },
  dates: new Date()
}]
</script>

<template>
  <VCalendarDatePicker
    v-model="date"
    transparent
    borderless
    :attributes="attrs"
    :is-dark="isDark"
    title-position="left"
    trim-weeks
    :first-day-of-week="2"
  />
</template>
```

You can use it inside a [Popover](/components/popover) component to display it when clicking on a [Button](/components/button).

:component-example{component="date-picker-example"}
