<script setup lang="ts">
import { onDevtoolsClientConnected } from '@nuxt/devtools-kit/iframe-client'
import type { ClientFunctions, ServerFunctions, Component } from '../../src/devtools/rpc'
import type { BirpcReturn } from 'birpc'
import { watchDebounced } from '@vueuse/core'

// Disable devtools in component renderer iframe
// @ts-expect-error - Nuxt Devtools internal value
window.__NUXT_DEVTOOLS_DISABLE__ = true

const components = useState<Array<Component & { value: string }>>('__ui-devtools-components')
const component = useState<Component | undefined>('__ui-devtools-component')
const state = useState<Record<string, any>>('__ui-devtools-state', () => ({}))

let rpc: BirpcReturn<ServerFunctions, ClientFunctions> | null = null

onDevtoolsClientConnected(async (client) => {
  rpc = client.devtools.extendClientRpc<ServerFunctions, ClientFunctions>('nuxt/ui/devtools', { })
  components.value = (await rpc.getComponents()).map(component => ({ ...component, value: component.slug }))

  if (!component.value || !components.value.find(c => c.slug === component.value?.slug)) {
    component.value = components.value.find(comp => comp.slug === 'button')
  }

  state.value.props = { ...components.value?.reduce((acc, comp) => {
    acc[comp.slug] = comp.defaultVariants ?? {}
    return acc
  }, {} as Record<string, any>), ...state.value.props }

  state.value.slots = { ...components.value.reduce((acc, comp) => {
    acc[comp.slug] = {}
    return acc
  }, {} as Record<string, any>), ...state.value.slots }
})

function updateRenderer() {
  if (!component.value) return

  const event: Event & { data?: any } = new Event('nuxt-ui-devtools:update-renderer')
  event.data = { props: state.value.props?.[component.value.slug], slots: state.value.slots?.[component.value?.slug] }

  window.dispatchEvent(event)
}

watchDebounced(state, updateRenderer, { deep: true, debounce: 200, maxWait: 500 })

onMounted(() => {
  window.addEventListener('nuxt-ui-devtools:component-loaded', onComponentLoaded)
})

onUnmounted(() => {
  window.removeEventListener('nuxt-ui-devtools:component-loaded', onComponentLoaded)
})

function onComponentLoaded(event: Event & { data?: any }) {
  if (!component.value) return
  state.value.props[component.value.slug] = event.data?.props
}

// function onSlotHover(slot: string) {
//   const event: Event & { data?: any } = new Event('nuxt-ui-devtools:slot-hover')
//   event.data = { slot }
//   window.dispatchEvent(event)
// }
//
// function onSlotLeave(slot: string) {
//   const event: Event & { data?: any } = new Event('nuxt-ui-devtools:slot-leave')
//   event.data = { slot }
//   window.dispatchEvent(event)
// }

const tabs = computed(() => {
  if (!component.value) return
  // const themeCount = component.value.meta.slots ? Object.keys(component.value.meta.slots)?.length : 0

  return [
    { label: 'Props', slot: 'props', icon: 'i-heroicons-cog-6-tooth', disabled: !component.value.meta.props?.length }
    // { label: 'Theme', slot: 'theme', icon: 'i-heroicons-paint-brush', disabled: !themeCount }
  ]
})

const searchOpened = ref(false)
function onComponentSearch(value: any) {
  const match = components.value.find(c => c.slug === value?.slug)
  searchOpened.value = false

  if (!match) return
  component.value = match
}

defineShortcuts({
  meta_k: () => searchOpened.value = true
})

function openDocs() {
  if (!component.value) return
  window.parent.open(`https://ui3.nuxt.dev/components/${component.value.slug}`)
}

const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(value) {
    colorMode.preference = value ? 'dark' : 'light'

    const event: Event & { isDark?: boolean } = new Event('nuxt-ui-devtools:set-color-mode')
    event.isDark = value
    window.dispatchEvent(event)
  }
})

const componentProps = computed(() => {
  if (!component.value) return
  return state.value.props[component.value?.slug]
})
</script>

