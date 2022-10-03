<template>
  <span v-if="isFetching" />
  <Iconify v-else-if="icon" :icon="icon" />
  <Component :is="component" v-else-if="component" />
  <span v-else>{{ name }}</span>
</template>

<script setup lang="ts">
import type { IconifyIcon } from '@iconify/vue'
import { Icon as Iconify } from '@iconify/vue/dist/offline'
import { loadIcon } from '@iconify/vue'
import { useNuxtApp, useState, computed, watch, onMounted } from '#imports'

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})
const nuxtApp = useNuxtApp()
const state = useState('u-icons', () => ({}))

const isFetching = computed(() => !!state.value?.[props.name]?.then)
const icon = computed<IconifyIcon | null>(() => !state.value?.[props.name] || state.value[props.name].then ? null : state.value[props.name])
const component = computed(() => nuxtApp.vueApp.component(props.name))

const loadIconComponent = (name: string) => {
  state.value = state.value || {}
  if (nuxtApp.vueApp.component(props.name) || state.value[name] || state.value[name] === null) { return }

  state.value[name] = loadIcon(name)
    .then((res) => { state.value[name] = res })
    // We won't try to load this icon again if it fails
    .catch(() => { state.value[name] = null })

  // return an awaitable promise
  return state.value[name]
}

onMounted(() => {
  watch(() => props.name, loadIconComponent, { immediate: true })
})

if (process.server) {
  await loadIconComponent(props.name)
}
</script>

<script lang="ts">
export default { name: 'UIcon' }
</script>
