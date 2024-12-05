<script setup lang="ts">
import { upperFirst, camelCase } from 'scule'
import type { ComponentMeta } from 'vue-component-meta'
import * as theme from '#build/ui'
import * as themePro from '#build/ui-pro'

const props = withDefaults(defineProps<{
  ignore?: string[]
  pro?: boolean
}>(), {
  ignore: () => [
    'activeClass',
    'inactiveClass',
    'exactActiveClass',
    'ariaCurrentValue',
    'href',
    'rel',
    'noRel',
    'prefetch',
    'prefetchOn',
    'noPrefetch',
    'prefetchedClass',
    'replace',
    'exact',
    'exactQuery',
    'exactHash',
    'external',
    'onClick'
  ]
})

const route = useRoute()

const camelName = camelCase(route.params.slug?.[route.params.slug.length - 1] ?? '')
const name = `U${upperFirst(camelName)}`

const componentTheme = ((props.pro ? themePro : theme) as any)[camelName]
const meta = await fetchComponentMeta(name as any)

const metaProps: ComputedRef<ComponentMeta['props']> = computed(() => {
  if (!meta?.meta?.props?.length) {
    return []
  }

  return meta.meta.props.filter((prop) => {
    return !props.ignore?.includes(prop.name)
  }).map((prop) => {
    prop.default = prop.default ?? prop.tags?.find(tag => tag.name === 'defaultValue')?.text ?? componentTheme?.defaultVariants?.[prop.name]
    // @ts-expect-error - Type is not correct
    prop.type = !prop.type.startsWith('boolean') && prop.schema?.kind === 'enum' && Object.keys(prop.schema.schema)?.length ? Object.values(prop.schema.schema).map(schema => schema?.type ? schema.type : schema).join(' | ') : prop.type
    return prop
  }).sort((a, b) => {
    if (a.name === 'as') {
      return -1
    }

    if (b.name === 'as') {
      return 1
    }

    if (a.name === 'ui') {
      return 1
    }

    if (b.name === 'ui') {
      return -1
    }

    return 0
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
          <ProseCode>
            {{ prop.name }}
          </ProseCode>
        </ProseTd>
        <ProseTd>
          <HighlightInlineType v-if="prop.default" :type="prop.default" />
        </ProseTd>
        <ProseTd>
          <HighlightInlineType v-if="prop.type" :type="prop.type" />

          <MDC v-if="prop.description" :value="prop.description" class="text-[var(--ui-text-toned)] mt-1" />

          <ComponentPropsLinks v-if="prop.tags?.length" :prop="prop" />
          <ComponentPropsSchema v-if="prop.schema" :prop="prop" :ignore="ignore" />
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
