<template>
  <div class="[&>pre]:!rounded-t-none [&>pre]:whitespace-pre-wrap">
    <div v-if="propsToSelect.length" class="relative flex border border-gray-200 dark:border-gray-700 rounded-t-md overflow-hidden not-prose">
      <div v-for="prop in propsToSelect" :key="prop.name" class="flex flex-col gap-0.5 justify-between py-1.5 font-medium bg-gray-50 dark:bg-gray-800 border-r border-r-gray-200 dark:border-r-gray-700">
        <label :for="prop.name" class="block text-xs px-4 font-medium u-text-gray-400 -my-px">{{ useCamelCase(prop.name) }}</label>
        <UCheckbox
          v-if="prop.type === 'boolean'"
          v-model="componentProps[prop.name]"
          :name="prop.name"
          appearance="none"
          class="justify-center"
        />
        <USelect
          v-else-if="prop.type === 'string' && prop.options.length"
          v-model="componentProps[prop.name]"
          :options="prop.options"
          :name="prop.name"
          appearance="none"
          custom-class="!py-0"
        />
        <UInput
          v-else
          v-model="componentProps[prop.name]"
          :type="prop.type === 'number' ? 'number' : 'text'"
          :name="prop.name"
          appearance="none"
          autocomplete="off"
          custom-class="!py-0"
        />
      </div>
    </div>

    <div class="flex border border-b-0 border-gray-200 dark:border-gray-700 relative not-prose" :class="[{ 'p-4': padding }, propsToSelect.length ? 'border-t-0' : 'rounded-t-md']">
      <component :is="name" v-model="vModel" v-bind="fullProps">
        <ContentSlot v-if="$slots.default" :use="$slots.default" />
      </component>

      <UButton v-if="trigger" label="Click" @click="vModel = true" />
    </div>

    <ContentSlot v-if="$slots.code" :use="$slots.code" />
    <ContentRenderer v-else :value="ast" class="[&>pre]:!rounded-t-none [&>pre]:whitespace-pre-wrap" />
  </div>
</template>

<script setup lang="ts">
import { transformContent } from '@nuxt/content/transformers'
import { defu } from 'defu'

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
  },
  excludeProps: {
    type: Array,
    default: () => []
  },
  trigger: {
    type: Boolean,
    default: false
  }
})

const baseProps = reactive({ ...props.baseProps })
const componentProps = reactive({ ...props.props })

const appConfig = useAppConfig()
const route = useRoute()
const slug = props.slug || route.params.slug[1]
const camelName = useCamelCase(slug)
const name = `U${useUpperFirst(camelName)}`

const { data: meta } = await useAsyncData(`${name}-meta`, () => $fetch(`/api/component-meta/${name}`))

// Computed

const ui = computed(() => defu({}, props.ui, appConfig.ui[camelName]))

const fullProps = computed(() => ({ ...props.baseProps, ...componentProps }))
const vModel = computed({
  get: () => baseProps.modelValue,
  set: (value) => {
    baseProps.modelValue = value
  }
})

const propsToSelect = computed(() => Object.keys(componentProps).map((key) => {
  if (props.excludeProps.includes(key)) {
    return null
  }

  const prop = meta.value.meta.props.find((prop: any) => prop.name === key)
  const dottedKey = useKebabCase(key).replaceAll('-', '.')
  const keys = useGet(ui.value, dottedKey, {})
  let options = Object.keys(keys) // .filter(key => typeof keys[key] === 'string')

  if (key.toLowerCase().endsWith('color')) {
    options = [
      ...appConfig.ui.colors,
      ...options
    ]
  }

  return {
    type: prop?.type || 'string',
    name: key,
    options
  }
}).filter(Boolean))

const code = computed(() => {
  let code = `\`\`\`html
<${name}`
  for (const [key, value] of Object.entries(componentProps)) {
    if (!value) {
      continue
    }

    const prop = meta.value.meta.props.find((prop: any) => prop.name === key)

    code += ` ${prop?.type === 'boolean' && value === 'false' ? ':' : ''}${key === 'modelValue' ? 'v-model' : useKebabCase(key)}${prop?.type === 'boolean' && !!value && key !== 'modelValue' ? '' : `="${value}"`}`
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
