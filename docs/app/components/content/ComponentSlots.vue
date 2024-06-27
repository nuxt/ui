<script setup lang="ts">
import { upperFirst, camelCase } from 'scule'
import type { ComponentMeta } from 'vue-component-meta'

const route = useRoute()

const camelName = camelCase(route.params.slug[route.params.slug.length - 1])
const name = `U${upperFirst(camelName)}`

const componentMeta = await useComponentMeta(name as any)

const meta: ComputedRef<ComponentMeta> = computed(() => componentMeta.value.meta)
</script>

<template>
  <ProseTable>
    <ProseThead>
      <ProseTr>
        <ProseTh>
          Slot
        </ProseTh>
        <ProseTh>
          Type
        </ProseTh>
      </ProseTr>
    </ProseThead>
    <ProseTbody>
      <ProseTr v-for="slot in meta.slots" :key="slot.name">
        <ProseTd>
          <ProseCodeInline>
            {{ slot.name }}
          </ProseCodeInline>
        </ProseTd>
        <ProseTd>
          <HighlightInlineType v-if="slot.type" :type="slot.type" />

          <ProseP class="mt-1 mb-0 text-gray-500 dark:text-gray-400">
            {{ slot.description }}
          </ProseP>
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
