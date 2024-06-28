<script setup lang="ts">
import { upperFirst, camelCase } from 'scule'
import type { ComponentMeta } from 'vue-component-meta'
import * as theme from '#build/ui'

const route = useRoute()

const camelName = camelCase(route.params.slug[route.params.slug.length - 1])
const name = `U${upperFirst(camelName)}`

const componentTheme = theme[camelName]
const componentMeta = await useComponentMeta(name as any)

const meta: ComputedRef<ComponentMeta> = computed(() => {
  const meta = componentMeta.value.meta

  if (meta.props?.length) {
    meta.props = meta.props.map((prop) => {
      prop.default = prop.default ?? componentTheme.defaultVariants?.[prop.name]
      return prop
    })
  }

  return meta
})

console.log('meta.value', meta.value)
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
      <ProseTr v-for="prop in meta.props" :key="prop.name">
        <ProseTd>
          <ProseCodeInline class="text-primary-500 dark:text-primary-400">
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
