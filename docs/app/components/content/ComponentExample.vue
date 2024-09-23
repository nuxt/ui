<script setup lang="ts">
import { camelCase } from 'scule'

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
    name: string
    label: string
    items: any[]
    default: any
    multiple: boolean
  }>
}>(), {
  preview: true,
  source: true
})

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

  code += `\`\`\`vue${props.preview ? '' : ` [${data.pascalName}.vue]`}
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
      singleQuote: true
    })
  } catch {
    formatted = code.value
  }

  return parseMarkdown(formatted)
}, { watch: [code] })

const optionsValues = ref(props.options?.reduce((acc, option) => {
  if (option.name) {
    acc[option.name] = option.default
  }
  return acc
}, {} as Record<string, any>) || {})
</script>

<template>
  <div class="my-5">
    <div v-if="preview">
      <div class="border border-gray-300 dark:border-gray-700 relative z-[1]" :class="[{ 'border-b-0 rounded-t-md': props.source, 'rounded-md': !props.source }]">
        <div v-if="props.options?.length" class="flex gap-4 p-4 border-b border-gray-300 dark:border-gray-700">
          <UFormField
            v-for="option in props.options"
            :key="option.name"
            :label="option.label"
            :name="option.name"
            size="sm"
            class="inline-flex ring ring-gray-300 dark:ring-gray-700 rounded"
            :ui="{
              wrapper: 'bg-gray-50 dark:bg-gray-800/50 rounded-l flex border-r border-gray-300 dark:border-gray-700',
              label: 'text-gray-500 dark:text-gray-400 px-2 py-1.5',
              container: 'mt-0'
            }"
          >
            <USelectMenu
              v-model="optionsValues[option.name]"
              :items="option.items"
              :search="false"
              color="gray"
              variant="soft"
              class="rounded rounded-l-none min-w-12"
              multiple
            />
          </UFormField>
        </div>

        <div class="flex justify-center p-4" :class="props.class">
          <component :is="camelName" v-bind="{ ...componentProps, ...optionsValues }" />
        </div>
      </div>
    </div>

    <MDCRenderer v-if="ast && props.source" :body="ast.body" :data="ast.data" class="[&_pre]:!rounded-t-none [&_div.my-5]:!mt-0" />
  </div>
</template>
