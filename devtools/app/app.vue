<script setup lang="ts">
import { onDevtoolsClientConnected } from '@nuxt/devtools-kit/iframe-client'
import type { ClientFunctions, ServerFunctions, Component } from '../../src/devtools/rpc'
import type { BirpcReturn } from 'birpc'
import { watchDebounced, useClipboard } from '@vueuse/core'
import defu from 'defu'
import { kebabCase } from 'scule'
import { genObjectFromValues } from 'knitwork'

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

const accordionItems = computed(() => {
  if (!component.value) return
  const themeCount = component.value.meta.slots ? Object.keys(component.value.meta.slots)?.length : 0

  return [
    { label: 'Props', slot: 'props', icon: 'i-heroicons-cog-6-tooth', disabled: !component.value.meta.props?.length },
    { label: 'Theme', slot: 'theme', icon: 'i-heroicons-paint-brush', disabled: !themeCount }
  ]
})

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

const code = ref()
watchDebounced([state, component], () => {
  if (!component.value) return

  const props = state.value.props?.[component.value?.slug ?? '']
  const slots = state.value.slots?.[component.value?.slug ?? '']

  const propsTemplate = Object.entries(props ?? {}).map(([key, value]: [string, any]) => {
    if (value === true) return kebabCase(key)
    if (value === false) return
    if (typeof value === 'number') return `:${kebabCase(key)}="${value}"`
    if (Array.isArray(value) ?? typeof value === 'object') return `:${kebabCase(key)}="${genObjectFromValues(value)}"`
    return `${kebabCase(key)}="${value}"`
  }).filter(Boolean).join('\n')

  const slotsTemplate = genObjectFromValues(Object.keys(slots).filter(key => key !== 'base').reduce((acc, key) => {
    acc[key] = slots[key]
    return acc
  }, {} as Record<string, string>))

  code.value = `\`\`\`vue
  <${component.value.label}
    ${propsTemplate}
    ${slots.base ? `:class="${slots.base}"` : ''}
    ${slotsTemplate !== '{}' ? `:ui="${slotsTemplate}"` : ''}
  ></${component.value.label}>
\`\`\``
}, { deep: true, debounce: 200, maxWait: 500 })

const { $prettier } = useNuxtApp()
const { parseMarkdown } = useMarkdownParser()

const { data: ast } = await useAsyncData('component-code', async () => {
  let formatted = ''
  try {
    formatted = await $prettier.format(code.value, {
      trailingComma: 'none',
      semi: false,
      singleQuote: true
    })
  } catch {
    return
  }
  return await parseMarkdown(formatted)
}, { watch: [code], immediate: false, server: false })

const { copy, copied } = useClipboard()
</script>

<template>
  <UApp class="h-screen w-full relative font-sans">
    <div
      class="top-0 h-[49px] border-b border-gray-200 bg-white flex"
    >
      <USelectMenu
        v-model="component"
        variant="none"
        :items="components"
        leading-icon="i-heroicons-magnifying-glass-20-solid"
        class="grow"
        placeholder="Search component..."
        :ui="{ content: 'max-h-96' }"
      />
    </div>
    <div v-if="component" class="absolute top-[49px] bottom-0 inset-x-0 grid xl:grid-cols-8 grid-cols-6">
      <div class="col-span-1 border-r border-gray-200 hidden xl:block overflow-y-auto bg-white">
        <UNavigationMenu
          :model-value="component?.slug"
          :items="components.map((c) => ({ ...c, select: () => component = c }))"
          orientation="vertical"
          highlight
        />
      </div>

      <div class="flex flex-col xl:col-span-4 col-span-3">
        <iframe class="grow w-full" :src="`/__nuxt_ui__/components/${component.slug}`" />
        <div class="relative min-h-40 max-h-72 w-full border-t border-gray-200 overflow-y-auto bg-gray-50">
          <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" class="p-4" />
          <UButton
            v-if="ast"
            color="gray"
            variant="link"
            :icon="copied ? 'i-heroicons-clipboard-document-check' : 'i-heroicons-clipboard-document'"
            class="absolute top-4 right-4"
            @click="copy(ast?.body?.children?.[0]?.props.code)"
          />
        </div>
      </div>
      <div class="bg-white border-l border-gray-200 flex flex-col overflow-y-auto col-span-3">
        <UTabs color="gray" variant="link" :items="accordionItems">
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
  </UApp>
</template>

<style>
@import 'tailwindcss';
@import '@nuxt/ui';

@theme {
  --font-family-sans: 'DM Sans', sans-serif;
}
</style>
