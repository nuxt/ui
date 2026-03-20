<script setup lang="ts">
import type { ChipProps } from '@nuxt/ui'
import { camelCase, upperFirst } from 'scule'
import { hash } from 'ohash'
import { useElementSize } from '@vueuse/core'
import { get, set } from '#ui/utils'

const props = withDefaults(defineProps<{
  name: string
  class?: any
  /**
   * Whether to render the component in an iframe
   * @defaultValue false
   */
  iframe?: boolean | { [key: string]: any }
  /**
   * Whether to display the component in a mobile-sized iframe viewport
   * @defaultValue false
   */
  iframeMobile?: boolean
  props?: { [key: string]: any }
  /**
   * Whether to format the code with Prettier
   * @defaultValue false
   */
  prettier?: boolean
  /**
   * Whether to collapse the code block
   * @defaultValue false
   */
  collapse?: boolean
  /**
   * Whether to show the preview
   * When `false`, the filename will be shown instead
   * @defaultValue true
   */
  preview?: boolean
  /**
   * Whether to show the source code
   * @defaultValue true
   */
  source?: boolean
  /**
   * A list of variable props to link to the component.
   */
  options?: Array<{
    type?: string
    alias?: string
    name: string
    label: string
    items?: any[]
    default: any
    multiple?: boolean
  }>
  /**
   * A list of line numbers to highlight in the code block
   */
  highlights?: number[]
  /**
   * Whether to add overflow-hidden to wrapper
   */
  overflowHidden?: boolean
  /**
   * Whether to add background-elevated to wrapper
   */
  elevated?: boolean
  lang?: string
  /**
   * Override the filename used for the code block
   */
  filename?: string
}>(), {
  preview: true,
  source: true,
  lang: 'vue'
})

const slots = defineSlots<{
  options(props?: {}): any
  code(props?: {}): any
}>()

const el = ref<HTMLElement | null>(null)
const wrapperContainer = ref<HTMLElement | null>(null)
const componentContainer = ref<HTMLElement | null>(null)

const { $prettier } = useNuxtApp()
const { width } = useElementSize(el)

const camelName = camelCase(props.name)

const exampleModules = import.meta.glob('~/components/content/examples/**/*.vue')
const exampleMatch = Object.entries(exampleModules).find(([path]) => path.endsWith(`/${upperFirst(camelName)}.vue`))
const resolvedComponent = exampleMatch ? defineAsyncComponent(exampleMatch[1] as any) : undefined

const { data } = await useFetchComponentExample(camelName)

const componentProps = reactive({ ...(props.props || {}) })

function buildCodeBlock(source: string, cssClass?: string) {
  const codeFence = `\`\`\`${props.lang} ${props.preview ? '' : ` [${props.filename ?? data.value?.pascalName}.${props.lang}]`}${props.highlights?.length ? `{${props.highlights.join('-')}}` : ''}
${source}
\`\`\``

  if (props.collapse) {
    return `::code-collapse${cssClass ? `{class="${cssClass}"}` : ''}
${codeFence}
::`
  }

  if (cssClass) {
    return `::div{class="${cssClass}"}
${codeFence}
::`
  }

  return codeFence
}

const code = computed(() => {
  const rawCode = data.value?.code ?? ''
  const vueCode = addVueImports(rawCode)

  if (vueCode !== rawCode) {
    return buildCodeBlock(rawCode, 'nuxt-only') + '\n\n' + buildCodeBlock(vueCode, 'vue-only')
  }

  return buildCodeBlock(rawCode)
})

const { data: ast } = useAsyncData(`component-example-${camelName}${hash({ props: componentProps, collapse: props.collapse })}`, async () => {
  if (!props.prettier) {
    return cachedParseMarkdown(code.value)
  }

  let formatted = ''
  try {
    formatted = await $prettier.format(code.value, {
      trailingComma: 'none',
      semi: false,
      singleQuote: true,
      printWidth: 100
    })
  } catch {
    formatted = code.value
  }

  return cachedParseMarkdown(formatted)
}, { lazy: import.meta.client, watch: [code] })

const optionsValues = ref(props.options?.reduce((acc, option) => {
  if (option.name) {
    acc[option.alias || option.name] = option.default
  }
  if (option.name.toLowerCase().endsWith('color') && option.items?.length) {
    option.items = option.items.map((item: any) => ({
      label: item,
      value: item,
      chip: { color: item }
    }))
  }
  return acc
}, {} as Record<string, any>) || {})

