<script setup lang="ts">
const id = 'nuxt-ui-banner-1'
const to = '/pro/pricing'

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
  <div class="relative bg-primary hover:bg-primary/90 transition-[background] backdrop-blur z-50 app-banner">
    <UContainer class="py-2">
      <NuxtLink v-if="to" :to="to" class="focus:outline-none" aria-label="Nuxt UI Pro pricing" tabindex="-1">
        <span class="absolute inset-0 " aria-hidden="true" />
      </NuxtLink>

      <div class="flex items-center justify-between gap-2">
        <div class="lg:flex-1 hidden lg:flex items-center" />

        <p class="text-sm font-medium text-white dark:text-gray-900">
          <UIcon name="i-heroicons-rocket-launch" class="w-5 h-5 align-top flex-shrink-0 pointer-events-none mr-2" />
          <span class="font-semibold">Nuxt UI Pro v1.0</span> is out with dashboard components!
        </p>

        <div class="flex items-center justify-end lg:flex-1">
          <button
            class="p-1.5 rounded-md inline-flex hover:bg-primary/90"
            aria-label="Close banner"
            @click.prevent="hideBanner"
          >
            <UIcon name="i-heroicons-x-mark-20-solid" class="w-5 h-5 text-white dark:text-gray-900" />
          </button>
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
