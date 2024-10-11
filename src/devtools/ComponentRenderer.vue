<script setup lang="ts">
import { onUnmounted, onMounted, reactive, defineAsyncComponent } from 'vue'
import { pascalCase } from 'scule'
import { useColorMode } from '#imports'

const props = defineProps<{
  slug: string
}>()

const component = props.slug && defineAsyncComponent(() => import(`../runtime/components/${pascalCase(props.slug)}.vue`))
const state = reactive<{ slots?: any, props?: any }>({})

function onUpdateRenderer(event: Event & { data?: any }) {
  state.props = { ...event.data.props }
  state.slots = { ...event.data.slots }
}

const colorMode = useColorMode()
function setColorMode(event: Event & { isDark?: boolean }) {
  colorMode.preference = event.isDark ? 'dark' : 'light'
}

onMounted(() => {
  window.parent.addEventListener('nuxt-ui-devtools:update-renderer', onUpdateRenderer)
  window.parent.addEventListener('nuxt-ui-devtools:set-color-mode', setColorMode)
})

onUnmounted(() => {
  window.parent.removeEventListener('nuxt-ui-devtools:update-renderer', onUpdateRenderer)
  window.parent.removeEventListener('nuxt-ui-devtools:set-color-mode', setColorMode)
})

onMounted(() => {
  const event: Event & { data?: any } = new Event('nuxt-ui-devtools:component-loaded')
  event.data = props.slug
  window.parent.dispatchEvent(event)
})
</script>

<template>
  <div class="nuxt-ui-component-renderer h-screen w-screen p-8">
    <component :is="component" v-if="component && state.props" v-bind="state.props" :class="state?.slots?.base" :ui="state.slots" />
  </div>
</template>

<style>
.nuxt-ui-component-renderer {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' transform='scale(3)'%3E%3Crect width='100%25' height='100%25' fill='%23fff'/%3E%3Cpath fill='none' stroke='hsla(0, 0%25, 98%25, 1)' stroke-width='.2' d='M10 0v20ZM0 10h20Z'/%3E%3C/svg%3E");
  background-size: 40px 40px;
}

.dark .nuxt-ui-component-renderer {
background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' transform='scale(3)'%3E%3Crect width='100%25' height='100%25' fill='hsl(0, 0%25, 8.5%25)'/%3E%3Cpath fill='none' stroke='hsl(0, 0%25, 11.0%25)' stroke-width='.2' d='M10 0v20ZM0 10h20Z'/%3E%3C/svg%3E");
  background-size: 40px 40px;
}
</style>
