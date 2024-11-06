<template>
  <div class="[&>div>pre]:!rounded-t-none [&>div>pre]:!mt-0">
    <div v-if="hasPreview" class="flex border border-gray-200 dark:border-gray-700 relative rounded-t-md" :class="[{ 'p-4': padding, 'rounded-b-md': !hasCode, 'border-b-0': hasCode, 'not-prose': !prose }, backgroundClass, extraClass]">
      <template v-if="component">
        <iframe v-if="iframe" :src="`/examples/${component}`" v-bind="iframeProps" :class="backgroundClass" class="w-full" />
        <component :is="camelName" v-else v-bind="componentProps" :class="componentClass" />
      </template>

      <ContentSlot v-if="$slots.default" :use="$slots.default" />
    </div>
    <template v-if="hasCode">
      <slot v-if="$slots.code" name="code" />
      <ContentRenderer v-else :value="ast" class="[&>div>pre]:!rounded-t-none [&>div>pre]:!mt-0" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { camelCase } from 'scule'
import { fetchContentExampleCode } from '~/composables/useContentExamplesCode'
import { useShikiHighlighter } from '~/composables/useShikiHighlighter'

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
  hiddenPreview: {
    type: Boolean,
    default: false
  },
  hiddenCode: {
    type: Boolean,
    default: false
  },
  padding: {
    type: Boolean,
    default: true
  },
  prose: {
    type: Boolean,
    default: false
  },
  iframe: {
    type: Boolean,
    default: false
  },
  iframeProps: {
    type: Object,
    default: () => ({})
  },
  backgroundClass: {
    type: String,
    default: 'bg-white dark:bg-gray-900'
  },
  extraClass: {
    type: String,
    default: ''
  }
})

let component = props.component
// TODO: Remove once merged on `main` branch
if (['command-palette-theme-algolia', 'command-palette-theme-raycast', 'vertical-navigation-theme-tailwind', 'pagination-theme-rounded'].includes(component)) {
  component = component.replace('-theme', '-example-theme')
}

const instance = getCurrentInstance()
const camelName = camelCase(component)
const data = await fetchContentExampleCode(camelName)
const highlighter = useShikiHighlighter()

const hasCode = computed(() => !props.hiddenCode && (data?.code || instance.slots.code))
const hasPreview = computed(() => !props.hiddenPreview && (props.component || instance.slots.default))

const { data: ast } = await useAsyncData(`content-example-${camelName}-ast`, () => parseMarkdown(`\`\`\`vue\n${data?.code ?? ''}\n\`\`\``, {
  highlight: {
    highlighter,
    theme: {
      light: 'material-theme-lighter',
      default: 'material-theme',
      dark: 'material-theme-palenight'
    }
  }
}))
</script>
