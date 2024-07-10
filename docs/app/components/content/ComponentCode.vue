<script setup lang="ts">
import json5 from 'json5'
import { upperFirst, camelCase } from 'scule'
import * as theme from '#build/ui'

const props = defineProps<{
  ignore?: string[]
  items?: { [key: string]: string[] }
  props?: { [key: string]: any }
  slots?: { [key: string]: any }
}>()

const route = useRoute()
const { $prettier } = useNuxtApp()

const camelName = camelCase(route.params.slug[route.params.slug.length - 1])
const name = `U${upperFirst(camelName)}`

const componentProps = reactive({ ...(props.props || {}) })

const componentTheme = theme[camelName]
const meta = await fetchComponentMeta(name as any)

const options = computed(() => Object.keys(props.props || {}).filter((key) => {
  return !props.ignore?.includes(key)
}).map((key) => {
  const prop = meta?.meta?.props?.find((prop: any) => prop.name === key)
  const items = props.items?.[key]?.length
    ? props.items[key].map(item => ({
      value: item,
      label: item
    }))
    : prop?.type === 'boolean'
      ? [{ value: true, label: 'true' }, { value: false, label: 'false' }]
      : Object.keys(componentTheme.variants?.[key] || {}).map(variant => ({
        value: variant,
        label: variant,
        chip: key === 'color' ? { color: variant } : undefined
      })).filter(variant => key === 'color' ? !['error'].includes(variant.value) : true)

  return {
    name: key,
    label: key,
    items
  }
}))

const code = computed(() => {
  let code = `\`\`\`vue
<template>
<${name}`
  for (const [key, value] of Object.entries(componentProps)) {
    if (value === undefined || value === null || value === '') {
      continue
    }

    const prop = meta?.meta?.props?.find((prop: any) => prop.name === key)

    if (typeof value === 'boolean') {
      if (value && prop?.default === 'true') {
        continue
      }
      if (!value && !prop?.default) {
        continue
      }

      code += value ? ` ${key}` : ` :${key}="false"`
    } else if (typeof value === 'object') {
      code += ` :${key}="${json5.stringify(value, null, 2).replace(/,([ |\t\n]+[}|\])])/g, '$1')}"`
    } else {
      const propDefault = prop && (prop.default ?? prop.tags?.find(tag => tag.name === 'defaultValue')?.text ?? componentTheme?.defaultVariants?.[prop.name])
      if (propDefault === value) {
        continue
      }

      code += ` ${key}="${value}"`
    }
  }

  if (props.slots) {
    const hasOnlyDefaultSlot = props.slots && Object.keys(props.slots).length === 1 && props.slots.default

    if (hasOnlyDefaultSlot) {
      code += `>${props.slots.default}</${name}>`
    } else {
      code += `>
  ${Object.entries(props.slots).map(([key, value]) => `<template #${key}>
    ${value}
  </template>`).join('\n  ')}
</${name}>`
    }
  } else {
    code += ' />'
  }
  code += `\n</template>
\`\`\`
`

  return code
})

const { data: ast } = await useAsyncData(`${name}-code-${JSON.stringify({ props: componentProps, slots: props.slots })}`, async () => {
  let formatted = ''
  try {
    formatted = await $prettier.format(code.value)
  } catch (e) {
    formatted = code.value
  }

  return parseMarkdown(formatted)
}, { watch: [code] })
</script>

<template>
  <div>
    <div v-if="options.length" class="flex items-center gap-2.5 border border-gray-300 dark:border-gray-700 border-b-0 relative rounded-t-md px-4 py-2.5">
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
            v-model="componentProps[option.name]"
            :items="option.items"
            value-key="value"
            color="gray"
            variant="soft"
            class="rounded rounded-l-none"
            :search="false"
            :class="[option.name === 'color' && 'pl-6']"
            :ui="{ itemLeadingChip: 'size-2' }"
          >
            <template v-if="option.name === 'color'" #leading="{ modelValue, ui }">
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
          <UInput v-else v-model="componentProps[option.name]" color="gray" variant="soft" :ui="{ base: 'rounded rounded-l-none' }" />
        </UFormField>
      </template>
    </div>

    <div class="flex border border-b-0 border-gray-300 dark:border-gray-700 relative p-4" :class="[!options.length && 'rounded-t-md']">
      <component :is="name" v-bind="componentProps">
        <template v-for="slot in Object.keys(slots || {})" :key="slot" #[slot]>
          <ContentSlot :name="slot" unwrap="p">
            {{ slots[slot] }}
          </ContentSlot>
        </template>
      </component>
    </div>
  </div>

  <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" class="[&>div>pre]:!rounded-t-none [&>div]:!mt-0" />
</template>