<template>
  <UApp class="h-screen w-full relative font-sans">
    <div v-if="!components || !component" class="h-screen w-screen" />
    <template v-else>
      <div
        class="top-0 h-[49px] border-b border-[--ui-border] flex justify-center"
      >
        <span />

        <UModal v-model:open="searchOpened" :ui="{ content: 'top-0 sm:top-8 translate-y-0 sm:max-w-xl w-full' }">
          <UButton label="Search component..." color="neutral" variant="link" icon="i-heroicons-magnifying-glass-20-solid" class="w-full" />
          <template #content>
            <UCommandPalette
              :groups="[{ id: 'component', items: components.map((c) => ({ slug: c.slug, label: c.label })) }]"
              placeholder="Search component..."
              :fuse="{ fuseOptions: { includeMatches: true } }"
              @update:model-value="onComponentSearch"
              @close="searchOpened = false"
            />
          </template>
        </UModal>
      </div>

      <div class="absolute top-[49px] bottom-0 inset-x-0 grid xl:grid-cols-8 grid-cols-4">
        <div class="col-span-1 border-r border-[--ui-border] hidden xl:block overflow-y-auto">
          <UNavigationMenu
            :items="components.map((c) => ({ ...c, select: () => component = c }))"
            orientation="vertical"
          />
        </div>

        <div class="xl:col-span-5 col-span-2 relative">
          <ComponentPreview :component="component" :props="componentProps" class="h-full" />
          <div class="flex gap-2 absolute top-1 right-2">
            <UButton
              :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
              variant="ghost"
              color="neutral"
              @click="isDark = !isDark"
            />
            <UButton
              v-if="component"
              variant="ghost"
              color="neutral"
              icon="i-heroicons-arrow-top-right-on-square"
              @click="openDocs()"
            >
              Open docs
            </UButton>
          </div>
        </div>

        <div class="border-l border-[--ui-border] flex flex-col col-span-2 overflow-y-auto">
          <UTabs color="neutral" variant="link" :items="tabs">
            <template #props>
              <div v-for="prop in component?.meta?.props.filter((prop) => prop.name !== 'ui')" :key="'prop-' + prop.name" class="px-3 py-5 border-b border-[--ui-border] dark:border-[--ui-border]">
                <ComponentPropInput v-bind="prop" v-model="componentProps[prop.name]" />
              </div>
            </template>

            <!-- template #theme>
              <div v-for="(_value, slot) in component?.slots" :key="'slots-' + slot" class="px-3 py-5 hover:bg-neutral-50 transition">
                <UFormField :name="slot" @mouseenter="onSlotHover(slot)" @mouseleave="onSlotLeave(slot)">
                  <template #label>
                    <p class="font-mono font-bold px-2 py-0.5 border-[--ui-border] border border-dashed rounded bg-neutral-100">
                      {{ slot }}
                    </p>
                  </template>
                  <UTextarea v-model="state.slots[component.slug][slot]" autoresize class="mt-2 w-full font-mono" />
                </UFormField>
              </div>
            </template -->
          </UTabs>
        </div>
      </div>
    </template>
  </UApp>
</template>

<style>
@import 'tailwindcss';
@import '@nuxt/ui';

@theme {
  --font-family-sans: 'DM Sans', sans-serif;

  --color-primary-50: var(--ui-color-primary-50);
  --color-primary-100: var(--ui-color-primary-100);
  --color-primary-200: var(--ui-color-primary-200);
  --color-primary-300: var(--ui-color-primary-300);
  --color-primary-400: var(--ui-color-primary-400);
  --color-primary-500: var(--ui-color-primary-500);
  --color-primary-600: var(--ui-color-primary-600);
  --color-primary-700: var(--ui-color-primary-700);
  --color-primary-800: var(--ui-color-primary-800);
  --color-primary-900: var(--ui-color-primary-900);
  --color-primary-950: var(--ui-color-primary-950);

  --color-neutral-50: var(--ui-color-neutral-50);
  --color-neutral-100: var(--ui-color-neutral-100);
  --color-neutral-200: var(--ui-color-neutral-200);
  --color-neutral-300: var(--ui-color-neutral-300);
  --color-neutral-400: var(--ui-color-neutral-400);
  --color-neutral-500: var(--ui-color-neutral-500);
  --color-neutral-600: var(--ui-color-neutral-600);
  --color-neutral-700: var(--ui-color-neutral-700);
  --color-neutral-800: var(--ui-color-neutral-800);
  --color-neutral-900: var(--ui-color-neutral-900);
  --color-neutral-950: var(--ui-color-neutral-950);
}

:root {
  --ui-border: var(--ui-color-neutral-200);
}

.dark {
  --ui-border: var(--ui-color-neutral-800);
  --ui-bg: #111;
}
</style>
