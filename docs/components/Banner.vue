<script setup lang="ts">
const id = 'nuxt-ui-banner-3'
const to = '/pro/pricing'

const hideBanner = () => {
  localStorage.setItem(id, 'true')

  document.querySelector('html')?.classList.add('hide-banner')
}

if (import.meta.server) {
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
      <NuxtLink
        v-if="to"
        :to="to"
        class="focus:outline-none"
        aria-label="20% off on all Nuxt UI Pro products for Black Friday week"
        tabindex="-1"
      >
        <span class="absolute inset-0 " aria-hidden="true" />
      </NuxtLink>

      <div class="flex items-center justify-between gap-2">
        <div class="lg:flex-1 hidden lg:flex items-center" />

        <p class="text-sm font-medium text-white dark:text-gray-900 truncate">
          <UIcon name="i-ri-discount-percent-fill" class="size-5 align-top flex-shrink-0 pointer-events-none mr-2" />
          <span class="font-bold">Black Friday Week</span>: <UBadge label="20% off" color="white" class="ring-0 font-semibold" /> on all Nuxt UI Pro products from <span class="font-semibold">Nov 25</span> to <span class="font-semibold">Dec 2</span>!
        </p>

        <!-- <UButton
          :to="to"
          target="_blank"
          label="Buy now"
          color="black"
          variant="solid"
          size="2xs"
          trailing-icon="i-heroicons-arrow-right-20-solid"
        /> -->

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
