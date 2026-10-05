<script setup lang="ts">
import type { PropertyMeta } from 'vue-component-meta'

const props = defineProps<{
  prop: PropertyMeta
}>()

const links = computed(() => props.prop.tags?.filter((tag: any) => tag.name === 'link' || tag.name === 'see'))
</script>

<template>
  <ProseUl v-if="links?.length">
    <ProseLi v-for="(link, index) in links" :key="index">
      <DocsMarkdown :value="link.text ?? ''" class="my-1" />
    </ProseLi>
  </ProseUl>
</template>
