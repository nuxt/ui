<script setup lang="ts">
import { onUnmounted, onMounted, reactive } from 'vue'
import { pascalCase } from 'scule'
import { defineAsyncComponent, useRoute } from '#imports'
import { useColorMode } from '@vueuse/core'

const route = useRoute()
const component = route.query?.example
  ? defineAsyncComponent(() => import(`./examples/${route.query.example}.vue`))
  : route.params?.slug && defineAsyncComponent(() => import(`../../runtime/components/${pascalCase(route.params.slug as string)}.vue`))

const state = reactive<{ slots?: any, props?: any }>({})

function onUpdateRenderer(event: Event & { data?: any }) {
  state.props = { ...event.data.props }
  state.slots = { ...event.data.slots }
}

const mode = useColorMode()
function setColorMode(event: Event & { isDark?: boolean }) {
  mode.value = event.isDark ? 'dark' : 'light'
}

onMounted(() => {
  window.parent.addEventListener('nuxt-ui-devtools:update-renderer', onUpdateRenderer)
  window.parent.addEventListener('nuxt-ui-devtools:set-color-mode', setColorMode)
})

onUnmounted(() => {
  window.parent.removeEventListener('nuxt-ui-devtools:update-renderer', onUpdateRenderer)
  window.parent.removeEventListener('nuxt-ui-devtools:set-color-mode', setColorMode)
})

onMounted(async () => {
  const event: Event = new Event('nuxt-ui-devtools:component-loaded')
  window.parent.dispatchEvent(event)
})

onMounted(() => {
  if (!route.query?.example) return
})
</script>

<template>
  <div id="ui-devtools-renderer" class="nuxt-ui-component-renderer">
    <UApp :toaster="null">
      <component :is="component" v-if="component" v-bind="state.props" :class="state?.slots?.base" :ui="state.slots" />
    </UApp>
  </div>
</template>

<style>
.nuxt-ui-component-renderer {
  position: 'relative';
  height: 100vh;
  width: 100vw;

  padding: 32px;

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
