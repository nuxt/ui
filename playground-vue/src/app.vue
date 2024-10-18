<script setup lang="ts">
import { splitByCase, upperFirst } from 'scule'
import { useRouter } from 'vue-router'

import appConfig from '../app.config'

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
  'carousel',
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

const items = components.map(component => ({ label: upperName(component), to: `/components/${component}` }))

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
    <div class="h-screen w-screen overflow-hidden flex min-h-0 bg-[var(--ui-bg)]" vaul-drawer-wrapper>
      <UNavigationMenu :items="items" orientation="vertical" class="border-r border-[var(--ui-border)] overflow-y-auto w-48 p-4" />

      <div class="flex-1 flex flex-col items-center justify-around overflow-y-auto w-full py-12 px-4">
        <Suspense>
          <RouterView />
        </Suspense>
      </div>
    </div>

    <UModal v-model:open="isCommandPaletteOpen" class="sm:h-96">
      <template #content>
        <UCommandPalette placeholder="Search a component..." :groups="[{ id: 'items', items }]" :fuse="{ resultLimit: 100 }" @update:model-value="onSelect" @update:open="value => isCommandPaletteOpen = value" />
      </template>
    </UModal>
  </UApp>
</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui";

@theme {
  --font-family-sans: 'Public Sans', sans-serif;

  --color-green-50: #EFFDF5;
  --color-green-100: #D9FBE8;
  --color-green-200: #B3F5D1;
  --color-green-300: #75EDAE;
  --color-green-400: #00DC82;
  --color-green-500: #00C16A;
  --color-green-600: #00A155;
  --color-green-700: #007F45;
  --color-green-800: #016538;
  --color-green-900: #0A5331;
  --color-green-950: #052E16;
}
</style>
