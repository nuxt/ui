<script setup lang="ts">
import { upperFirst, camelCase } from 'scule'
import type { ComponentMeta } from 'vue-component-meta'
import * as theme from '#build/ui'

const route = useRoute()

const camelName = camelCase(route.params.slug[route.params.slug.length - 1])
const name = `U${upperFirst(camelName)}`

const componentTheme = theme[camelName]
const meta = await fetchComponentMeta(name as any)

const metaProps: ComputedRef<ComponentMeta['props']> = computed(() => {
  if (!meta?.meta?.props?.length) {
    return []
  }

  return meta.meta.props.map((prop) => {
    prop.default = prop.default ?? prop.tags?.find(tag => tag.name === 'defaultValue')?.text ?? componentTheme?.defaultVariants?.[prop.name]
    return prop
  })
})
</script>

<template>
  <ProseTable>
    <ProseThead>
      <ProseTr>
        <ProseTh>
          Prop
        </ProseTh>
        <ProseTh>
          Default
        </ProseTh>
        <ProseTh>
          Type
        </ProseTh>
      </ProseTr>
    </ProseThead>
    <ProseTbody>
      <ProseTr v-for="prop in metaProps" :key="prop.name">
        <ProseTd>
          <ProseCodeInline>
            {{ prop.name }}
          </ProseCodeInline>
        </ProseTd>
        <ProseTd>
          <HighlightInlineType v-if="prop.default" :type="prop.default" />
        </ProseTd>
        <ProseTd>
          <HighlightInlineType v-if="prop.type" :type="prop.type" />

          <MDC v-if="prop.description" :value="prop.description" class="text-gray-600 dark:text-gray-300 mt-1" />
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
