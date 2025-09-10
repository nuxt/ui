<script setup lang="ts">
const datetimes = [
  { label: 'Undefined value', value: undefined },
  { label: 'Date instance', value: 0 },
  { label: 'ISO Datetime string', value: '2002-11-18T00:00:00.000Z' },
  { label: 'RFC Datetime string', value: 'Sun, 18 Nov 2020 00:00:00 GMT' },
  { label: 'Date string', value: '2002-11-18' },
  { label: 'Milliseconds', value: 1037577600000 }
]

const datetime = ref()

const realDatetime = computed(() => datetime.value === 0 ? Date.now() : datetime.value)

const refresh = ref(true)

const locales = [
  { label: 'Browser default', value: undefined },
  'en-us',
  'fr-fr',
  'es-es',
  'zh-cn'
]

const locale = ref()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap gap-4">
      <div class="flex flex-col gap-4">
        <USelect v-model="datetime" :items="datetimes" placeholder="Date" class="w-72" />
        <USelect v-model="locale" :items="locales" placeholder="Locale" class="w-72" />
      </div>
      <div class="flex flex-col gap-4">
        <UCheckbox v-model="refresh" label="Enable difference refresh" />
      </div>
    </div>

    <div class="text-center py-8">
      <UAgo :datetime="realDatetime" :locale="locale" :refresh="refresh" />
    </div>
  </div>
</template>
