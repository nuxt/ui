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

    <div class="flex border border-b-0 border-gray-200 dark:border-gray-700 relative not-prose" :class="[{ 'p-4': padding }, propsToSelect.length ? 'border-t-0' : 'rounded-t-md', backgroundClass, extraClass]">
      <component :is="name" v-model="vModel" v-bind="fullProps" :class="componentClass">
        <ContentSlot v-if="$slots.default" :use="$slots.default" />

        <template v-for="slot in Object.keys(slots || {})" :key="slot" #[slot]>
          <ContentSlot :name="slot" unwrap="p" />
        </template>
      </component>
    </div>

    <ContentRenderer v-if="!previewOnly" :value="ast" class="[&>div>pre]:!rounded-t-none [&>div>pre]:!mt-0" />
  </div>
</template>

<script setup lang="ts">
import { upperFirst, camelCase, kebabCase } from 'scule'
import { useShikiHighlighter } from '~/composables/useShikiHighlighter'

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
  options: {
    type: Array as PropType<{ name: string, values: string[], restriction: 'expected' | 'included' | 'excluded' | 'only' }[]>,
    default: () => []
  },
  backgroundClass: {
    type: String,
    default: 'bg-white dark:bg-gray-900'
  },
  extraClass: {
    type: String,
    default: ''
  },
  previewOnly: {
    type: Boolean,
    default: false
  },
  componentClass: {
    type: String,
    default: ''
  },
  ignoreVModel: {
    type: Boolean,
    default: false
  }
})

const baseProps = reactive({ ...props.baseProps })
const componentProps = reactive({ ...props.props })

const { $prettier } = useNuxtApp()
const appConfig = useAppConfig()
const route = useRoute()
const highlighter = useShikiHighlighter()

let name = props.slug || `U${upperFirst(camelCase(route.params.slug[route.params.slug.length - 1]))}`

// TODO: Remove once merged on `main` branch
if (['AvatarGroup', 'ButtonGroup', 'MeterGroup'].includes(name)) {
  name = `U${name}`
}
if (['avatar-group', 'button-group', 'radio'].includes(name)) {
  name = `U${upperFirst(camelCase(name))}`
}

const meta = await fetchComponentMeta(name)

// Computed

const fullProps = computed(() => ({ ...componentProps, ...baseProps }))
const vModel = computed({
  get: () => baseProps.modelValue,
  set: (value) => {
    baseProps.modelValue = value
  }
})

const generateOptions = (key: string, schema: { kind: string, schema: [], type: string }) => {
  let options = []
  const optionItem = props?.options?.find(item => item?.name === key) || null
  const types = schema?.type?.split('|')?.map(item => item.trim()?.replaceAll('"', '')) || []
  const hasIgnoredTypes = types?.every(item => ['string', 'number', 'boolean', 'array', 'object', 'Function'].includes(item))

  if (key.toLowerCase().endsWith('color')) {
    options = [...appConfig.ui.colors]
  }

  const schemaOptions = Object.values(schema?.schema || {})

  if (key.toLowerCase() === 'size' && schemaOptions?.length > 0) {
    const baseSizeOrder = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }
    schemaOptions.sort((a: string, b: string) => {
      const aBase = a.match(/[a-z]+/i)[0].toLowerCase()
      const bBase = b.match(/[a-z]+/i)[0].toLowerCase()

      const aNum = Number.parseInt(a.match(/\d+/)?.[0]) || 1
      const bNum = Number.parseInt(b.match(/\d+/)?.[0]) || 1

      if (aBase === bBase) {
        return aBase === 'xs' ? bNum - aNum : aNum - bNum
      }

      return baseSizeOrder[aBase] - baseSizeOrder[bBase]
    })
  }

  if (schemaOptions?.length > 0 && schema?.kind === 'enum' && !hasIgnoredTypes && optionItem?.restriction !== 'only') {
    options = schemaOptions.filter(option => typeof option === 'string').map((option: string) => option.replaceAll('"', ''))
  }

  if (optionItem?.restriction === 'only') {
    options = optionItem.values
  }

  if (optionItem?.restriction === 'expected') {
    options = options.filter(item => optionItem.values.includes(item))
  }

  if (optionItem?.restriction === 'included') {
    options = [...options, ...optionItem.values]
  }

  if (optionItem?.restriction === 'excluded') {
    options = options.filter(item => !optionItem.values.includes(item))
  }

  return options
}

const propsToSelect = computed(() => Object.keys(componentProps).map((key) => {
  if (props.excludedProps.includes(key)) {
    return null
  }

  const prop = meta?.meta?.props?.find((prop: any) => prop.name === key)
  const schema = prop?.schema || {}
  const options = generateOptions(key, schema)

  return {
    type: prop?.type || 'string',
    name: key,
    label: key === 'modelValue' ? 'value' : camelCase(key),
    options
  }
}).filter(Boolean))

const code = computed(() => {
  let code = `\`\`\`html
<template>
<${name}`
  for (const [key, value] of Object.entries(fullProps.value)) {
    if (value === 'undefined' || value === null) {
      continue
    }
    if (key === 'modelValue' && props.ignoreVModel) {
      continue
    }

    code += ` ${(typeof value === 'boolean' && (value !== true || key === 'modelValue')) || typeof value === 'object' || typeof value === 'number' ? ':' : ''}${key === 'modelValue' ? 'model-value' : kebabCase(key)}${typeof value === 'boolean' && !!value && key !== 'modelValue' ? '' : `="${typeof value === 'object' ? renderObject(value) : value}"`}`
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
      code += `>${props.code.endsWith('>') ? `${props.code}\n` : props.code}</${name}>`
    }
  } else {
    code += ' />'
  }
  code += `\n</template>
\`\`\`
`
  return code
})

function renderObject(obj: any) {
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

const { data: ast } = await useAsyncData(`${name}-ast-${JSON.stringify({ props: componentProps, slots: props.slots, code: props.code })}`, async () => {
  let formatted = ''
  try {
    // @ts-ignore
    formatted = await $prettier.format(code.value, {
      trailingComma: 'none',
      semi: false,
      singleQuote: true
    })
  } catch {
    formatted = code.value
  }

  return parseMarkdown(formatted, {
    highlight: {
      highlighter,
      theme: {
        light: 'material-theme-lighter',
        default: 'material-theme',
        dark: 'material-theme-palenight'
      }
    }
  })
}, { watch: [code] })
</script>
