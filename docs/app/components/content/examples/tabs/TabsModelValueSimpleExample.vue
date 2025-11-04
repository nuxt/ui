<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const items: TabsItem[] = [
  {
    label: 'Account',
    value: 'account'
  },
  {
    label: 'Password',
    value: 'password'
  }
]
</script>

<template>
  <UTabs defaultValue="account" :content="false" :items="items" class="w-full" />
</template>
