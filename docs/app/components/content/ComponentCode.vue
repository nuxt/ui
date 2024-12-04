<!-- eslint-disable no-useless-escape -->
<script setup lang="ts">
import json5 from 'json5'
import { upperFirst, camelCase, kebabCase } from 'scule'
import { hash } from 'ohash'
import { CalendarDate } from '@internationalized/date'
import * as theme from '#build/ui'
import { get, set } from '#ui/utils'

interface Cast {
  get: (args: any) => any
  template: (args: any) => string
}

type CastDateValue = [number, number, number]

const castMap: Record<string, Cast> = {
  'DateValue': {
    get: (args: CastDateValue) => new CalendarDate(...args),
    template: (value: CalendarDate) => {
      return value ? `new CalendarDate(${value.year}, ${value.month}, ${value.day})` : 'null'
    }
  },
  'DateValue[]': {
    get: (args: CastDateValue[]) => args.map(date => new CalendarDate(...date)),
    template: (value: CalendarDate[]) => {
      return value ? `[${value.map(date => `new CalendarDate(${date.year}, ${date.month}, ${date.day})`).join(', ')}]` : '[]'
    }
  },
  'DateRange': {
    get: (args: { start: CastDateValue, end: CastDateValue }) => ({ start: new CalendarDate(...args.start), end: new CalendarDate(...args.end) }),
    template: (value: { start: CalendarDate, end: CalendarDate }) => {
      if (!value.start || !value.end) {
        return `{ start: null, end: null }`
      }

      return `{ start: new CalendarDate(${value.start.year}, ${value.start.month}, ${value.start.day}), end: new CalendarDate(${value.end.year}, ${value.end.month}, ${value.end.day}) }`
    }
  }
}

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
  /** List of props to use with `v-model` */
  model?: string[]
  /** List of props to cast from code and selection */
  cast?: { [key: string]: string }
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
  /**
   * A list of line numbers to highlight in the code block
   */
  highlights?: number[]
}>()

const route = useRoute()
const { $prettier } = useNuxtApp()

const camelName = camelCase(props.slug ?? route.params.slug?.[route.params.slug.length - 1] ?? '')
const name = `U${upperFirst(camelName)}`
const component = defineAsyncComponent(() => import(`#ui/components/${upperFirst(camelName)}.vue`))

const componentProps = reactive({
  ...Object.fromEntries(Object.entries(props.props || {}).map(([key, value]) => {
    const cast = props.cast?.[key]

    if (cast && !castMap[cast]) {
      throw new Error(`Unknown cast: ${cast}`)
    }

    return [key, cast ? castMap[cast]!.get(value) : value]
  }))
})
const componentEvents = reactive({
  ...Object.fromEntries((props.model || []).map(key => [`onUpdate:${key}`, (e: any) => setComponentProp(key, e)])),
  ...(componentProps.modelValue ? { [`onUpdate:modelValue`]: (e: any) => setComponentProp('modelValue', e) } : {})
})

function getComponentProp(name: string) {
  return get(componentProps, name) ?? undefined
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
      : prop?.type === 'boolean' || prop?.type === 'boolean | undefined'
        ? [{ value: true, label: 'true' }, { value: false, label: 'false' }]
        : Object.keys(componentTheme?.variants?.[key] || {}).map(variant => ({
          value: variant,
          label: variant,
          chip: key.toLowerCase().endsWith('color') ? { color: variant } : undefined
        }))

    return {
      name: key,
      label: key,
      type: props?.cast?.[key] ?? prop?.type,
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

  code += `\`\`\`vue${props.highlights?.length ? ` {${props.highlights.join('-')}}` : ''}`

  if (props.external?.length) {
    code += `
<script setup lang="ts">
`
    for (const key of props.external) {
      const cast = props.cast?.[key]
      const value = cast ? castMap[cast]!.template(componentProps[key]) : json5.stringify(componentProps[key], null, 2).replace(/,([ |\t\n]+[}|\]])/g, '$1')

      code += `const ${key === 'modelValue' ? 'value' : key} = ref(${value})
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

    if (props.model?.includes(key)) {
      code += ` v-model:${key}="${key}"`
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

      code += ` ${typeof value === 'number' ? ':' : ''}${name}="${value}"`
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

const { data: ast } = await useAsyncData(`component-code-${name}-${hash({ props: componentProps, slots: props.slots })}`, async () => {
  if (!props.prettier) {
    return parseMarkdown(code.value)
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

  return parseMarkdown(formatted)
}, { watch: [code] })
</script>

<template>
  <div class="my-5">
    <div>
      <div v-if="options.length" class="flex items-center gap-2.5 border border-[var(--ui-border-muted)] border-b-0 relative rounded-t-[calc(var(--ui-radius)*1.5)] px-4 py-2.5 overflow-x-auto">
        <template v-for="option in options" :key="option.name">
          <UFormField
            :label="option.label"
            size="sm"
            class="inline-flex ring ring-[var(--ui-border-accented)] rounded-[var(--ui-radius)]"
            :ui="{
              wrapper: 'bg-[var(--ui-bg-elevated)]/50 rounded-l-[var(--ui-radius)] flex border-r border-[var(--ui-border-accented)]',
              label: 'text-[var(--ui-text-muted)] px-2 py-1.5',
              container: 'mt-0'
            }"
          >
            <USelect
              v-if="option.items?.length"
              :model-value="getComponentProp(option.name)"
              :items="option.items"
              value-key="value"
              color="neutral"
              variant="soft"
              class="rounded-[var(--ui-radius)] rounded-l-none min-w-12"
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
            </USelect>
            <UInput
              v-else
              :type="option.type?.includes('number') ? 'number' : 'text'"
              :model-value="getComponentProp(option.name)"
              color="neutral"
              variant="soft"
              :ui="{ base: 'rounded-[var(--ui-radius)] rounded-l-none min-w-12' }"
              @update:model-value="setComponentProp(option.name, $event)"
            />
          </UFormField>
        </template>
      </div>

      <div v-if="component" class="flex justify-center border border-b-0 border-[var(--ui-border-muted)] relative p-4 z-[1]" :class="[!options.length && 'rounded-t-[calc(var(--ui-radius)*1.5)]', props.class]">
        <component :is="component" v-bind="{ ...componentProps, ...componentEvents }">
          <template v-for="slot in Object.keys(slots || {})" :key="slot" #[slot]>
            <slot :name="slot" mdc-unwrap="p">
              {{ slots?.[slot] }}
            </slot>
          </template>
        </component>
      </div>
    </div>

    <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" class="[&_pre]:!rounded-t-none [&_div.my-5]:!mt-0" />
  </div>
</template>
