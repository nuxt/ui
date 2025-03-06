<script setup lang="ts">
import type { PropertyMeta } from 'vue-component-meta'

const props = defineProps<{
  prop: PropertyMeta
}>()

const links = computed(() => props.prop.tags?.filter((tag: any) => tag.name === 'link'))
</script>

<template>
  <ProseUl v-if="links?.length">
    <ProseLi v-for="(link, index) in links" :key="index">
      <ProseA :href="link.text" target="_blank" class="my-1">
        {{ link.text }}
      </ProseA>
    </ProseLi>
  </ProseUl>
</template>
