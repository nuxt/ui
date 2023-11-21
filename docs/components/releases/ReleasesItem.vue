<template>
  <div ref="target" class="flex-shrink-0 flex flex-col transition-opacity duration-500" :class="targetIsVisible ? 'opacity-100' : 'opacity-25'">
    <time :datetime="date.day.toISOString()" class="text-sm/6 font-semibold text-gray-500 dark:text-gray-400">{{ date.day.toLocaleString('en-us', { year: 'numeric', month: 'short', day: 'numeric' })
    }}</time>

    <NuxtLink v-if="date.release" :to="`https://github.com/nuxt/ui/releases/tag/${date.release.name}`" target="_blank" class="text-gray-900 dark:text-white font-bold text-3xl mt-2 group hover:text-primary-500 dark:hover:text-primary-400 transition-[color]">
      {{ date.release.name }}
    </NuxtLink>
    <div v-else-if="date.pull" class="text-gray-600 dark:text-gray-300 text-sm inline-flex gap-1 mt-2">
      <NuxtLink :to="`https://github.com/${date.pull.user.login}`" target="_blank" class="text-gray-900 dark:text-white transition-colors inline-flex items-center gap-0.5 rounded-full bg-gray-100/50 dark:bg-gray-800/50 dark:hover:bg-gray-800 p-0.5 pr-1 ring-1 ring-gray-300 dark:ring-gray-700 text-xs font-medium">
        <UAvatar :src="`https://github.com/${date.pull.user.login}.png`" size="3xs" />

        {{ date.pull.user.login }}
      </NuxtLink>

      <span class="truncate max-w-[24rem]">pushed <NuxtLink :to="date.pull.html_url" target="_blank" class="font-medium text-gray-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-[color]">#{{ date.pull.number }} {{ date.pull.title }}</NuxtLink></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

defineProps<{
  date: {
    day: Date
    release?: {
      name: string
    }
    pull?: {
      number: number
      title: string
      html_url: string
      user: {
        login: string
      }
    }
  }
}>()

const target = ref(null)
const targetIsVisible = ref(false)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  targetIsVisible.value = isIntersecting
}, {
  threshold: 1,
  rootMargin: '0px 0px -68px 0px'
})
</script>
