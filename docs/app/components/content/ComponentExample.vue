<script setup lang="ts">
import { camelCase } from 'scule'

const props = defineProps<{
  name: string
  props?: { [key: string]: any }
}>()

const camelName = camelCase(props.name)

const data = await fetchComponentExample(camelName)

const componentProps = reactive({ ...(props.props || {}) })

const { data: ast } = await useAsyncData(`component-example-${camelName}`, () => parseMarkdown(`\`\`\`vue\n${data?.code ?? ''}\n\`\`\``))
</script>

<template>
  <div>
    <div class="flex border border-b-0 border-gray-300 dark:border-gray-700 relative p-4 rounded-t-md">
      <component :is="camelName" v-bind="componentProps" />
    </div>
  </div>

  <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" class="[&>div>pre]:!rounded-t-none [&>div]:!mt-0" />
</template>
