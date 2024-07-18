<script setup lang="ts">
import { camelCase } from 'scule'

const props = defineProps<{
  name: string
  props?: { [key: string]: any }
}>()

const { $prettier } = useNuxtApp()

const camelName = camelCase(props.name)

const data = await fetchComponentExample(camelName)

const componentProps = reactive({ ...(props.props || {}) })

const code = computed(() => `\`\`\`vue\n${data?.code ?? ''}\n\`\`\``)

const { data: ast } = await useAsyncData(`component-example-${camelName}`, async () => {
  let formatted = ''
  try {
    formatted = await $prettier.format(code.value, {
      trailingComma: 'none',
      semi: false,
      singleQuote: true
    })
  } catch (e) {
    formatted = code.value
  }

  return parseMarkdown(formatted)
}, { watch: [code] })
</script>

<template>
  <div class="my-5">
    <div>
      <div class="flex border border-b-0 border-gray-300 dark:border-gray-700 relative p-4 rounded-t-md">
        <component :is="camelName" v-bind="componentProps" />
      </div>
    </div>

    <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" class="[&>div>pre]:!rounded-t-none [&>div]:!mt-0" />
  </div>
</template>
