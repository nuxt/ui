<template>
  <div>
    <div v-if="propsToSelect.length" class="relative flex border border-gray-200 dark:border-gray-700 rounded-t-md overflow-hidden not-prose">
      <div v-for="prop in propsToSelect" :key="prop.name" class="flex flex-col gap-0.5 justify-between py-1.5 font-medium bg-gray-50 dark:bg-gray-800 border-r border-r-gray-200 dark:border-r-gray-700">
        <label :for="`prop-${prop.name}`" class="block text-xs px-2.5 font-medium text-gray-400 dark:text-gray-500 -my-px">{{ prop.label }}</label>
        <UCheckbox
          v-if="prop.type.startsWith('boolean')"
          v-model="componentProps[prop.name]"
          :name="`prop-${prop.name}`"
          tabindex="-1"
          class="justify-center"
        />
        <USelectMenu
          v-else-if="prop.options.length && prop.name !== 'label'"
          v-model="componentProps[prop.name]"
          :options="prop.options"
          :name="`prop-${prop.name}`"
          variant="none"
          class="inline-flex"
          :ui-menu="{ width: 'w-32 !-mt-px', rounded: 'rounded-t-none' }"
          select-class="py-0"
          tabindex="-1"
          :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
        />
        <UInput
          v-else
          :model-value="componentProps[prop.name]"
          :type="prop.type === 'number' ? 'number' : 'text'"
          :name="`prop-${prop.name}`"
          variant="none"
          autocomplete="off"
          input-class="py-0"
          tabindex="-1"
          @update:model-value="val => componentProps[prop.name] = prop.type === 'number' ? Number(val) : val"
        />
      </div>
    </div>

    <div class="flex border border-b-0 border-gray-200 dark:border-gray-700 relative not-prose" :class="[{ 'p-4': padding }, propsToSelect.length ? 'border-t-0' : 'rounded-t-md', backgroundClass, overflowClass]">
      <component :is="name" v-model="vModel" v-bind="fullProps">
        <ContentSlot v-if="$slots.default" :use="$slots.default" />

        <template v-for="slot in Object.keys(slots || {})" :key="slot" #[slot]>
          <ContentSlot :name="slot" />
        </template>
      </component>
    </div>

    <ContentRenderer v-if="!previewOnly" :value="ast" class="[&>div>pre]:!rounded-t-none" />
  </div>
</template>

<script setup lang="ts">
// @ts-expect-error
import { transformContent } from '@nuxt/content/transformers'
// @ts-ignore
import { useShikiHighlighter } from '@nuxtjs/mdc/runtime'

// eslint-disable-next-line vue/no-dupe-keys
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
  code: {
    type: String,
    default: null
  },
  slots: {
    type: Object,
    default: null
  },
  baseProps: {
    type: Object,
    default: () => ({})
  },
  ui: {
    type: Object,
    default: () => ({})
  },
  excludedProps: {
    type: Array,
    default: () => []
  },
  extraColors: {
    type: Array,
    default: () => []
  },
  backgroundClass: {
    type: String,
    default: 'bg-white dark:bg-gray-900'
  },
  overflowClass: {
    type: String,
    default: ''
  },
  previewOnly: {
    type: Boolean,
    default: false
  }
})

// eslint-disable-next-line vue/no-dupe-keys
const baseProps = reactive({ ...props.baseProps })
const componentProps = reactive({ ...props.props })

const appConfig = useAppConfig()
const route = useRoute()
// eslint-disable-next-line vue/no-dupe-keys
const slug = props.slug || route.params.slug[route.params.slug.length - 1]
const camelName = useCamelCase(slug)
const name = `U${useUpperFirst(camelName)}`

const meta = await fetchComponentMeta(name)

// Computed

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => ({ ...appConfig.ui[camelName], ...props.ui }))

const fullProps = computed(() => ({ ...baseProps, ...componentProps }))
const vModel = computed({
  get: () => baseProps.modelValue,
  set: (value) => {
    baseProps.modelValue = value
  }
})

const propsToSelect = computed(() => Object.keys(componentProps).map((key) => {
  if (props.excludedProps.includes(key)) {
    return null
  }

  const prop = meta?.meta?.props?.find((prop: any) => prop.name === key)
  const dottedKey = useKebabCase(key).replaceAll('-', '.')
  const keys = useGet(ui.value, dottedKey, {})
  let options = typeof keys === 'object' && Object.keys(keys)
  if (key.toLowerCase().endsWith('color')) {
    // @ts-ignore
    options = [...appConfig.ui.colors, ...props.extraColors]
  }

  return {
    type: prop?.type || 'string',
    name: key,
    label: key === 'modelValue' ? 'value' : useCamelCase(key),
    options
  }
}).filter(Boolean))

// eslint-disable-next-line vue/no-dupe-keys
const code = computed(() => {
  let code = `\`\`\`html
<${name}`
  for (const [key, value] of Object.entries(componentProps)) {
    if (value === 'undefined' || value === null) {
      continue
    }

    code += ` ${(typeof value === 'boolean' && value !== true) || typeof value === 'object' || typeof value === 'number' ? ':' : ''}${key === 'modelValue' ? 'value' : useKebabCase(key)}${typeof value === 'boolean' && !!value && key !== 'modelValue' ? '' : `="${typeof value === 'object' ? renderObject(value) : value}"`}`
  }

  if (props.slots) {
    code += `>
  ${Object.entries(props.slots).map(([key, value]) => `<template #${key}>
    ${value}
  </template>`).join('\n  ')}
</${name}>`
  } else if (props.code) {
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

function renderObject (obj: any) {
  if (Array.isArray(obj)) {
    return `[${obj.map(renderObject).join(', ')}]`
  }

  if (typeof obj === 'object') {
    return `{ ${Object.entries(obj).map(([key, value]) => `${key}: ${renderObject(value)}`).join(', ')} }`
  }

  if (typeof obj === 'string') {
    return `'${obj}'`
  }

  return obj
}

const shikiHighlighter = useShikiHighlighter({})
const codeHighlighter = async (code: string, lang: string, theme: any, highlights: any) => {
  const styleMap = {}
  const { tree, className } = await shikiHighlighter.getHighlightedAST(code, lang, theme, { styleMap, highlights })
  return {
    tree,
    className,
    style: shikiHighlighter.generateStyles(styleMap),
    styleMap
  }
}
const { data: ast } = await useAsyncData(`${name}-ast-${JSON.stringify({ props: componentProps, slots: props.slots })}`, () => transformContent('content:_markdown.md', code.value, {
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
}), { watch: [code] })
</script>
