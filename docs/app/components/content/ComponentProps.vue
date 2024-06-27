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
          <ProseCodeInline>
            {{ prop.name }}
          </ProseCodeInline>
        </ProseTd>
        <ProseTd>
          <ProseCodeInline v-if="prop.default">
            {{ prop.default }}
          </ProseCodeInline>
        </ProseTd>
        <ProseTd>
          <ProseCodeInline v-if="prop.type" lang="ts">
            {{ prop.type }}
          </ProseCodeInline>

          <ProseP class="mt-1 mb-0 text-gray-500 dark:text-gray-400">
            {{ prop.description }}
          </ProseP>
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