const playgroundUrl = computed(() => {
  const rawCode = data.value?.code
  if (!rawCode) return null
  return getPlaygroundUrl(addVueImports(rawCode))
})

const urlSearchParams = computed(() => {
  const params = {
    ...optionsValues.value,
    ...componentProps
  }

  if (!props.iframeMobile) {
    params.width = Math.round(width.value).toString()
  }

  return new URLSearchParams(params).toString()
})
</script>

<template>
  <div ref="el" class="my-5" :style="{ '--ui-header-height': '4rem' }">
    <template v-if="preview">
      <div ref="wrapperContainer" class="relative group/component">
        <div class="border border-muted relative z-1" :class="[{ 'border-b-0 rounded-t-md': props.source, 'rounded-md': !props.source, 'overflow-hidden': props.overflowHidden }]">
          <div v-if="props.options?.length || !!slots.options" class="flex gap-4 p-4 border-b border-muted">
            <slot name="options" />

            <UFormField
              v-for="option in props.options"
              :key="option.name"
              :label="option.label"
              :name="option.name"
              size="sm"
              class="inline-flex ring ring-accented rounded-sm"
              :ui="{
                wrapper: 'bg-elevated/50 rounded-l-sm flex border-r border-accented',
                label: 'text-muted px-2 py-1.5',
                container: 'mt-0'
              }"
            >
              <USelectMenu
                v-if="option.items?.length"
                :model-value="get(optionsValues, option.name)"
                :items="option.items"
                :search-input="false"
                :value-key="option.name.toLowerCase().endsWith('color') ? 'value' : undefined"
                color="neutral"
                variant="soft"
                class="rounded-sm rounded-l-none min-w-12"
                :multiple="option.multiple"
                :class="[option.name.toLowerCase().endsWith('color') && 'pl-6']"
                :ui="{ itemLeadingChip: 'w-2' }"
                @update:model-value="set(optionsValues, option.name, $event)"
              >
                <template v-if="option.name.toLowerCase().endsWith('color')" #leading="{ modelValue, ui }">
                  <UChip
                    inset
                    standalone
                    :color="(modelValue as any)"
                    :size="(ui.itemLeadingChipSize() as ChipProps['size'])"
                    class="size-2"
                  />
                </template>
              </USelectMenu>
              <UInput
                v-else
                :model-value="get(optionsValues, option.name)"
                :type="option.type"
                color="neutral"
                variant="soft"
                :ui="{ base: 'rounded-sm rounded-l-none min-w-12' }"
                @update:model-value="set(optionsValues, option.name, $event)"
              />
            </UFormField>
          </div>

          <iframe
            v-if="iframe"
            v-bind="typeof iframe === 'object' ? iframe : {}"
            :src="`/examples/${name}?${urlSearchParams}`"
            class="relative w-full"
            :class="[props.class, { 'dark:bg-neutral-950/50 rounded-t-md': props.elevated }, !iframeMobile && 'lg:left-1/2 lg:-translate-x-1/2 lg:w-[1024px]']"
          />
          <div v-else-if="resolvedComponent" ref="componentContainer" class="flex justify-center p-4" :class="[props.class, { 'dark:bg-neutral-950/50 rounded-t-md': props.elevated }]">
            <component :is="resolvedComponent" v-bind="{ ...componentProps, ...optionsValues }" />
          </div>
        </div>

        <ClientOnly>
          <UTooltip v-if="playgroundUrl" text="Open in playground" :content="{ side: 'right' }">
            <UButton
              :to="playgroundUrl"
              target="_blank"
              icon="i-lucide-play"
              color="neutral"
              variant="outline"
              size="sm"
              class="absolute -bottom-[13px] -right-[13px] z-1 rounded-full lg:opacity-0 lg:group-hover/component:opacity-100 ring-muted transition-opacity duration-200"
              aria-label="Open in playground"
            />
          </UTooltip>

          <LazyComponentThemeVisualizer
            :container="componentContainer"
            :position-container="wrapperContainer"
          />
        </ClientOnly>
      </div>
    </template>

    <template v-if="props.source">
      <div v-if="!!slots.code" class="[&_pre]:rounded-t-none! [&_div.my-5]:mt-0!">
        <slot name="code" />
      </div>
      <MDCRenderer v-else-if="ast" :body="ast.body" :data="ast.data" class="[&_pre]:rounded-t-none! [&_div.my-5]:mt-0!" />
    </template>
  </div>
</template>
