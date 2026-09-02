<template>
  <UTabs
    v-if="hasPro"
    :model-value="selected"
    :items="items"
    :content="false"
    :ui="{ list: { height: 'h-8', tab: { height: 'h-6' } } }"
    class="w-full"
    @change="onChange"
  />
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const route = useRoute()
const router = useRouter()

const nav = inject<Ref<NavItem[]>>('navigation', ref([]))

const hasPro = computed(() => nav.value.some(item => item._path === '/pro'))

const items = [{
  label: 'UI',
  icon: 'i-heroicons-cube'
}, {
  label: 'UI Pro',
  icon: 'i-heroicons-square-3-stack-3d'
}]

const selected = computed(() => route.path.startsWith('/pro') ? 1 : 0)

function onChange(index: number) {
  router.push(index === 1 ? '/pro/getting-started' : '/getting-started')
}
</script>
