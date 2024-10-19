<script setup lang="ts">
import type { Component } from '../../../src/devtools/rpc'
import { useClipboard } from '@vueuse/core'
import { kebabCase } from 'scule'
import { genObjectFromValues, genArrayFromRaw } from 'knitwork'

const props = defineProps<{ component?: Component, props?: object, themeSlots?: Record<string, any> }>()

const { data: componentExample } = await useAsyncData('__ui_devtools_component-source', async () => {
  const example = props.component?.meta?.devtools?.example
  if (!example) return false
  return await $fetch<{ source: string }>(`/api/component-example`, { params: { component: example } })
}, { watch: [() => props.component?.slug] })

const code = computed(() => {
  if (!props.component) return

  const propsTemplate = Object.entries(props.props ?? {})?.map(([key, value]: [string, any]) => {
    const defaultValue: any = props.component?.meta?.props.find(prop => prop.name === key)?.default
    if (defaultValue === value) return
    if (value === true) return kebabCase(key)
    if (value === false && defaultValue === true) return `:${kebabCase(key)}="false"`
    if (!value) return
    if (props.component?.defaultVariants?.[key] === value) return
    if (typeof value === 'number') return `:${kebabCase(key)}="${value}"`
    if (Array.isArray(value)) return value.length ? `:${kebabCase(key)}="${genArrayFromRaw(value, undefined, { preserveTypes: true })}"` : undefined
    if (typeof value === 'object') return `:${kebabCase(key)}="${genObjectFromValues(value)}"`
    return `${kebabCase(key)}="${value}"`
  }).filter(Boolean).join('\n')

  const slotsTemplate = props.themeSlots
    ? genObjectFromValues(Object.keys(props.themeSlots).filter(key => key !== 'base').reduce((acc, key) => {
      acc[key] = props.themeSlots?.[key]
      return acc
    }, {} as Record<string, string>))
    : undefined

  const extraTemplate = [propsTemplate, props.themeSlots?.base ? `class="${props.themeSlots.base}"` : null, slotsTemplate && slotsTemplate !== '{}' ? `:ui="${slotsTemplate}"` : null].filter(Boolean).join(' ')

  if (componentExample.value) {
    const componentRegexp = new RegExp(`<${props.component.label}(\\s|\\r|>)`)

    return `\`\`\`vue
${componentExample.value?.source
  .replace(componentRegexp, `<${props.component.label} ${extraTemplate}$1`)
  .replace('v-bind="$attrs"', '')}
\`\`\``
  }

  return `\`\`\`vue
<${props.component.label} ${extraTemplate} />
\`\`\``
})

const { data: ast } = await useAsyncData('component-code', async () => {
  if (!code.value) return

  const { $prettier } = useNuxtApp()
  const formatted = await $prettier.format(code.value, {
    trailingComma: 'none',
    semi: false,
    singleQuote: true
  })

  return await parseMarkdown(formatted)
}, { watch: [code] })

const { copy, copied } = useClipboard()

const renderer = ref()
const rendererReady = ref(false)
function onRendererReady() {
  rendererReady.value = true
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
      v-show="rendererReady"
      ref="renderer"
      class="grow w-full"
      :src="previewUrl"
      @load="onRendererReady"
    />
    <div v-if="ast" v-show="rendererReady" class="relative w-full p-3">
      <MDCRenderer :body="ast.body" :data="ast.data" class="p-4 min-h-40 max-h-72 text-sm overflow-y-auto rounded-lg border border-[var(--ui-border)] bg-neutral-50 dark:bg-neutral-800" />
      <UButton
        color="neutral"
        variant="link"
        :icon="copied ? 'i-heroicons-clipboard-document-check' : 'i-heroicons-clipboard-document'"
        class="absolute top-6 right-6"
        @click="copy((ast?.body?.children?.[0] as any)?.props.code)"
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
