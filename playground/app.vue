<script setup lang="ts">
import { splitByCase, upperFirst } from 'scule'

useHead({
  bodyAttrs: {
    class: 'antialiased font-sans text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900'
  }
})

const appConfig = useAppConfig()

const components = [
  'accordion',
  'alert',
  'avatar',
  'badge',
  'breadcrumb',
  'button',
  'card',
  'checkbox',
  'chip',
  'collapsible',
  'drawer',
  'dropdown-menu',
  'form',
  'form-field',
  'input',
  'kbd',
  'link',
  'modal',
  'navigation-menu',
  'pagination',
  'popover',
  'radio-group',
  'separator',
  'shortcuts',
  'skeleton',
  'slideover',
  'slider',
  'switch',
  'tabs',
  'textarea',
  'toast',
  'tooltip'
]

function upperName(name: string) {
  return splitByCase(name).map(p => upperFirst(p)).join('')
}
</script>

<template>
  <UApp :toaster="appConfig.toaster">
    <div class="min-h-screen w-screen overflow-hidden flex flex-col items-center justify-center overflow-y-auto bg-white dark:bg-gray-900" vaul-drawer-wrapper>
      <UNavigationMenu :items="components.map(component => ({ label: upperName(component), to: `/${component}` }))" class="border-b border-gray-200 dark:border-gray-800 overflow-x-auto px-2" />

      <div class="flex-1 flex flex-col items-center justify-center w-full py-12 px-4">
        <NuxtPage />
      </div>
    </div>
  </UApp>
</template>
