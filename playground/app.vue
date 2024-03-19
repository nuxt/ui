<script setup lang="ts">
import { splitByCase, upperFirst } from 'scule'

useHead({
  bodyAttrs: {
    class: 'antialiased font-sans text-gray-900 dark:text-white bg-white dark:bg-gray-900'
  }
})

const components = [
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
      <div class="flex gap-1.5 py-4">
        <ULink
          v-for="component in components"
          :key="component"
          :to="`/${component}`"
          active-class="text-primary-500 dark:text-primary-400 font-medium"
          class="capitalize text-sm"
        >
          {{ upperName(component) }}
        </ULink>
      </div>

      <div class="flex-1 flex flex-col justify-center">
        <NuxtPage />
      </div>
    </UContainer>
  </UProvider>
</template>
