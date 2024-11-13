<script setup lang="ts">
import { camelCase } from 'scule'
import { get, set } from '#ui/utils'

const props = withDefaults(defineProps<{
  name: string
  class?: any
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
}>(), {
  preview: true,
  source: true
})

const slots = defineSlots<{
  options(props?: {}): any
}>()

const { $prettier } = useNuxtApp()

const camelName = camelCase(props.name)

const data = await fetchComponentExample(camelName)

const componentProps = reactive({ ...(props.props || {}) })

const code = computed(() => {
  let code = ''

  if (props.collapse) {
    code += `::code-collapse
`
  }

  code += `\`\`\`vue ${props.preview ? '' : ` [${data.pascalName}.vue]`}${props.highlights?.length ? `{${props.highlights.join('-')}}` : ''}
${data?.code ?? ''}
\`\`\``

  if (props.collapse) {
    code += `
::`
  }

  return code
})

const { data: ast } = await useAsyncData(`component-example-${camelName}`, async () => {
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
</script>

<template>
  <div class="my-5">
    <template v-if="preview">
      <div class="border border-[var(--ui-border-muted)] relative z-[1]" :class="[{ 'border-b-0 rounded-t-[calc(var(--ui-radius)*1.5)]': props.source, 'rounded-[calc(var(--ui-radius)*1.5)]': !props.source }]">
        <div v-if="props.options?.length || !!slots.options" class="flex gap-4 p-4 border-b border-[var(--ui-border-muted)]">
          <slot name="options" />

          <UFormField
            v-for="option in props.options"
            :key="option.name"
            :label="option.label"
            :name="option.name"
            size="sm"
            class="inline-flex ring ring-[var(--ui-border-accented)] rounded-[var(--ui-radius)]"
            :ui="{
              wrapper: 'bg-[var(--ui-bg-elevated)]/50 rounded-l-[var(--ui-radius)] flex border-r border-[var(--ui-border-accented)]',
              label: 'text-[var(--ui-text-muted)] px-2 py-1.5',
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
              class="rounded-[var(--ui-radius)] rounded-l-none min-w-12"
              :multiple="option.multiple"
              :class="[option.name.toLowerCase().endsWith('color') && 'pl-6']"
              :ui="{ itemLeadingChip: 'size-2' }"
              @update:model-value="set(optionsValues, option.name, $event)"
            >
              <template v-if="option.name.toLowerCase().endsWith('color')" #leading="{ modelValue, ui }">
                <UChip
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
              :model-value="get(optionsValues, option.name)"
              color="neutral"
              variant="soft"
              :ui="{ base: 'rounded-[var(--ui-radius)] rounded-l-none min-w-12' }"
              @update:model-value="set(optionsValues, option.name, $event)"
            />
          </UFormField>
        </div>

        <div class="flex justify-center p-4" :class="props.class">
          <component :is="camelName" v-bind="{ ...componentProps, ...optionsValues }" />
        </div>
      </div>
    </template>

    <MDCRenderer v-if="ast && props.source" :body="ast.body" :data="ast.data" class="[&_pre]:!rounded-t-none [&_div.my-5]:!mt-0" />
  </div>
</template>
