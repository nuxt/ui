<script setup lang="ts">
import { splitByCase, upperFirst } from 'scule'

useHead({
  bodyAttrs: {
    class: 'antialiased font-sans text-gray-900 dark:text-white bg-white dark:bg-gray-900'
  }
})

const components = [
  'accordion',
  'avatar',
  'badge',
  'button',
  'card',
  'chip',
  'collapsible',
  'form',
  'form-field',
  'input',
  'kbd',
  'modal',
  'navigation-menu',
  'popover',
  'skeleton',
  'slideover',
  'tabs',
  'tooltip'
]

function upperName (name: string) {
  return splitByCase(name).map(p => upperFirst(p)).join('')
}
</script>

<template>
  <UProvider>
    <UContainer class="min-h-screen flex flex-col gap-4 items-center justify-center overflow-y-auto">
      <UNavigationMenu :links="components.map(component => ({ label: upperName(component), to: `/${component}` }))" class="border-b border-gray-200 dark:border-gray-800" />

      <div class="flex-1 flex flex-col justify-center pb-12">
        <NuxtPage />
      </div>
    </UContainer>
  </UProvider>
</template>
