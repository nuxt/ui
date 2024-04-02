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
  'checkbox',
  'chip',
  'collapsible',
  'dropdown-menu',
  'form',
  'form-field',
  'input',
  'kbd',
  'link',
  'modal',
  'navigation-menu',
  'popover',
  'radio-group',
  'skeleton',
  'slideover',
  'switch',
  'tabs',
  'textarea',
  'tooltip'
]

function upperName (name: string) {
  return splitByCase(name).map(p => upperFirst(p)).join('')
}
</script>

<template>
  <UProvider>
    <div class="min-h-screen w-screen flex flex-col items-center justify-center overflow-y-auto">
      <UNavigationMenu :links="components.map(component => ({ label: upperName(component), to: `/${component}` }))" class="border-b border-gray-200 dark:border-gray-800 overflow-x-auto px-2" />

      <div class="flex-1 flex flex-col justify-center py-12">
        <NuxtPage />
      </div>
    </div>
  </UProvider>
</template>
