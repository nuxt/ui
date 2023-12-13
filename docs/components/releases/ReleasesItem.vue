<template>
  <div ref="target" class="flex flex-col transition-opacity duration-500" :class="targetIsVisible ? 'opacity-100' : 'opacity-25'">
    <time :datetime="date.day.toISOString()" class="flex-shrink-0 text-sm/6 font-semibold text-gray-500 dark:text-gray-400">{{ date.day.toLocaleString('en-us', { year: 'numeric', month: 'short', day: 'numeric' })
    }}</time>

    <NuxtLink v-if="date.release" :to="`https://github.com/nuxt/ui/releases/tag/${date.release.name}`" target="_blank" class="text-gray-900 dark:text-white font-bold text-3xl mt-2 group hover:text-primary-500 dark:hover:text-primary-400 transition-[color]">
      {{ date.release.name }}
    </NuxtLink>
    <ul v-if="date.pulls?.length" class="mt-2 space-y-1 text-gray-600 dark:text-gray-300">
      <li v-for="pull in date.pulls" :key="pull.id" class="text-sm/6 break-all">
        <NuxtLink :to="`https://github.com/${pull.user.login}`" target="_blank" class="text-gray-900 dark:text-white transition-colors inline-flex items-center gap-1 rounded-full bg-gray-100/50 dark:bg-gray-800/50 dark:hover:bg-gray-800 p-0.5 pr-1 ring-1 ring-gray-300 dark:ring-gray-700 text-xs font-medium flex-shrink-0 align-middle">
          <UAvatar :src="`https://github.com/${pull.user.login}.png`" size="3xs" />

          {{ pull.user.login }}
        </NuxtLink>

        pushed <NuxtLink :to="pull.html_url" target="_blank" class="font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400 transition-[color]">
          #{{ pull.number }} {{ pull.title }}
        </NuxtLink>
      </li>
    </ul>
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
    pulls?: {
      id: number
      number: number
      title: string
      html_url: string
      user: {
        login: string
      }
    }[]
  }
}>()

const target = ref(null)
const targetIsVisible = ref(false)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  targetIsVisible.value = isIntersecting
}, {
  rootMargin: '-68px 0px -68px 0px'
})
</script>
