<script setup lang="ts">
import { upperFirst, camelCase } from 'scule'

const props = defineProps<{
  prose?: boolean
  slug?: string
}>()

const route = useRoute()

const camelName = camelCase(props.slug ?? route.path.split('/').pop() ?? '')
const name = `${props.prose ? 'Prose' : 'U'}${upperFirst(camelName)}`

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
      <ProseTr v-for="slot in (meta?.meta?.slots || [])" :key="slot.name">
        <ProseTd>
          <ProseCode>
            {{ slot.name }}
          </ProseCode>
        </ProseTd>
        <ProseTd>
          <HighlightInlineType v-if="slot.type" :type="slot.type" />

          <MDC v-if="slot.description" :value="slot.description" class="text-(--ui-text-toned) mt-1" />
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
