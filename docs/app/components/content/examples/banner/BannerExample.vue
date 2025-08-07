<script setup lang="ts">
import type { BannerProps } from '@nuxt/ui'

const { id = 'example' } = defineProps<{
  id?: string
  title?: string
  color?: BannerProps['color']
  closeIcon?: string
}>()

function onClose() {
  localStorage.removeItem(`banner-${id}`)

  setTimeout(() => {
    document.querySelector('html')?.classList.remove('hide-banner')
  }, 1000)
}

onBeforeMount(() => {
  localStorage.removeItem(`banner-${id}`)
})
</script>

<template>
  <UBanner
    :id="id"
    :title="title || 'This is a closable banner'"
    :color="color"
    :close-icon="closeIcon"
    close
    @close="onClose"
  />
</template>
