<template>
  <span v-if="isFetching" />
  <Iconify v-else-if="icon" :icon="icon" />
  <Component :is="component" v-else-if="component" />
  <span v-else>{{ name }}</span>
</template>

<script setup lang="ts">
import type { IconifyIcon } from '@iconify/vue'
import { computed, ref, watch } from 'vue'
import { Icon as Iconify } from '@iconify/vue/dist/offline'
import { loadIcon } from '@iconify/vue'
import { useNuxtApp, useState } from '#imports'

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})
const nuxtApp = useNuxtApp()
const state = useState('u-icons', () => ({}))
const isFetching = ref(false)
const icon = computed<IconifyIcon | null>(() => state.value?.[props.name])
const component = computed(() => nuxtApp.vueApp.component(props.name))
const loadIconComponent = async () => {
  if (component.value) { return }
  if (!state.value?.[props.name]) {
    isFetching.value = true
    state.value[props.name] = await loadIcon(props.name).catch(() => null)
    isFetching.value = false
  }
}
watch(() => props.name, loadIconComponent)
!component.value && (await loadIconComponent())
</script>

<script lang="ts">
export default { name: 'UIcon' }
</script>
