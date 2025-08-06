<script setup lang="ts">
import * as locales from '@nuxt/ui-pro/locale'

const locale = ref('en')
</script>

<template>
  <ULocaleSelect v-model="locale" :locales="Object.values(locales)" class="w-48" />
</template>
