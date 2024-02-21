<script setup lang="ts">
const id = 'nuxt-ui-banner-1'
const to = '/pro/pricing'

const timeAgo = useTimeAgo(new Date('2024-02-25T22:00:00'))

const hideBanner = () => {
  localStorage.setItem(id, 'true')

  document.querySelector('html')?.classList.add('hide-banner')
}

if (process.server) {
  useHead({
    script: [{
      key: 'prehydrate-template-banner',
      innerHTML: `
            if (localStorage.getItem('${id}') === 'true') {
              document.querySelector('html').classList.add('hide-banner')
            }`.replace(/\s+/g, ' '),
      type: 'text/javascript'
    }]
  })
}
</script>

<template>
  <div class="relative bg-background/75 backdrop-blur z-50 border-b border-gray-200 dark:border-gray-800 app-banner">
    <UContainer>
      <NuxtLink v-if="to" :to="to" class="focus:outline-none" tabindex="-1">
        <span class="absolute inset-0 " aria-hidden="true" />
      </NuxtLink>

      <div class="flex items-center justify-between h-12">
        <div class="lg:flex-1 flex items-center" />

        <p class="text-sm font-medium flex items-center gap-1 text-gray-900 dark:text-white">
          <UIcon name="i-heroicons-gift" class=" w-5 h-5" />
          <span class="font-semibold">Nuxt UI Pro</span> <UBadge label="v1.0" size="xs" class="rounded" color="white" /> is out with Dashboard components! Discounted prices end {{ timeAgo }}.
        </p>

        <div class="flex items-center justify-end lg:flex-1">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            @click.prevent="hideBanner"
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.hide-banner .app-banner {
  display: none;
}
</style>
