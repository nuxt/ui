<template>
  <div>
    <ULandingHero v-bind="page" align="center" />

    <div class="relative">
      <div class="sticky top-[calc(var(--header-height)+2rem)] flex items-center justify-center border border-gray-200/10 rounded-xl bg-gray-700/20 p-4 h-[calc(100vh-var(--header-height)-4rem)]">
        <!-- <ProAnimation class="flex-1 w-full" /> -->
        <div class="absolute top-[25%] w-96 h-96 inset-x-0 mx-auto bg-gradient-radial rounded-full from-primary to-white dark:to-gray-900 opacity-25 blur-2xl lg:scale-150 will-change-[filter]" />
      </div>

      <div class="h-[calc(100vh*5)]" />
    </div>

    <ULandingSection title="Features" />

    <ULandingSection class="!pt-0">
      <ULandingCTA title="CTA" card />
    </ULandingSection>

    <ULandingSection title="FAQ" />
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
