<script setup lang="ts">
import { isAfter } from 'date-fns'

const id = 'nuxt-ui-banner-1'
const to = '/pro/pricing'
const date = new Date('2024-02-25T20:00:00Z')

const timeAgo = useTimeAgo(date)

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

onMounted(() => {
  if (isAfter(new Date(), date)) {
    hideBanner()
    return
  }

  const interval = setInterval(() => {
    if (isAfter(new Date(), date)) {
      hideBanner()
      clearInterval(interval)
    }
  }, 1000)
})
</script>

<template>
  <div class="relative bg-primary hover:bg-primary/90 transition-[background] backdrop-blur z-50 app-banner">
    <UContainer class="py-2">
      <NuxtLink v-if="to" :to="to" class="focus:outline-none" tabindex="-1">
        <span class="absolute inset-0 " aria-hidden="true" />
      </NuxtLink>

      <div class="flex items-center justify-between gap-2">
        <div class="lg:flex-1 hidden lg:flex items-center" />

        <p class="text-sm font-medium text-white dark:text-gray-900">
          <UIcon name="i-heroicons-gift" class="w-5 h-5 align-top flex-shrink-0 pointer-events-none mr-2" />
          <span class="font-semibold">Nuxt UI Pro v1.0</span> is out with dashboard components! Discount ends <span class="font-semibold">{{ timeAgo }}</span>.
        </p>

        <div class="flex items-center justify-end lg:flex-1">
          <button
            class="p-1.5 rounded-md inline-flex hover:bg-primary/90"
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
