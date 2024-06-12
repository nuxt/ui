<script setup lang="ts">
import { splitByCase, upperFirst } from 'scule'

const appConfig = useAppConfig()
const router = useRouter()

const components = [
  'accordion',
  'alert',
  'avatar',
  'badge',
  'breadcrumb',
  'button',
  'button-group',
  'card',
  'checkbox',
  'chip',
  'collapsible',
  'context-menu',
  'command-palette',
  'drawer',
  'dropdown-menu',
  'form',
  'form-field',
  'input',
  'input-menu',
  'kbd',
  'link',
  'modal',
  'navigation-menu',
  'pagination',
  'popover',
  'progress',
  'radio-group',
  'select',
  'select-menu',
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

const items = components.map(component => ({ label: upperName(component), to: `/${component}` }))

function upperName(name: string) {
  return splitByCase(name).map(p => upperFirst(p)).join('')
}

const isCommandPaletteOpen = ref(false)

function onSelect(item: any) {
  router.push(item.to)
}

defineShortcuts({
  meta_k: () => isCommandPaletteOpen.value = true
})
</script>

<template>
  <UApp :toaster="appConfig.toaster">
    <div class="h-screen w-screen overflow-hidden flex min-h-0 bg-white dark:bg-gray-900" vaul-drawer-wrapper>
      <UNavigationMenu :items="items" orientation="vertical" class="border-r border-gray-200 dark:border-gray-800 overflow-y-auto w-48 p-4" />

      <div class="flex-1 flex flex-col items-center justify-around overflow-y-auto w-full py-12 px-4">
        <NuxtPage />
      </div>
    </div>

    <UModal v-model:open="isCommandPaletteOpen" class="sm:h-96">
      <template #content>
        <UCommandPalette placeholder="Search a component..." :groups="[{ id: 'items', items }]" :fuse="{ resultLimit: 100 }" @update:model-value="onSelect" @update:open="value => isCommandPaletteOpen = value" />
      </template>
    </UModal>
  </UApp>
</template>
