<template>
  <div>
    <UPageHero v-bind="page" align="center" />

    <ProAnimation />
  </div>
</template>


<script setup lang="ts">
definePageMeta({
  layout: 'pro'
})

const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())

useContentHead(page)
</script>
