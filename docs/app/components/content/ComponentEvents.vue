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
          Event
        </ProseTh>
        <ProseTh>
          Type
        </ProseTh>
      </ProseTr>
    </ProseThead>
    <ProseTbody>
      <ProseTr v-for="event in meta.events" :key="event.name">
        <ProseTd>
          <ProseCodeInline>
            {{ event.name }}
          </ProseCodeInline>
        </ProseTd>
        <ProseTd>
          <HighlightInlineType v-if="event.type" :type="event.type" />
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
