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
          <ProseCodeInline class="text-primary-500 dark:text-primary-400">
            {{ slot.name }}
          </ProseCodeInline>
        </ProseTd>
        <ProseTd>
          <HighlightInlineType v-if="slot.type" :type="slot.type" />

          <MDC v-if="slot.description" :value="slot.description" class="text-gray-600 dark:text-gray-300 mt-1" />
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
