<script setup lang="ts">
import { upperFirst, camelCase } from 'scule'

const route = useRoute()

const slug = Array.isArray(route.params.slug) ? route.params.slug[0] ?? '' : route.params.slug ?? ''
const camelName = camelCase(slug[slug.length - 1] ?? '')
const name = `U${upperFirst(camelName)}`

const meta = await fetchComponentMeta(name as any)
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
      <ProseTr v-for="slot in meta.meta.slots" :key="slot.name">
        <ProseTd>
          <ProseCodeInline>
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
