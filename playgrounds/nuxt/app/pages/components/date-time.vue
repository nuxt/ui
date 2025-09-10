<script setup lang="ts">
import { FormatStringMap } from '../../../../../src/runtime/components/DateTime.vue'

const datetimes = [
  { label: 'Undefined value', value: undefined },
  { label: 'Date instance', value: new Date('2002-11-18T00:00:00.000Z') },
  { label: 'ISO Datetime string', value: '2002-11-18T00:00:00.000Z' },
  { label: 'RFC Datetime string', value: 'Sun, 18 Nov 2020 00:00:00 GMT' },
  { label: 'Date string', value: '2002-11-18' },
  { label: 'Milliseconds', value: 1037577600000 }
]

const datetime = ref(undefined)

type FormatValue = keyof typeof FormatStringMap | Intl.DateTimeFormatOptions

const formatItems = [
  { label: 'Default value', value: undefined },
  ...Object.entries(FormatStringMap).flatMap(([key, opts]) => ([
    { label: `${key} (string)`, value: key as keyof typeof FormatStringMap },
    { label: `${key} (object)`, value: opts as Intl.DateTimeFormatOptions }
  ]))
]

const format = ref<FormatValue | undefined>()

const ago = ref<boolean>(false)

const refresh = ref<boolean>(false)

const locales = [
  { label: 'Browser default', value: undefined },
  'en-us',
  'fr-fr',
  'es-es',
  'zh-cn'
]

const locale = ref<string | undefined>(undefined)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap gap-4">
      <div class="flex flex-col gap-4">
        <USelect v-model="datetime" :items="datetimes" placeholder="Date" class="w-72" />
        <USelect v-model="format" :items="formatItems" placeholder="Format" class="w-72" />
        <USelect v-model="locale" :items="locales" placeholder="Locale" class="w-72" />
      </div>
      <div class="flex flex-col gap-4">
        <UCheckbox v-model="ago" label="Relative time popup" />
        <UCheckbox v-model="refresh" label="Enable difference refresh" :disabled="!ago" />
      </div>
    </div>

    <div class="text-center py-8">
      <UDateTime
        :datetime="datetime"
        :format="format"
        :ago="ago"
        :locale="locale"
        :refresh="refresh"
      />
    </div>
  </div>
</template>
