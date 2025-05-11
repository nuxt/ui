<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const route = useRoute()
const router = useRouter()

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

const active = computed({
  get() {
    return (route.query.tab as string) || 'account'
  },
  set(tab) {
    // Hash is specified here to prevent the page from scrolling to the top
    router.push({
      path: '/components/tabs',
      query: { tab },
      hash: '#control-active-item'
    })
  }
})
</script>

<template>
  <UTabs v-model="active" :content="false" :items="items" class="w-full" />
</template>
