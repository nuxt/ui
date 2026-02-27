<script setup lang="ts">
import { upperFirst, camelCase } from 'scule'

const route = useRoute()
const colorMode = useColorMode()
const appConfig = useAppConfig()

const name = route.params.slug?.[0]

const exampleModules = import.meta.glob('~/components/content/examples/**/*.vue')
const exampleMatch = Object.entries(exampleModules).find(([path]) => path.endsWith(`/${upperFirst(camelCase(name || ''))}.vue`))
const resolvedComponent = exampleMatch ? defineAsyncComponent(exampleMatch[1] as any) : undefined

if (route.query.theme) {
  colorMode.preference = route.query.theme === 'light' ? 'light' : 'dark'
}
if (route.query.neutral) {
  appConfig.ui.colors.neutral = route.query.neutral as string
}
if (route.query.primary) {
  appConfig.ui.colors.primary = route.query.primary as string
}

const width = computed(() => route.query.width && Number.parseInt(route.query.width as string) > 0 ? `${Number.parseInt(route.query.width as string) - 2}px` : '864px')
</script>

<template>
  <div class="example flex flex-col items-center h-screen">
    <component :is="resolvedComponent" v-if="resolvedComponent" v-bind="route.query" />
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .example {
    --ui-container: v-bind(width);
  }
}
</style>
