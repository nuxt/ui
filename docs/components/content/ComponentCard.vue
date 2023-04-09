<template>
  <div class="[&>pre]:!rounded-t-none">
    <div class="border border-b-0 rounded-t-md u-border-gray-300" :class="{ 'p-4': padding }">
      <component :is="name" v-bind="fullProps">
        <ContentSlot v-if="$slots.default" :use="$slots.default" unwrap="p" />
      </component>

      <ContentSlot v-if="$slots.action" :use="$slots.action" unwrap="p" />
    </div>

    <ContentSlot v-if="$slots.code" :use="$slots.code" />
    <ContentRenderer v-else :value="ast" class="[&>pre]:!rounded-t-none" />
  </div>
</template>

<script setup lang="ts">
import { transformContent } from '@nuxt/content/transformers'

const props = defineProps({
  name: {
    type: String,
    required: true
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
  }
})

const name = `U${useCapitalize(props.name)}`

const componentProps = toRef(props, 'props')
const fullProps = computed(() => ({ ...props.baseProps, ...componentProps.value }))

const { data: meta } = await useAsyncData(`${name}-meta`, () => $fetch(`/api/component-meta/${name}`))

// Computed

const code = computed(() => {
  let code = `\`\`\`vue
<${name}`
  for (const [key, value] of Object.entries(fullProps.value)) {
    const name = useKebabCase(key)
    const prop = meta.value.meta.props.find((prop: any) => prop.name === name)
    if (!prop) {
      continue
    }

    code += ` ${prop.type === 'boolean' ? ':' : ''}${key === 'model-value' ? 'v-model' : key}="${value}"`
  }
  code += ` />
  \`\`\`
  `
  return code
})

const { data: ast } = await useAsyncData(() => transformContent('content:_markdown.md', code.value), { watch: [code] })
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
