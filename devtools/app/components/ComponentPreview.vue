<script setup lang="ts">
import type { Component } from '../../../src/devtools/meta'
import { useClipboard } from '@vueuse/core'
import { kebabCase } from 'scule'
import { escapeString } from 'knitwork'

const props = defineProps<{ component?: Component, props?: object, themeSlots?: Record<string, any> }>()

const { data: componentExample } = useAsyncData('__ui_devtools_component-source', async () => {
  const example = props.component?.meta?.devtools?.example
  if (!example) return false
  return await $fetch<{ source: string }>(`/api/component-example`, { params: { component: example } })
}, { watch: [() => props.component?.slug] })

function genPropValue(value: any): string {
  if (typeof value === 'string') {
    return `'${escapeString(value).replace(/'/g, '&apos;').replace(/"/g, '&quot;')}'`
  }
  if (Array.isArray(value)) {
    return `[ ${value.map(item => `${genPropValue(item)}`).join(',')} ]`
  }
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value).map(([key, val]) => `${key}: ${genPropValue(val)}`)
    return `{ ${entries.join(`,`)} }`
  }

  return value
}

const code = computed(() => {
  if (!props.component) return

  const propsTemplate = Object.entries(props.props ?? {})?.map(([key, value]: [string, any]) => {
    const defaultValue: any = props.component?.meta?.props.find(prop => prop.name === key)?.default
    if (defaultValue === value) return
    if (value === true) return kebabCase(key)
    if (value === false && defaultValue === true) return `:${kebabCase(key)}="false"`
    if (!value) return
    if (props.component?.defaultVariants?.[key] === value) return
    if (typeof value === 'string') return `${kebabCase(key)}=${genPropValue(value)}`
    return `:${kebabCase(key)}="${genPropValue(value)}"`
  }).filter(Boolean).join('\n')

  const slotsTemplate = props.themeSlots
    ? genPropValue(Object.keys(props.themeSlots).filter(key => key !== 'base').reduce((acc, key) => {
      acc[key] = genPropValue(props.themeSlots?.[key])
      return acc
    }, {} as Record<string, string>))
    : undefined

  const extraTemplate = [
    propsTemplate,
    props.themeSlots?.base ? `class="${genPropValue(props.themeSlots.base)}"` : null,
    slotsTemplate && slotsTemplate !== '{}' ? `:ui="${slotsTemplate}"` : null
  ].filter(Boolean).join(' ')

  if (componentExample.value) {
    const componentRegexp = new RegExp(`<${props.component.label}(\\s|\\r|>)`)

    return componentExample.value?.source
      .replace(/import .* from ['"]#.*['"];?\n+/, '')
      .replace(componentRegexp, `<${props.component.label} ${extraTemplate}$1`)
      .replace('v-bind="$attrs"', '')
  }
  return `<${props.component.label} ${extraTemplate} />`
})

const { $prettier } = useNuxtApp()
const { data: formattedCode } = useAsyncData('__ui-devtools-component-formatted-code', async () => {
  if (!code.value) return
  return await $prettier.format(code.value, {
    semi: false,
    singleQuote: true,
    printWidth: 80
  })
}, { watch: [code] })

const { codeToHtml } = useShiki()
const { data: highlightedCode } = useAsyncData('__ui-devtools-component-highlighted-code', async () => {
  return formattedCode.value
    ? codeToHtml(formattedCode.value, 'vue')
    : undefined
}, { watch: [formattedCode] })

const { copy, copied } = useClipboard()

const rendererVisible = ref(true)
const renderer = ref()
const rendererReady = ref(false)
function onRendererReady() {
  rendererReady.value = true
  setTimeout(() => rendererVisible.value = !!renderer.value.contentWindow.document.getElementById('ui-devtools-renderer'), 500)
}

watch(() => props.component, () => rendererReady.value = false)

const previewUrl = computed(() => {
  if (!props.component) return
  const baseUrl = `/__nuxt_ui__/components/${props.component.slug}`
  const params = new URLSearchParams()

  if (props.component?.meta?.devtools?.example !== undefined) {
    params.append('example', props.component.meta.devtools.example)
  }
  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
})
</script>

<template>
  <div class="flex flex-col bg-grid">
    <iframe
      v-if="component"
      v-show="rendererReady && rendererVisible"
      ref="renderer"
      class="grow w-full"
      :src="previewUrl"
      @load="onRendererReady"
    />
    <div v-if="!rendererVisible" class="grow w-full flex justify-center items-center px-8">
      <UAlert color="error" variant="subtle" title="Component preview not found" icon="i-lucide-circle-alert">
        <template #description>
          <p>Ensure your <code>app.vue</code> file includes a <code>&lt;NuxtPage /&gt;</code> component, as the component preview is mounted as a page. </p>
        </template>
      </UAlert>
    </div>
    <div v-if="highlightedCode && formattedCode" v-show="rendererReady" class="relative w-full p-3">
      <!-- eslint-disable vue/no-v-html -->
      <pre class="p-4 min-h-40 max-h-72 text-sm overflow-y-auto rounded-[calc(var(--ui-radius)*1.5)] border border-[var(--ui-border)] bg-neutral-50 dark:bg-neutral-800" v-html="highlightedCode" />
      <UButton
        color="neutral"
        variant="link"
        :icon="copied ? 'i-lucide-clipboard-check' : 'i-lucide-clipboard'"
        class="absolute top-6 right-6"
        @click="copy(formattedCode)"
      />
    </div>
  </div>
</template>

<style scoped>
.bg-grid {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' transform='scale(3)'%3E%3Crect width='100%25' height='100%25' fill='%23fff'/%3E%3Cpath fill='none' stroke='hsla(0, 0%25, 98%25, 1)' stroke-width='.2' d='M10 0v20ZM0 10h20Z'/%3E%3C/svg%3E");
  background-size: 40px 40px;
}

.dark .bg-grid {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' transform='scale(3)'%3E%3Crect width='100%25' height='100%25' fill='hsl(0, 0%25, 8.5%25)'/%3E%3Cpath fill='none' stroke='hsl(0, 0%25, 11.0%25)' stroke-width='.2' d='M10 0v20ZM0 10h20Z'/%3E%3C/svg%3E");
  background-size: 40px 40px;
}
</style>
