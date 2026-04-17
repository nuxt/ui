<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const items: DropdownMenuItem[] = [{
  label: 'Leanne Graham',
  description: 'Sincere@april.biz'
}, {
  label: 'Ervin Howell',
  description: 'Shanna@melissa.tv'
}, {
  label: 'Clementine Bauch',
  description: 'Nathan@yesenia.net'
}, {
  label: 'Patricia Lebsack',
  description: 'Julianne.OConner@kory.org'
}, {
  label: 'Chelsey Dietrich',
  description: 'Lucio_Hettinger@annie.me'
}]
</script>

<template>
  <UDropdownMenu
    :items="items"
    filter
    :filter-fields="['label', 'description']"
    :content="{ align: 'start' }"
    :ui="{ content: 'w-64' }"
  >
    <UButton label="Open" color="neutral" variant="outline" icon="i-lucide-menu" />
  </UDropdownMenu>
</template>
