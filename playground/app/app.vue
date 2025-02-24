<script setup lang="ts">
import { splitByCase, upperFirst } from 'scule'
import { useColorMode } from '#imports'

const router = useRouter()
const appConfig = useAppConfig()
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const components = [
  'accordion',
  'alert',
  'avatar',
  'badge',
  'breadcrumb',
  'button',
  'button-group',
  'card',
  'calendar',
  'carousel',
  'checkbox',
  'chip',
  'collapsible',
  'color-picker',
  'context-menu',
  'command-palette',
  'drawer',
  'dropdown-menu',
  'form',
  'form-field',
  'input',
  'input-menu',
  'input-number',
  'kbd',
  'link',
  'modal',
  'navigation-menu',
  'pagination',
  'pin-input',
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
  'stepper',
  'switch',
  'tabs',
  'table',
  'textarea',
  'toast',
  'tooltip',
  'tree'
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
  <template v-if="!$route.path.startsWith('/__nuxt_ui__')">
    <UApp :toaster="appConfig.toaster">
      <div class="h-screen w-screen overflow-hidden flex flex-col lg:flex-row min-h-0 bg-(--ui-bg)" vaul-drawer-wrapper>
        <UNavigationMenu :items="items" orientation="vertical" class="hidden lg:flex border-e border-(--ui-border) overflow-y-auto w-48 p-4" />
        <UNavigationMenu :items="items" orientation="horizontal" class="lg:hidden border-b border-(--ui-border) [&>div]:min-w-min overflow-x-auto" />

        <div class="fixed top-15 lg:top-3 right-4 flex items-center gap-2">
          <ClientOnly v-if="!colorMode?.forced">
            <UButton
              :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
              color="neutral"
              variant="ghost"
              :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
              @click="isDark = !isDark"
            />

            <template #fallback>
              <div class="size-8" />
            </template>
          </ClientOnly>
        </div>

        <div class="flex-1 flex flex-col items-center justify-around overflow-y-auto w-full py-14 px-4">
          <NuxtPage />
        </div>

        <UModal v-model:open="isCommandPaletteOpen" class="sm:h-96">
          <template #content>
            <UCommandPalette placeholder="Search a component..." :groups="[{ id: 'items', items }]" :fuse="{ resultLimit: 100 }" @update:model-value="onSelect" @update:open="value => isCommandPaletteOpen = value" />
          </template>
        </UModal>
      </div>
    </UApp>
  </template>
  <template v-else>
    <NuxtPage />
  </template>
</template>
