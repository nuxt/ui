<!-- eslint-disable no-useless-escape -->
<script setup lang="ts">
import json5 from 'json5'
import { upperFirst, camelCase, kebabCase } from 'scule'
import * as theme from '#build/ui'
import { get, set } from '#ui/utils'

const props = defineProps<{
  /** Override the slug taken from the route */
  slug?: string
  class?: any
  /** List of props to ignore in selection */
  ignore?: string[]
  /** List of props to hide from code and selection */
  hide?: string[]
  /** List of props to externalize in script setup */
  external?: string[]
  /** List of items for each prop */
  items?: { [key: string]: string[] }
  props?: { [key: string]: any }
  slots?: { [key: string]: any }
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
}>()

const route = useRoute()
const { $prettier } = useNuxtApp()

const camelName = camelCase(props.slug ?? route.params.slug?.[route.params.slug.length - 1] ?? '')
const name = `U${upperFirst(camelName)}`

const componentProps = reactive({ ...(props.props || {}) })

function getComponentProp(name: string) {
  return get(componentProps, name) || undefined
}

function setComponentProp(name: string, value: any) {
  set(componentProps, name, value)
}

const componentTheme = (theme as any)[camelName]
const meta = await fetchComponentMeta(name as any)

function mapKeys(obj: object, parentKey = ''): any {
  return Object.entries(obj || {}).flatMap(([key, value]: [string, any]) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      return mapKeys(value, key)
    }

    const fullKey = parentKey ? `${parentKey}.${key}` : key

    return !props.ignore?.includes(fullKey) && !props.hide?.includes(fullKey) ? fullKey : undefined
  }).filter(Boolean)
}

const options = computed(() => {
  const keys = mapKeys(props.props || {})

  return keys.map((key: string) => {
    const prop = meta?.meta?.props?.find((prop: any) => prop.name === key)
    const propItems = get(props.items, key, [])
    const items = propItems.length
      ? propItems.map((item: any) => ({
        value: item,
        label: item
      }))
      : prop?.type === 'boolean'
        ? [{ value: true, label: 'true' }, { value: false, label: 'false' }]
        : Object.keys(componentTheme?.variants?.[key] || {}).map(variant => ({
          value: variant,
          label: variant,
          chip: key.toLowerCase().endsWith('color') ? { color: variant } : undefined
        })).filter(variant => key.toLowerCase().endsWith('color') ? !['error'].includes(variant.value) : true)

    return {
      name: key,
      label: key,
      type: prop?.type,
      items
    }
  })
})

const code = computed(() => {
  let code = ''

  if (props.collapse) {
    code += `::code-collapse
`
  }

  code += `\`\`\`vue`

  if (props.external?.length) {
    code += `
<script setup lang="ts">
`
    for (const key of props.external) {
      code += `const ${key === 'modelValue' ? 'value' : key} = ref(${json5.stringify(componentProps[key], null, 2).replace(/,([ |\t\n]+[}|\]])/g, '$1')})
`
    }
    code += `<\/script>
`
  }

  code += `
<template>
  <${name}`
  for (const [key, value] of Object.entries(componentProps)) {
    if (key === 'modelValue') {
      code += ` v-model="value"`
      continue
    }

    if (value === undefined || value === null || value === '' || props.hide?.includes(key)) {
      continue
    }

    const prop = meta?.meta?.props?.find((prop: any) => prop.name === key)
    const name = kebabCase(key)

    if (typeof value === 'boolean') {
      if (value && prop?.default === 'true') {
        continue
      }
      if (!value && (!prop?.default || prop.default === 'false')) {
        continue
      }

      code += value ? ` ${name}` : ` :${key}="false"`
    } else if (typeof value === 'object') {
      const parsedValue = !props.external?.includes(key) ? json5.stringify(value, null, 2).replace(/,([ |\t\n]+[}|\])])/g, '$1') : key

      code += ` :${name}="${parsedValue}"`
    } else {
      const propDefault = prop && (prop.default ?? prop.tags?.find(tag => tag.name === 'defaultValue')?.text ?? componentTheme?.defaultVariants?.[prop.name])
      if (propDefault === value) {
        continue
      }

      code += ` ${prop?.type.includes('number') ? ':' : ''}${name}="${value}"`
    }
  }

  if (props.slots) {
    code += `>`
    for (const [key, value] of Object.entries(props.slots)) {
      if (key === 'default') {
        code += props.slots.default
      } else {
        code += `
  <template #${key}>
    ${value}
  </template>`
      }
    }
    code += (Object.keys(props.slots).length > 1 ? '\n' : '') + `</${name}>`
  } else {
    code += ' />'
  }
  code += `\n</template>
\`\`\`
`

  if (props.collapse) {
    code += `
::`
  }

  return code
})

