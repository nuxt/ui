<template>
  <div class="[&>pre]:!rounded-t-none">
    <div v-if="propsToSelect.length" class="relative flex border border-gray-200 dark:border-gray-700 rounded-t-md overflow-hidden">
      <USelect
        v-for="prop in propsToSelect"
        :key="prop.name"
        v-model="componentProps[prop.name]"
        :name="prop.name"
        :placeholder="prop.name"
        :options="prop.options"
        appearance="none"
        class="font-medium bg-gray-50 dark:bg-gray-800 border-r border-r-gray-200 dark:border-r-gray-700"
        tabindex="-1"
      >
        {{ componentProps[prop.name] }}
      </USelect>
    </div>

    <div class="flex border border-b-0 border-gray-200 dark:border-gray-700 relative not-prose" :class="[{ 'p-4': padding }, propsToSelect.length ? 'border-t-0' : 'rounded-t-md']">
      <component :is="name" v-bind="fullProps">
        <ContentSlot v-if="$slots.default" :use="$slots.default" unwrap="p" />
      </component>
    </div>

    <ContentSlot v-if="$slots.code" :use="$slots.code" />
    <ContentRenderer v-else :value="ast" class="[&>pre]:!rounded-t-none" />
  </div>
</template>

<script setup lang="ts">
import { transformContent } from '@nuxt/content/transformers'
import { defu } from 'defu'
import $ui from '#build/ui'

const props = defineProps({
  slug: {
    type: String,
    default: null
  },
  padding: {
    type: Boolean,
    default: true
  },
  props: {
    type: Object,
    default: () => ({})
  },
  baseProps: {
    type: Object,
    default: () => ({})
  },
  ui: {
    type: Object,
    default: () => ({})
  },
  code: {
    type: String,
    default: null
  }
})

const componentProps = reactive({ ...props.props })

const route = useRoute()
const slug = props.slug || route.params.slug[1]
const camelName = useCamelCase(slug)
const name = `U${useUpperFirst(camelName)}`

const { data: meta } = await useAsyncData(`${name}-meta`, () => $fetch(`/api/component-meta/${name}`))

// Computed

const ui = computed(() => defu({}, props.ui, $ui[camelName]))

const fullProps = computed(() => ({ ...props.baseProps, ...componentProps }))

const propsToSelect = computed(() => Object.keys(componentProps).map((key) => {
  const options = Object.keys(useGet(ui.value, useKebabCase(key).replaceAll('-', '.')) || {})
  if (!options.length) {
    return null
  }

  return {
    name: key,
    options
  }
}).filter(Boolean))

const code = computed(() => {
  let code = `\`\`\`html
<${name}`
  for (const [key, value] of Object.entries(componentProps)) {
    const prop = meta.value.meta.props.find((prop: any) => prop.name === key)

    code += ` ${prop?.type === 'boolean' ? ':' : ''}${key === 'model-value' ? 'v-model' : useKebabCase(key)}="${value}"`
  }
  if (props.code) {
    const lineBreaks = (props.code.match(/\n/g) || []).length
    if (lineBreaks > 1) {
      code += `>
  ${props.code}</${name}>`
    } else {
      code += `>${props.code}</${name}>`
    }
  } else {
    code += ' />'
  }
  code += `
\`\`\`
`
  return code
})

const { data: ast } = await useAsyncData(`${name}-ast-${JSON.stringify(componentProps)}`, () => transformContent('content:_markdown.md', code.value, {
  highlight: {
    theme: {
      dark: 'one-dark-pro',
      default: 'one-dark-pro'
    }
  }
}), { watch: [code] })
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
