<script setup lang="ts">
import { kebabCase } from 'scule'
import type { PropertyMeta } from 'vue-component-meta'

const props = defineProps<{
  prop: PropertyMeta
}>()

const route = useRoute()

const links = computed(() => props.prop.tags?.filter((tag: any) => tag.name === 'link'))
</script>

<template>
  <ProseUl v-if="links?.length">
    <ProseLi v-for="(link, index) in links" :key="index">
      <MDC :value="link.text ?? ''" class="my-1" :cache-key="`${kebabCase(route.path)}-${prop.name}-link-${index}`" />
    </ProseLi>
  </ProseUl>
</template>
