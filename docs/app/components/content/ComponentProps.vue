<script setup lang="ts">
import { upperFirst, camelCase } from 'scule'
import type { ComponentMeta } from 'vue-component-meta'
import * as theme from '#build/ui'
import * as themePro from '#build/ui-pro'

const props = withDefaults(defineProps<{
  name?: string
  ignore?: string[]
  pro?: boolean
  prose?: boolean
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
    'onClick',
    'viewTransition'
  ]
})

const route = useRoute()

const camelName = camelCase(props.name ?? route.path.split('/').pop() ?? '')
const componentName = props.prose ? `Prose${upperFirst(camelName)}` : `U${upperFirst(camelName)}`

const componentTheme = ((props.pro ? props.prose ? themePro.prose : themePro : theme) as any)[camelName]
const meta = await fetchComponentMeta(componentName as any)

const metaProps: ComputedRef<ComponentMeta['props']> = computed(() => {
  if (!meta?.meta?.props?.length) {
    return []
  }

  return meta.meta.props.filter((prop) => {
    return !props.ignore?.includes(prop.name)
  }).map((prop) => {
    if (prop.default) {
      prop.default = prop.default.replace(' as never', '').replace(/^"(.*)"$/, '\'$1\'')
    } else {
      const tag = prop.tags?.find(tag => tag.name === 'defaultValue')?.text
      if (tag) {
        prop.default = tag
      } else if (componentTheme?.defaultVariants?.[prop.name]) {
        prop.default = typeof componentTheme?.defaultVariants?.[prop.name] === 'string' ? `'${componentTheme?.defaultVariants?.[prop.name]}'` : componentTheme?.defaultVariants?.[prop.name]
      }
    }

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

          <MDC v-if="prop.description" :value="prop.description" class="text-(--ui-text-toned) mt-1" />

          <ComponentPropsLinks v-if="prop.tags?.length" :prop="prop" />
          <ComponentPropsSchema v-if="prop.schema" :prop="prop" :ignore="ignore" />
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
