<script setup lang="ts">
import { onDevtoolsClientConnected } from '@nuxt/devtools-kit/iframe-client'
import type { ClientFunctions, ServerFunctions, Component } from '../../src/devtools/rpc'
import type { BirpcReturn } from 'birpc'
import { watchDebounced } from '@vueuse/core'
import { defu } from 'defu'

// @ts-expect-error - Nuxt Devtools internal value
// Disable devtools in component renderer iframe
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

  state.value.props = defu(state.value.props, components.value?.reduce((acc, comp) => {
    acc[comp.slug] = comp.defaultVariants ?? {}
    return acc
  }, {} as Record<string, any>))

  state.value.slots = defu(state.value.slots, components.value.reduce((acc, comp) => {
    acc[comp.slug] = {} // comp.slots ?? {}
    return acc
  }, {} as Record<string, any>))
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
  state.value.props[component.value.slug] = defu(state.value.props[component.value.slug], event.data?.props)
}

function onSlotHover(slot: string) {
  const event: Event & { data?: any } = new Event('nuxt-ui-devtools:slot-hover')
  event.data = { slot }
  window.dispatchEvent(event)
}

function onSlotLeave(slot: string) {
  const event: Event & { data?: any } = new Event('nuxt-ui-devtools:slot-leave')
  event.data = { slot }
  window.dispatchEvent(event)
}

const tabs = computed(() => {
  if (!component.value) return
  const themeCount = component.value.meta.slots ? Object.keys(component.value.meta.slots)?.length : 0

  return [
    { label: 'Props', slot: 'props', icon: 'i-heroicons-cog-6-tooth', disabled: !component.value.meta.props?.length },
    { label: 'Theme', slot: 'theme', icon: 'i-heroicons-paint-brush', disabled: !themeCount }
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
</script>

<template>
  <UApp class="h-screen w-full relative font-sans">
    <div v-if="!components || !component" class="h-screen w-screen" />
    <template v-else>
      <div
        class="top-0 h-[49px] border-b border-gray-200 bg-white flex justify-center"
      >
        <span />

        <UModal v-model:open="searchOpened" :ui="{ content: 'top-0 sm:top-8 translate-y-0 sm:max-w-xl w-full' }">
          <UButton color="gray" label="Search component..." variant="link" icon="i-heroicons-magnifying-glass-20-solid" class="w-full cursor-pointer" />
          <template #content>
            <UCommandPalette
              variant="none"
              :groups="[{ id: 'component', items: components.map((c) => ({ slug: c.slug, label: c.label })) }]"
              leading-icon=""
              placeholder="Search component..."
              :fuse="{
                fuseOptions: {
                  includeMatches: true
                }
              }"
              @update:model-value="onComponentSearch"
              @close="searchOpened = false"
            />
          </template>
        </UModal>
      </div>

      <div class="absolute top-[49px] bottom-0 inset-x-0 grid xl:grid-cols-8 grid-cols-6">
        <div class="col-span-1 border-r border-gray-200 hidden xl:block overflow-y-auto bg-white">
          <UNavigationMenu
            :model-value="component?.slug"
            :items="components.map((c) => ({ ...c, select: () => component = c }))"
            orientation="vertical"
            highlight
          />
        </div>

        <div class="xl:col-span-4 col-span-3">
          <ComponentPreview :component="component" :props="state.props[component.slug]" :theme-slots="state.slots[component.slug]" class="h-full" />
        </div>

        <div class="bg-white border-l border-gray-200 flex flex-col col-span-3  overflow-y-auto">
          <UTabs color="gray" variant="link" :items="tabs">
            <template #props>
              <div v-for="prop in component.meta?.props.filter((prop) => prop.name !== 'ui')" :key="'prop-' + prop.name" class="px-3 py-5 border-b border-gray-200">
                <UFormField :name="prop.name" class="grid grid-cols-2 gap-8 items-baseline">
                  <template #label>
                    <p class="font-mono font-bold px-2 py-0.5 border-gray-300 border border-dashed rounded bg-gray-50">
                      {{ prop?.name }}
                    </p>
                  </template>

                  <template #description>
                    <MDC v-if="prop.description" :value="prop.description" class="text-gray-600 dark:text-gray-300 mt-1" />
                  </template>

                  <ComponentPropInput v-bind="prop" v-model="state.props[component.slug][prop.name]" />
                </UFormField>
              </div>
            </template>

            <template #theme>
              <div v-for="(_value, slot) in component?.slots" :key="'slots-' + slot" class="px-3 py-5 hover:bg-gray-50 transition">
                <UFormField :name="slot" @mouseenter="onSlotHover(slot)" @mouseleave="onSlotLeave(slot)">
                  <template #label>
                    <p class="font-mono font-bold px-2 py-0.5 border-gray-300 border border-dashed rounded bg-gray-100">
                      {{ slot }}
                    </p>
                  </template>
                  <UTextarea v-model="state.slots[component.slug][slot]" autoresize class="mt-2 w-full font-mono" />
                </UFormField>
              </div>
            </template>
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
}
</style>
