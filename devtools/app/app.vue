<script setup lang="ts">
import type { Component } from '../../src/devtools/meta'
import { watchDebounced } from '@vueuse/core'

// Disable devtools in component renderer iframe
// @ts-expect-error - Nuxt Devtools internal value
window.__NUXT_DEVTOOLS_DISABLE__ = true

const component = useState<Component | undefined>('__ui-devtools-component')
const state = useState<Record<string, any>>('__ui-devtools-state', () => ({}))

const { data: components, status, error } = useAsyncData<Array<Component>>('__ui-devtools-components', async () => {
  const componentMeta = await $fetch<Record<string, Component>>('/api/component-meta')

  if (!component.value || !componentMeta[component.value.slug]) {
    component.value = componentMeta['button']
  }

  state.value.props = Object.values(componentMeta).reduce((acc, comp) => {
    const componentDefaultProps = comp.meta?.props.reduce((acc, prop) => {
      if (prop.default) acc[prop.name] = prop.default
      return acc
    }, {} as Record<string, any>)

    acc[comp.slug] = {
      ...comp.defaultVariants, // Default values from the theme template
      ...componentDefaultProps, // Default values from vue props
      ...componentMeta[comp.slug]?.meta?.devtools?.defaultProps // Default values from devtools extended meta
    }

    return acc
  }, {} as Record<string, any>)

  return Object.values(componentMeta)
})

const componentProps = computed(() => {
  if (!component.value) return
  return state.value.props[component.value?.slug]
})

const componentPropsMeta = computed(() => {
  return component.value?.meta?.props.filter(prop => prop.name !== 'ui').sort((a, b) => a.name.localeCompare(b.name))
})

function updateRenderer() {
  if (!component.value) return
  const event: Event & { data?: any } = new Event('nuxt-ui-devtools:update-renderer')
  event.data = {
    props: state.value.props?.[component.value.slug], slots: state.value.slots?.[component.value?.slug]
  }
  window.dispatchEvent(event)
}

watchDebounced(state, updateRenderer, { deep: true, debounce: 200, maxWait: 500 })
onMounted(() => window.addEventListener('nuxt-ui-devtools:component-loaded', onComponentLoaded))
onUnmounted(() => window.removeEventListener('nuxt-ui-devtools:component-loaded', onComponentLoaded))

function onComponentLoaded() {
  if (!component.value) return
  updateRenderer()
}

const tabs = computed(() => {
  if (!component.value) return
  return [
    { label: 'Props', slot: 'props', icon: 'i-lucide-settings', disabled: !component.value.meta?.props?.length }
  ]
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
</script>

<template>
  <UApp class="flex justify-center items-center h-screen w-full relative font-sans">
    <div v-if="status === 'pending' || error || !component || !components?.length">
      <div v-if="error" class="flex flex-col justify-center items-center h-screen w-screen text-center text-[var(--ui-color-error-500)]">
        <UILogo class="h-8" />
        <UIcon name="i-lucide-circle-alert" size="20" class="mt-2" />
        <p>
          {{ (error.data as any)?.error ?? 'Unexpected error' }}
        </p>
      </div>
    </div>
    <template v-else>
      <div
        class="top-0 h-[49px] border-b border-[var(--ui-border)] flex justify-center"
      >
        <span />

        <UInputMenu
          v-model="component"
          variant="none"
          :items="components"
          placeholder="Search component..."
          class="top-0 translate-y-0 w-full mx-2"
          icon="i-lucide-search"
        />

        <div class="absolute top-[49px] bottom-0 inset-x-0 grid xl:grid-cols-8 grid-cols-4 bg-[var(--ui-bg)]">
          <div class="col-span-1 border-r border-[var(--ui-border)] hidden xl:block overflow-y-auto">
            <UNavigationMenu
              :items="components.map((c) => ({ ...c, active: c.slug === component?.slug, onSelect: () => component = c }))"
              orientation="vertical"
              :ui="{ link: 'before:rounded-none' }"
            />
          </div>

          <div class="xl:col-span-5 col-span-2 relative">
            <ComponentPreview :component="component" :props="componentProps" class="h-full" />
            <div class="flex gap-2 absolute top-1 right-2">
              <UButton
                :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
                variant="ghost"
                color="neutral"
                @click="isDark = !isDark"
              />
              <UButton
                v-if="component"
                variant="ghost"
                color="neutral"
                icon="i-lucide-external-link"
                @click="openDocs()"
              >
                Open docs
              </UButton>
            </div>
          </div>

          <div class="border-l border-[var(--ui-border)] flex flex-col col-span-2 overflow-y-auto">
            <UTabs color="neutral" variant="link" :items="tabs" class="relative" :ui="{ list: 'sticky top-0 bg-[var(--ui-bg)] z-50' }">
              <template #props>
                <div v-for="prop in componentPropsMeta" :key="'prop-' + prop.name" class="px-3 py-5 border-b border-[var(--ui-border)]">
                  <ComponentPropInput
                    v-model="componentProps[prop.name]"
                    :meta="prop"
                    :ignore="component.meta?.devtools?.ignoreProps?.includes(prop.name)"
                  />
                </div>
              </template>
            </UTabs>
          </div>
        </div>
      </div>
    </template>
  </UApp>
</template>

<style>
@import 'tailwindcss';
@import '@nuxt/ui';

@theme {
  --font-sans: 'DM Sans', sans-serif;

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
  --ui-bg: white;
}

.dark {
  --ui-border: var(--ui-color-neutral-800);
  --ui-bg: var(--ui-color-neutral-900);
}

.shiki
.shiki span {
  background-color: transparent !important;
}

html.dark .shiki,
html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: transparent !important;
  /* Optional, if you also want font styles */
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
</style>
