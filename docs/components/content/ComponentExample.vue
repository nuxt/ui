<template>
  <div class="[&>div>pre]:!rounded-t-none [&>div>pre]:!mt-0">
    <div
      class="flex border border-gray-200 dark:border-gray-700 relative not-prose rounded-t-md"
      :class="[{ 'p-4': padding, 'rounded-b-md': !hasCode, 'border-b-0': hasCode }, backgroundClass, overflowClass]"
    >
      <component :is="camelName" v-if="component" v-bind="componentProps" />
      <ContentSlot v-if="$slots.default" :use="$slots.default" />
    </div>
    <template v-if="hasCode">
      <div class="relative h-full w-full">
        <ContentSlot v-if="$slots.code" :use="$slots.code" />
        <ContentRenderer
          v-else
          :value="ast"
          class="[&>div>pre]:!rounded-t-none [&>div>pre]:h-full [&>div>pre]:!mt-0 [&>div>pre]:block"
          :class="{
            '[&>div>pre]:max-h-[250px] [&>div>pre]:block [&>div>pre]:overflow-hidden ': expandCode,
            '[&>div>pre]:overflow-scroll [&>div>pre]:max-h-[80vh]': !expandCode
          }"
        />
        <div class="bg-gradient-to-t from-[#161618FF] to-[#16161800] bottom-[1px] left-[1px] right-[1px] h-20 flex items-center justify-center absolute rounded-b-lg">
          <UButton
            class="mt-4"
            :ui="{ rounded: 'rounded-full' }"
            :icon="expandCode ? 'i-heroicons-chevron-down-20-solid' : 'i-heroicons-chevron-up-20-solid'"
            trailing
            @click="expandCode = !expandCode"
          >
            {{ expandCode ? 'Expand' : 'Collapse' }} code
          </UButton>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { camelCase } from 'scule'
import { fetchContentExampleCode } from '~/composables/useContentExamplesCode'
// @ts-expect-error
import { transformContent } from '@nuxt/content/transformers'
// @ts-ignore
import { useShikiHighlighter } from '@nuxtjs/mdc/runtime'

const props = defineProps({
  component: {
    type: String,
    default: null
  },
  componentClass: {
    type: String,
    default: ''
  },
  componentProps: {
    type: Object,
    default: () => ({})
  },
  hiddenCode: {
    type: Boolean,
    default: false
  },
  expandCode: {
    type: Boolean,
    default: true
  },
  padding: {
    type: Boolean,
    default: true
  },
  backgroundClass: {
    type: String,
    default: 'bg-white dark:bg-gray-900'
  },
  overflowClass: {
    type: String,
    default: ''
  }
})

const instance = getCurrentInstance()
const camelName = camelCase(props.component)
const data = await fetchContentExampleCode(camelName)

const hasCode = computed(() => !props.hiddenCode && (data?.code || instance.slots.code))

const expandCode = ref(props.expandCode)

const shikiHighlighter = useShikiHighlighter({})
const codeHighlighter = async (code: string, lang: string, theme: any, highlights: number[]) => shikiHighlighter.getHighlightedAST(code, lang, theme, { highlights })
const { data: ast } = await useAsyncData(`content-example-${camelName}-ast`, () => transformContent('content:_markdown.md', `\`\`\`vue\n${data?.code ?? ''}\n\`\`\``, {
  markdown: {
    highlight: {
      highlighter: codeHighlighter,
      theme: {
        light: 'material-theme-lighter',
        default: 'material-theme',
        dark: 'material-theme-palenight'
      }
    }
  }
}))
</script>