const { data: ast } = await useAsyncData(`component-code-${name}-${JSON.stringify({ props: componentProps, slots: props.slots })}`, async () => {
  if (!props.prettier) {
    return parseMarkdown(code.value)
  }

  let formatted = ''
  try {
    formatted = await $prettier.format(code.value, {
      trailingComma: 'none',
      semi: false,
      singleQuote: true
    })
  } catch {
    formatted = code.value
  }

  return parseMarkdown(formatted)
}, { watch: [code] })
</script>

<template>
  <div class="my-5">
    <div>
      <div v-if="options.length" class="flex items-center gap-2.5 border border-gray-300 dark:border-gray-700 border-b-0 relative rounded-t-md px-4 py-2.5 overflow-x-auto">
        <template v-for="option in options" :key="option.name">
          <UFormField
            :label="option.label"
            size="sm"
            class="inline-flex ring ring-gray-300 dark:ring-gray-700 rounded"
            :ui="{
              wrapper: 'bg-gray-50 dark:bg-gray-800/50 rounded-l flex border-r border-gray-300 dark:border-gray-700',
              label: 'text-gray-500 dark:text-gray-400 px-2 py-1.5',
              container: 'mt-0'
            }"
          >
            <USelectMenu
              v-if="option.items?.length"
              :model-value="getComponentProp(option.name)"
              :items="option.items"
              value-key="value"
              color="gray"
              variant="soft"
              class="rounded rounded-l-none min-w-12"
              :search="false"
              :class="[option.name.toLowerCase().endsWith('color') && 'pl-6']"
              :ui="{ itemLeadingChip: 'size-2' }"
              @update:model-value="setComponentProp(option.name, $event)"
            >
              <template v-if="option.name.toLowerCase().endsWith('color')" #leading="{ modelValue, ui }">
                <UChip
                  v-if="modelValue"
                  inset
                  standalone
                  :color="(modelValue as any)"
                  :size="ui.itemLeadingChipSize()"
                  class="size-2"
                />
              </template>
            </USelectMenu>
            <UInput
              v-else
              :type="option.type?.includes('number') ? 'number' : 'text'"
              :model-value="getComponentProp(option.name)"
              color="gray"
              variant="soft"
              :ui="{ base: 'rounded rounded-l-none min-w-12' }"
              @update:model-value="setComponentProp(option.name, $event)"
            />
          </UFormField>
        </template>
      </div>

      <div class="flex border border-b-0 border-gray-300 dark:border-gray-700 relative p-4 z-[1]" :class="[!options.length && 'rounded-t-md', props.class]">
        <component :is="name" v-bind="componentProps" @update:model-value="!!componentProps.modelValue && setComponentProp('modelValue', $event)">
          <template v-for="slot in Object.keys(slots || {})" :key="slot" #[slot]>
            <ContentSlot :name="slot" unwrap="p">
              {{ slots?.[slot] }}
            </ContentSlot>
          </template>
        </component>
      </div>
    </div>

    <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" class="[&_pre]:!rounded-t-none [&_div.my-5]:!mt-0" />
  </div>
</template>
