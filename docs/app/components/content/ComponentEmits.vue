<script setup lang="ts">
import { upperFirst, camelCase } from 'scule'

const props = defineProps<{
  prose?: boolean
}>()

const route = useRoute()

const camelName = camelCase(route.params.slug?.[route.params.slug.length - 1] ?? '')
const name = !props.prose ? `U${upperFirst(camelName)}` : `Prose${upperFirst(camelName)}`

const meta = await fetchComponentMeta(name as any)
</script>

<template>
  <ProseTable>
    <ProseThead>
      <ProseTr>
        <ProseTh>
          Event
        </ProseTh>
        <ProseTh>
          Type
        </ProseTh>
      </ProseTr>
    </ProseThead>
    <ProseTbody>
      <ProseTr v-for="event in (meta?.meta?.events || [])" :key="event.name">
        <ProseTd>
          <ProseCode>
            {{ event.name }}
          </ProseCode>
        </ProseTd>
        <ProseTd>
          <HighlightInlineType v-if="event.type" :type="event.type" />
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
